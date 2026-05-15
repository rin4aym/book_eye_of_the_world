// ischezAnimation.js

import { playScreamSound, isEffectsEnabled } from './sound.js';

export function initIschezAnimation() {
    let container = document.querySelector('.animation_ischez');
    
    if (!container) {
        console.error('Контейнер .animation_ischez не найден');
        return null;
    }
    
    container.innerHTML = '';
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.minHeight = '400px';
    container.style.overflow = 'visible';
    
    let spineCharacter = null;
    let originalBounds = null;
    let app = null;
    let isVisible = false;
    let screamInterval = null;
    
    // Функция проверки видимости блока
    function checkVisibility() {
        if (!container) return false;
        
        const rect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Блок считается видимым, если он находится в пределах окна
        const wasVisible = isVisible;
        isVisible = rect.top <= windowHeight && rect.bottom >= 0;
        
        // Если видимость изменилась
        if (wasVisible !== isVisible) {
            if (isVisible) {
                startScreamSound();
                console.log('Анимация видима, запускаем звук');
            } else {
                stopScreamSound();
                console.log('Анимация скрыта, останавливаем звук');
            }
        }
        
        return isVisible;
    }
    
    // Запуск циклического звука
    function startScreamSound() {
        if (screamInterval) return;
        
        // Первый звук сразу
        playScreamSound();
        
        // Повторяем каждые 4 секунды (длина звука scream)
        screamInterval = setInterval(() => {
            if (isVisible && isEffectsEnabled()) {
                playScreamSound();
            }
        }, 4000);
    }
    
    // Остановка циклического звука
    function stopScreamSound() {
        if (screamInterval) {
            clearInterval(screamInterval);
            screamInterval = null;
        }
    }
    
    // Слушатель скролла для обновления видимости
    function onScroll() {
        checkVisibility();
    }
    
    // Инициализация слушателей видимости
    function initVisibilityHandlers() {
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        
        // Также проверяем при сворачивании/разворачивании вкладки
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopScreamSound();
                console.log('Вкладка скрыта, останавливаем звук');
            } else {
                checkVisibility();
            }
        });
    }
    
    function initApp() {
        const containerWidth = container.clientWidth;
        const containerHeight = 400;
        
        app = new PIXI.Application({
            width: containerWidth,
            height: containerHeight,
            backgroundAlpha: 0,
            antialias: false,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            powerPreference: "high-performance"
        });
        
        container.appendChild(app.view);
        
        const canvas = app.view;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.display = 'block';
        canvas.style.pointerEvents = 'none';
    }
    
    function updateSizeAndPosition() {
        if (!spineCharacter || !originalBounds) return;
        
        const containerWidth = container.clientWidth;
        const scale = containerWidth / originalBounds.width;
        const scaledHeight = originalBounds.height * scale;
        
        const newHeight = Math.max(scaledHeight + 40, 300);
        container.style.minHeight = `${newHeight}px`;
        
        app.renderer.resize(containerWidth, newHeight);
        
        spineCharacter.scale.set(scale);
        
        const scaledWidth = originalBounds.width * scale;
        spineCharacter.x = (app.screen.width - scaledWidth) / 2 - originalBounds.x * scale;
        spineCharacter.y = (app.screen.height - scaledHeight) / 2 - originalBounds.y * scale;
    }
    
    function resize() {
        updateSizeAndPosition();
        checkVisibility();
    }
    
    // Инициализируем слушатели видимости
    initVisibilityHandlers();
    
    window.addEventListener('resize', resize);
    
    initApp();
    
    app.loader
        .add("spine", "assets/animations/ischez/skelet_ischez.json")
        .load((loader, resources) => {
            spineCharacter = new PIXI.spine.Spine(resources.spine.spineData);
            window.ischezSpine = spineCharacter;
            
            setTimeout(() => {
                const bounds = spineCharacter.getBounds();
                originalBounds = {
                    width: bounds.width,
                    height: bounds.height,
                    x: bounds.x,
                    y: bounds.y
                };
                
                console.log('Ischez animation bounds:', originalBounds);
                
                updateSizeAndPosition();
                app.stage.addChild(spineCharacter);
                
                // Запускаем анимацию "animation" зацикленно
                spineCharacter.state.setAnimation(0, "animation", true);
                console.log('Playing animation: animation');
                
                // Проверяем видимость при старте
                checkVisibility();
            }, 100);
        });
    
    // Очистка при удалении
    return { 
        app, 
        container,
        destroy: () => {
            stopScreamSound();
            window.removeEventListener('scroll', onScroll);
        }
    };
}

export function removeIschezAnimation() {
    const container = document.querySelector('.animation_ischez');
    if (container) {
        container.innerHTML = '';
        container.style.minHeight = '';
    }
    
    // Останавливаем звук при удалении
    if (window.ischezSpine?.destroy) {
        window.ischezSpine.destroy();
    }
    window.ischezSpine = null;
}