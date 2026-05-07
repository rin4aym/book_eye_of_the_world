// ========== КООРДИНАТЫ ПУТЕЙ ГЕРОЕВ ==========
export const heroPathsData = {
    mor: {
        color: '#3E61D2',
        name: 'Мор',
        points: [
            { x: 1667, y: 2488 },
            { x: 1903, y: 2209 },
            { x: 2633, y: 2489 },
            { x: 3031, y: 2589 },
            { x: 3748, y: 1068 }
        ]
    },
    rand: {
        color: '#67960F',
        name: 'Ранд',
        points: [
            { x: 1728, y: 2300 },
            { x: 2287, y: 2611 },
            { x: 3474, y: 2182 }
        ]
    },
    per: {
        color: '#B45400',
        name: 'Пер',
        points: [
            { x: 3123, y: 1938 },
            { x: 3268, y: 1745 },
            { x: 3853, y: 1278 }
        ]
    },
    mat: {
        color: '#8C3D3D',
        name: 'Мат',
        points: [
            { x: 4017, y: 479 },
            { x: 3586, y: 141 },
            { x: 3055, y: 299 }
        ]
    },
    eg: {
        color: '#854FA4',
        name: 'Эг',
        points: [
            { x: 1667, y: 2488 },
            { x: 3748, y: 1068 }
        ]
    },
    nay: {
        color: '#208C76',
        name: 'Най',
        points: [
            { x: 1903, y: 2209 },
            { x: 3853, y: 1278 }
        ]
    },
    lan: {
        color: '#23881D',
        name: 'Лан',
        points: [
            { x: 1728, y: 2300 },
            { x: 3748, y: 1068 }
        ]
    }
};

// ========== ПЕРЕМЕННЫЕ ==========
let activePaths = [];
let linesLayer = null;
let camera = null;
let mapSprite = null;
let animationFrame = null;

// ========== ИНИЦИАЛИЗАЦИЯ ==========
export function initPathLines(cameraRef) {
    camera = cameraRef;
    
    // Находим спрайт карты
    for (let i = 0; i < camera.children.length; i++) {
        const child = camera.children[i];
        if (child instanceof PIXI.Sprite && child.texture && child.texture.width > 0) {
            mapSprite = child;
            break;
        }
    }
    
    // Создаём слой для линий
    linesLayer = new PIXI.Container();
    
    // Добавляем слой НАД картой
    const mapIndex = camera.getChildIndex(mapSprite);
    camera.addChildAt(linesLayer, mapIndex + 1);
    
    console.log('Path lines layer initialized');
}

