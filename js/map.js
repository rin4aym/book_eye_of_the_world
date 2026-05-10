// map.js
import { createLightFx } from './lightFx.js';
import { createMapMarkers } from './mapMarkers.js';
import { initWindows } from './windows.js';
import { initPathLines } from './pathLines.js';
import { initWelcomePopup } from './welcome.js';
import { isMobile, getMapPath, getCoordinateScale } from './mapConfig.js';

export function initMap() {
    const container = document.getElementById('map');
    const overlay = document.getElementById('map-overlay');

    let velocity = { x: 0, y: 0 };
    let lastMoveTime = 0;
    let lastMovePos = null;
    let inertiaFrame = null;
    let zoomVelocity = 0;
    let currentZoomTarget = null;
    let lastMousePos = { x: 0, y: 0 };
    let currentScale = 1;
    
    // Определяем мобильное устройство
    const mobile = isMobile();

    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.background = '#000';
    container.style.touchAction = 'none';

    const app = new PIXI.Application({
        width: container.clientWidth,
        height: container.clientHeight,
        backgroundColor: 0x000000,
    
        antialias: true,
    
        resolution: window.devicePixelRatio || 1,
    
        autoDensity: true,
    
        powerPreference: "high-performance"
    });

    container.appendChild(app.view);

    const canvas = app.view;
    canvas.style.display = 'block';
    

    const camera = new PIXI.Container();
    app.stage.addChild(camera);

    let mapSprite;
    let isDragging = false;
    let lastPos = null;
    
    let initialPinchDistance = 0;
    let initialScale = 1;

    // Функция для обновления размера приложения
    function resizeApp() {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        
        app.renderer.resize(newWidth, newHeight);
        
        if (mapSprite) {
            const texW = mapSprite.texture.width;
            const texH = mapSprite.texture.height;
            
            let scale;
            if (mobile) {
                // Мобилка: растягиваем по ВЫСОТЕ, чтобы не было пустот
                scale = newHeight / texH;
            } else {
                const scaleX = newWidth / texW;
                const scaleY = newHeight / texH;
                scale = Math.max(scaleX, scaleY);
            }
            
            camera.scale.set(scale);
            currentScale = scale;
            
            const scaledTexW = texW * camera.scale.x;
            const scaledTexH = texH * camera.scale.y;
            
            camera.x = (newWidth - scaledTexW) / 2;
            camera.y = (newHeight - scaledTexH) / 2;
            
            clampCamera();
        }
    }

    function onFullscreenChange() {
        setTimeout(() => {
            resizeApp();
            const resizeEvent = new Event('resize');
            window.dispatchEvent(resizeEvent);
        }, 100);
    }

    document.addEventListener('fullscreenchange', onFullscreenChange);

    const mapPath = getMapPath();
    console.log('Loading map:', mapPath, 'Mobile:', mobile);

    PIXI.Loader.shared
        .add('map', mapPath)
        .load((loader, resources) => {
            mapSprite = new PIXI.Sprite(resources.map.texture);
            camera.addChild(mapSprite);
            
            setupInitialView();
            setupInteraction();
            setupResizeHandler();

            initPathLines(camera);
            createLightFx(app, camera);      
            createMapMarkers(camera);
            initWindows();
        });
    
        function setupInitialView() {
            const screenW = app.screen.width;
            const screenH = app.screen.height;
            
            const texW = mapSprite.texture.width;
            const texH = mapSprite.texture.height;
            
            let scale;
            if (mobile) {
                // Мобилка: растягиваем по ВЫСОТЕ
                scale = screenH / texH;
            } else {
                const scaleX = screenW / texW;
                const scaleY = screenH / texH;
                scale = Math.max(scaleX, scaleY);
            }
            
            camera.scale.set(scale);
            
            const scaledTexW = texW * camera.scale.x;
            const scaledTexH = texH * camera.scale.y;
            
            camera.x = (screenW - scaledTexW) / 2;
            camera.y = (screenH - scaledTexH) / 2;
            
            clampCamera();
        }
    
    function setupResizeHandler() {
        window.addEventListener('resize', () => {
            resizeApp();
        });
    }
    
    function getPinchDistance(touches) {
        if (touches.length < 2) return 0;
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    function setupInteraction() {
        // Мышь (десктоп)
        app.view.addEventListener('pointerdown', (e) => {
            if (mobile && e.pointerType !== 'mouse') return;
            stopInertia();
            isDragging = true;
            lastPos = { x: e.clientX, y: e.clientY };
            lastMoveTime = performance.now();
            lastMovePos = { x: e.clientX, y: e.clientY };
            app.view.style.cursor = 'grabbing';
        });
        
        window.addEventListener('pointerup', () => {
            if (isDragging) {
                isDragging = false;
                app.view.style.cursor = 'grab';
                if (!mobile) startInertia();
            }
        });
        
        window.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            if (mobile && e.pointerType !== 'mouse') return;
            
            const dx = e.clientX - lastPos.x;
            const dy = e.clientY - lastPos.y;
            
            camera.x += dx;
            camera.y += dy;
            
            const now = performance.now();
            const dt = Math.max(1, now - lastMoveTime);
            
            velocity.x = (e.clientX - lastMovePos.x) / dt * 16;
            velocity.y = (e.clientY - lastMovePos.y) / dt * 16;
            
            const maxSpeed = mobile ? 8 : 15;
            velocity.x = Math.min(maxSpeed, Math.max(-maxSpeed, velocity.x));
            velocity.y = Math.min(maxSpeed, Math.max(-maxSpeed, velocity.y));
            
            lastMoveTime = now;
            lastMovePos = { x: e.clientX, y: e.clientY };
            lastPos = { x: e.clientX, y: e.clientY };
            
            clampCamera();
        });
        
        // Колесико (десктоп)
        app.view.addEventListener('wheel', (e) => {
            if (mobile) return;
            e.preventDefault();
            stopInertia();
            
            lastMousePos = { x: e.clientX, y: e.clientY };
            
            const minScale = getMinScale();
            const maxScale = minScale * 3;
            
            const zoomSpeed = 0.04;
            const zoomDelta = -e.deltaY * zoomSpeed;
            
            zoomVelocity += zoomDelta * 0.3;
            zoomVelocity = Math.min(0.03, Math.max(-0.03, zoomVelocity));
            
            startZoomInertia(minScale, maxScale);
        }, { passive: false });
        
        // Мобильные жесты
        if (mobile) {
            canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (e.touches.length === 2) {
                    initialPinchDistance = getPinchDistance(e.touches);
                    initialScale = camera.scale.x;
                    stopInertia();
                } else if (e.touches.length === 1) {
                    isDragging = true;
                    lastPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                }
            });
            
            canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                
                if (e.touches.length === 2 && initialPinchDistance > 0) {
                    const newDistance = getPinchDistance(e.touches);
                    const scaleFactor = newDistance / initialPinchDistance;
                    let newScale = initialScale * scaleFactor;
                    
                    const minScale = getMinScale();
                    const maxScale = minScale * 2.5;
                    newScale = Math.max(minScale, Math.min(maxScale, newScale));
                    
                    const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                    const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                    
                    const worldPos = {
                        x: (centerX - camera.x) / camera.scale.x,
                        y: (centerY - camera.y) / camera.scale.y
                    };
                    
                    camera.scale.set(newScale);
                    camera.x = centerX - worldPos.x * newScale;
                    camera.y = centerY - worldPos.y * newScale;
                    
                    clampCamera();
                    
                } else if (e.touches.length === 1 && isDragging) {
                    const dx = e.touches[0].clientX - lastPos.x;
                    const dy = e.touches[0].clientY - lastPos.y;
                    
                    camera.x += dx;
                    camera.y += dy;
                    
                    lastPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                    clampCamera();
                }
            });
            
            canvas.addEventListener('touchend', (e) => {
                if (e.touches.length < 2) {
                    initialPinchDistance = 0;
                }
                if (e.touches.length === 0) {
                    isDragging = false;
                }
            });
        }
        
        app.view.style.cursor = 'grab';
    }
    
    function startZoomInertia(minScale, maxScale) {
        if (currentZoomTarget) cancelAnimationFrame(currentZoomTarget);
        
        function animateZoom() {
            if (Math.abs(zoomVelocity) < 0.0005) {
                zoomVelocity = 0;
                currentZoomTarget = null;
                return;
            }
            
            const oldScale = camera.scale.x;
            let newScale = oldScale * (1 + zoomVelocity);
            newScale = Math.max(minScale, Math.min(maxScale, newScale));
            
            if (newScale !== oldScale) {
                const mouseX = lastMousePos.x;
                const mouseY = lastMousePos.y;
                
                const worldPos = {
                    x: (mouseX - camera.x) / oldScale,
                    y: (mouseY - camera.y) / oldScale
                };
                
                camera.scale.set(newScale);
                camera.x = mouseX - worldPos.x * newScale;
                camera.y = mouseY - worldPos.y * newScale;
                clampCamera();
            }
            
            zoomVelocity *= 0.92;
            currentZoomTarget = requestAnimationFrame(animateZoom);
        }
        
        currentZoomTarget = requestAnimationFrame(animateZoom);
    }
    
    function startInertia() {
        if (inertiaFrame) cancelAnimationFrame(inertiaFrame);
        
        const friction = mobile ? 0.96 : 0.92;
        
        function animate() {
            if (isDragging) return;
            
            let moved = false;
            const threshold = mobile ? 0.1 : 0.05;
            
            if (Math.abs(velocity.x) > threshold || Math.abs(velocity.y) > threshold) {
                camera.x += velocity.x;
                camera.y += velocity.y;
                
                velocity.x *= friction;
                velocity.y *= friction;
                
                clampCamera();
                moved = true;
            }
            
            if (moved) {
                inertiaFrame = requestAnimationFrame(animate);
            } else {
                velocity.x = 0;
                velocity.y = 0;
                inertiaFrame = null;
            }
        }
        
        inertiaFrame = requestAnimationFrame(animate);
    }
    
    function stopInertia() {
        if (inertiaFrame) cancelAnimationFrame(inertiaFrame);
        inertiaFrame = null;
        velocity = { x: 0, y: 0 };
        
        if (currentZoomTarget) cancelAnimationFrame(currentZoomTarget);
        currentZoomTarget = null;
        zoomVelocity = 0;
    }
    
    // 🔥 ИСПРАВЛЕННАЯ ФУНКЦИЯ clampCamera
    function clampCamera() {
        if (!mapSprite) return;
        
        const screenW = app.screen.width;
        const screenH = app.screen.height;
        
        const texW = mapSprite.texture.width * camera.scale.x;
        const texH = mapSprite.texture.height * camera.scale.y;
        
        if (mobile) {
            // Горизонтальные границы
            if (texW > screenW) {
                if (camera.x > 0) camera.x = 0;
                if (camera.x < screenW - texW) camera.x = screenW - texW;
            } else {
                camera.x = (screenW - texW) / 2;
            }
            
            // 🔥 ВЕРТИКАЛЬНЫЕ ГРАНИЦЫ - разрешаем движение только если карта выше экрана
            if (texH > screenH) {
                // Карта выше экрана - можно двигать вверх/вниз
                if (camera.y > 0) camera.y = 0;
                if (camera.y < screenH - texH) camera.y = screenH - texH;
            } else {
                // Карта ниже экрана - центрируем и блокируем
                camera.y = (screenH - texH) / 2;
            }
            
        } else {
            // Десктопная версия
            if (texW > screenW) {
                if (camera.x > 0) camera.x = 0;
                if (camera.x < screenW - texW) camera.x = screenW - texW;
            } else {
                camera.x = (screenW - texW) / 2;
            }
            
            if (texH > screenH) {
                if (camera.y > 0) camera.y = 0;
                if (camera.y < screenH - texH) camera.y = screenH - texH;
            } else {
                camera.y = (screenH - texH) / 2;
            }
        }
    }
    
    function getMinScale() {
        if (!mapSprite) return 1;
        
        const screenW = app.screen.width;
        const screenH = app.screen.height;
        const texW = mapSprite.texture.width;
        const texH = mapSprite.texture.height;
        
        if (mobile) {
            // Мобилка: минимальный масштаб по ВЫСОТЕ
            return screenH / texH;
        } else {
            const scaleX = screenW / texW;
            const scaleY = screenH / texH;
            return Math.max(scaleX, scaleY);
        }
    }

    initWelcomePopup();
}