// battleAnimation.js

import { playThunderSound, playMolniyaSound, setThunderSoundDuration } from './sound.js';

export function initBattleAnimation() {
    let container = document.querySelector('.animation_fight');
    
    if (!container) {
        console.error('Контейнер .animation_fight не найден');
        return null;
    }
    
    // ========== ЧТЕНИЕ ДЛИТЕЛЬНОСТИ ИЗ HTML ==========
    const thunderDurationAttr = container.getAttribute('data-thunder-duration');
    if (thunderDurationAttr) {
        const duration = parseInt(thunderDurationAttr, 10);
        if (!isNaN(duration) && duration > 0) {
            setThunderSoundDuration(duration);
            console.log(`⚡ Длительность звука грома из HTML: ${duration}мс`);
        }
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
    
    // Флаги для защиты от слишком частых звуков
    let lastThunderTime = 0;
    let lastMolniyaTime = 0;
    const SOUND_COOLDOWN = 500; // миллисекунд
    
    // Функция проверки видимости блока
    function checkVisibility() {
        if (!container) return false;
        
        const rect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Блок считается видимым, если он находится в пределах окна
        isVisible = rect.top <= windowHeight && rect.bottom >= 0;
        
        return isVisible;
    }
    
    // Обработчик событий Spine (с проверкой видимости)
    function onSpineEvent(entry, event) {
        // Проверяем, видим ли блок с анимацией
        if (!checkVisibility()) {
            console.log('Блок анимации не видим, звук не воспроизводится');
            return;
        }
        
        console.log('Spine event получен:', entry, event);
        
        if (!event) {
            console.log('Нет event');
            return;
        }
        
        const eventName = event.data?.name || event.name;
        console.log('Имя события:', eventName);
        
        if (eventName === 'thunder') {
            const now = Date.now();
            if (now - lastThunderTime >= SOUND_COOLDOWN) {
                lastThunderTime = now;
                playThunderSound();
                console.log('Воспроизводим звук грома (long_L)');
            }
        } else if (eventName === 'punch') {
            const now = Date.now();
            if (now - lastMolniyaTime >= SOUND_COOLDOWN) {
                lastMolniyaTime = now;
                playMolniyaSound();
                console.log('Воспроизводим звук молнии (electr)');
            }
        }
    }
    
    // Слушатель скролла для обновления видимости
    function onScroll() {
        checkVisibility();
    }
    
    // Настройка длины звука грома (можно вызвать извне)
    // Длительность в миллисекундах. Пример: setThunderDuration(3000) - 3 секунды
    window.setThunderDuration = function(durationMs) {
        setThunderSoundDuration(durationMs);
        console.log(`Длительность звука грома установлена на ${durationMs}мс`);
    };
    console.log('Значение data-thunder-duration:', thunderDurationAttr);
    
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
        checkVisibility(); // При ресайзе также проверяем видимость
    }
    
    // Добавляем слушатели событий
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Первоначальная проверка видимости
    checkVisibility();
    
    initApp();
    
    app.loader
        .add("spine", "assets/animations/battle/battle_sk.json")
        .load((loader, resources) => {
            spineCharacter = new PIXI.spine.Spine(resources.spine.spineData);
            window.battleSpine = spineCharacter;
            
            setTimeout(() => {
                const bounds = spineCharacter.getBounds();
                originalBounds = {
                    width: bounds.width,
                    height: bounds.height,
                    x: bounds.x,
                    y: bounds.y
                };
                
                updateSizeAndPosition();
                app.stage.addChild(spineCharacter);
                
                // Добавляем глобальный обработчик событий Spine
                const globalListener = {
                    event: (entry, event) => {
                        onSpineEvent(entry, event);
                    }
                };
                spineCharacter.state.addListener(globalListener);
                
                const animations = spineCharacter.state.data.skeletonData.animations;
                console.log('Available animations:', animations.map(a => a.name));
                
                if (animations && animations.length > 0) {
                    const firstAnimation = animations[0].name;
                    spineCharacter.state.setAnimation(0, firstAnimation, true);
                } else {
                    const possibleAnimations = ["animation", "idle", "battle", "fight", "attack"];
                    for (const animName of possibleAnimations) {
                        try {
                            spineCharacter.state.setAnimation(0, animName, true);
                            break;
                        } catch(e) {
                            // игнорируем ошибки
                        }
                    }
                }
            }, 100);
        });
    
    return { app, container };
}

export function removeBattleAnimation() {
    const container = document.querySelector('.animation_fight');
    if (container) {
        container.innerHTML = '';
        container.style.minHeight = '';
    }
    
    window.battleSpine = null;
    window.setThunderDuration = null;
}