// ========== ПОЛУЧЕНИЕ ПЛАВНОЙ КРИВОЙ (Catmull-Rom) ==========
function getCurvePoints(points, segments = 50) {
    if (points.length < 2) return points;
    if (points.length === 2) {
        // Для двух точек просто прямая
        return [points[0], points[1]];
    }
    
    const result = [];
    
    // Добавляем первую точку
    result.push({ x: points[0].x, y: points[0].y });
    
    // Для каждого сегмента между точками
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];
        
        for (let t = 0; t <= 1; t += 1 / segments) {
            const t2 = t * t;
            const t3 = t2 * t;
            
            const x = 0.5 * ((2 * p1.x) +
                (-p0.x + p2.x) * t +
                (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
                (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
            
            const y = 0.5 * ((2 * p1.y) +
                (-p0.y + p2.y) * t +
                (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
                (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
            
            result.push({ x, y });
        }
    }
    
    // Добавляем последнюю точку
    result.push({ x: points[points.length - 1].x, y: points[points.length - 1].y });
    
    return result;
}

// ========== ОТРИСОВКА ПЛАВНОЙ ЛИНИИ ==========
function drawSmoothPath(points, color, lineWidth = 4) {
    if (!points || points.length < 2) return null;
    
    const smoothPoints = getCurvePoints(points, 40);
    const graphics = new PIXI.Graphics();
    
    // Рисуем основную линию
    graphics.lineStyle(lineWidth, parseInt(color.replace('#', '0x')), 0.8);
    graphics.moveTo(smoothPoints[0].x, smoothPoints[0].y);
    
    for (let i = 1; i < smoothPoints.length; i++) {
        graphics.lineTo(smoothPoints[i].x, smoothPoints[i].y);
    }
    
    // Добавляем свечение (внешняя линия)
    graphics.lineStyle(lineWidth + 2, parseInt(color.replace('#', '0x')), 0.3);
    graphics.moveTo(smoothPoints[0].x, smoothPoints[0].y);
    for (let i = 1; i < smoothPoints.length; i++) {
        graphics.lineTo(smoothPoints[i].x, smoothPoints[i].y);
    }
    
    // Рисуем точки в местах маркеров
    points.forEach(point => {
        // Внешняя точка
        graphics.beginFill(parseInt(color.replace('#', '0x')), 0.8);
        graphics.drawCircle(point.x, point.y, 8);
        graphics.endFill();
        
        // Внутренняя точка
        graphics.beginFill(0xffffff, 0.9);
        graphics.drawCircle(point.x, point.y, 4);
        graphics.endFill();
    });
    
    return { graphics, smoothPoints };
}

// ========== АНИМИРОВАННЫЙ ПУТЬ ==========
class AnimatedPath {
    constructor(points, color, lineWidth = 4, duration = 2000) {
        this.points = points;
        this.color = color;
        this.lineWidth = lineWidth;
        this.duration = duration;
        this.progress = 0;
        this.startTime = null;
        this.graphics = null;
        this.isComplete = false;
        this.smoothPoints = null;
    }
    
    start() {
        this.startTime = performance.now();
        this.smoothPoints = getCurvePoints(this.points, 40);
        this.graphics = new PIXI.Graphics();
        linesLayer.addChild(this.graphics);
        return this;
    }
    
    update(currentTime) {
        if (this.isComplete) return false;
        
        if (!this.startTime) {
            this.start();
            return true;
        }
        
        this.progress = Math.min(1, (currentTime - this.startTime) / this.duration);
        
        if (this.progress >= 1) {
            this.isComplete = true;
            this.drawFull();
            return false;
        }
        
        this.drawPartial();
        return true;
    }
    
    drawPartial() {
        if (!this.graphics || !this.smoothPoints) return;
        
        this.graphics.clear();
        
        const totalPoints = this.smoothPoints.length;
        const pointsToDraw = Math.max(2, Math.floor(totalPoints * this.progress));
        
        // Рисуем основную линию
        this.graphics.lineStyle(this.lineWidth, parseInt(this.color.replace('#', '0x')), 0.8);
        this.graphics.moveTo(this.smoothPoints[0].x, this.smoothPoints[0].y);
        
        for (let i = 1; i < pointsToDraw; i++) {
            this.graphics.lineTo(this.smoothPoints[i].x, this.smoothPoints[i].y);
        }
        
        // Рисуем свечение
        this.graphics.lineStyle(this.lineWidth + 2, parseInt(this.color.replace('#', '0x')), 0.3);
        this.graphics.moveTo(this.smoothPoints[0].x, this.smoothPoints[0].y);
        for (let i = 1; i < pointsToDraw; i++) {
            this.graphics.lineTo(this.smoothPoints[i].x, this.smoothPoints[i].y);
        }
        
        // Рисуем точки только если анимация почти завершена
        if (this.progress > 0.7) {
            this.points.forEach(point => {
                this.graphics.beginFill(parseInt(this.color.replace('#', '0x')), 0.8);
                this.graphics.drawCircle(point.x, point.y, 8);
                this.graphics.endFill();
                
                this.graphics.beginFill(0xffffff, 0.9);
                this.graphics.drawCircle(point.x, point.y, 4);
                this.graphics.endFill();
            });
        }
    }
    
    drawFull() {
        if (!this.graphics || !this.smoothPoints) return;
        
        this.graphics.clear();
        
        // Рисуем основную линию
        this.graphics.lineStyle(this.lineWidth, parseInt(this.color.replace('#', '0x')), 0.8);
        this.graphics.moveTo(this.smoothPoints[0].x, this.smoothPoints[0].y);
        for (let i = 1; i < this.smoothPoints.length; i++) {
            this.graphics.lineTo(this.smoothPoints[i].x, this.smoothPoints[i].y);
        }
        
        // Рисуем свечение
        this.graphics.lineStyle(this.lineWidth + 2, parseInt(this.color.replace('#', '0x')), 0.3);
        this.graphics.moveTo(this.smoothPoints[0].x, this.smoothPoints[0].y);
        for (let i = 1; i < this.smoothPoints.length; i++) {
            this.graphics.lineTo(this.smoothPoints[i].x, this.smoothPoints[i].y);
        }
        
        // Рисуем точки
        this.points.forEach(point => {
            this.graphics.beginFill(parseInt(this.color.replace('#', '0x')), 0.8);
            this.graphics.drawCircle(point.x, point.y, 8);
            this.graphics.endFill();
            
            this.graphics.beginFill(0xffffff, 0.9);
            this.graphics.drawCircle(point.x, point.y, 4);
            this.graphics.endFill();
        });
    }
    
    remove() {
        if (this.graphics) {
            linesLayer.removeChild(this.graphics);
            this.graphics.destroy();
        }
    }
}

let animatedPaths = [];

// ========== АНИМАЦИЯ ВСЕХ ПУТЕЙ ==========
function startAnimationLoop() {
    if (animationFrame) return;
    
    function animate() {
        const now = performance.now();
        let hasActive = false;
        
        for (let i = animatedPaths.length - 1; i >= 0; i--) {
            const path = animatedPaths[i];
            if (path.update(now)) {
                hasActive = true;
            } else if (path.isComplete) {
                // Анимация завершена, оставляем путь на месте
                hasActive = true;
            }
        }
        
        if (hasActive || animatedPaths.length > 0) {
            animationFrame = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
    }
    
    animationFrame = requestAnimationFrame(animate);
}

// ========== ПОКАЗАТЬ ПУТЬ ГЕРОЯ С АНИМАЦИЕЙ ==========
export function showHeroPath(heroId, animated = true) {
    const heroData = heroPathsData[heroId];
    
    if (!heroData) {
        console.warn('Hero not found:', heroId);
        return false;
    }
    
    // Проверяем, не добавлен ли уже этот путь
    const existingPath = activePaths.find(p => p.id === heroId);
    if (existingPath) {
        console.log('Path already active:', heroId);
        return false;
    }
    
    console.log('Showing path for hero:', heroData.name);
    
    if (animated) {
        // Создаём анимированный путь
        const animatedPath = new AnimatedPath(heroData.points, heroData.color, 4, 2000);
        animatedPath.start();
        
        animatedPaths.push(animatedPath);
        activePaths.push({
            id: heroId,
            animatedPath: animatedPath,
            color: heroData.color,
            name: heroData.name,
            points: heroData.points
        });
        
        startAnimationLoop();
    } else {
        // Без анимации
        const { graphics } = drawSmoothPath(heroData.points, heroData.color, 4);
        if (graphics) {
            linesLayer.addChild(graphics);
            activePaths.push({
                id: heroId,
                graphics: graphics,
                color: heroData.color,
                name: heroData.name,
                points: heroData.points
            });
        }
    }
    
    return true;
}

// ========== СКРЫТЬ ПУТЬ ГЕРОЯ ==========
export function hideHeroPath(heroId) {
    const pathIndex = activePaths.findIndex(p => p.id === heroId);
    
    if (pathIndex !== -1) {
        const path = activePaths[pathIndex];
        
        if (path.animatedPath) {
            path.animatedPath.remove();
            const animIndex = animatedPaths.findIndex(ap => ap === path.animatedPath);
            if (animIndex !== -1) {
                animatedPaths.splice(animIndex, 1);
            }
        } else if (path.graphics) {
            linesLayer.removeChild(path.graphics);
            path.graphics.destroy();
        }
        
        activePaths.splice(pathIndex, 1);
        console.log('Path hidden for hero:', path.name);
        return true;
    }
    
    return false;
}

// ========== СКРЫТЬ ВСЕ ПУТИ ==========
export function clearAllPaths() {
    activePaths.forEach(path => {
        if (path.animatedPath) {
            path.animatedPath.remove();
        } else if (path.graphics) {
            linesLayer.removeChild(path.graphics);
            path.graphics.destroy();
        }
    });
    
    animatedPaths = [];
    activePaths = [];
    
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }
    
    console.log('All paths cleared');
}

// ========== ПЕРЕКЛЮЧИТЬ ПУТЬ ==========
export function toggleHeroPath(heroId, animated = true) {
    const isActive = activePaths.some(p => p.id === heroId);
    
    if (isActive) {
        hideHeroPath(heroId);
    } else {
        showHeroPath(heroId, animated);
    }
    
    return !isActive;
}

// ========== ПОЛУЧИТЬ ВСЕ АКТИВНЫЕ ПУТИ ==========
export function getActivePaths() {
    return activePaths.map(p => ({ id: p.id, name: p.name, color: p.color }));
}

// ========== ПРОВЕРИТЬ, АКТИВЕН ЛИ ПУТЬ ==========
export function isPathActive(heroId) {
    return activePaths.some(p => p.id === heroId);
}

// ========== ПОЛУЧИТЬ ВСЕ ДОСТУПНЫЕ ПУТИ ==========
export function getAllHeroPaths() {
    return heroPathsData;
}