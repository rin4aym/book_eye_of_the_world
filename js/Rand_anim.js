// randAnimation.js

export function initRandAnimation() {
    let container = document.querySelector('.animation_rand');
    
    if (!container) {
        console.error('Контейнер .animation_rand не найден');
        return null;
    }
    
    container.innerHTML = '';
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.minHeight = '400px';
    container.style.overflow = 'visible';
    
    let switchBtn = document.getElementById('randSwitch');
    if (!switchBtn) {
        switchBtn = document.createElement('button');
        switchBtn.id = 'randSwitch';
        switchBtn.textContent = 'Переключить';
        switchBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            padding: 10px 16px;
            z-index: 1000;
            cursor: pointer;
            background: #C7AA7F;
            border: none;
            border-radius: 30px;
            color: white;
        `;
        document.body.appendChild(switchBtn);
    }
    
    let spineCharacter = null;
    let originalBounds = null;
    let app = null;
    
    function initApp() {
        const containerWidth = container.clientWidth;
        // Высоту будем задавать после получения bounds анимации
        const containerHeight = 400; // временная высота
        
        app = new PIXI.Application({
            width: containerWidth,
            height: containerHeight,
            backgroundAlpha: 0,
            antialias: true
        });
        
        container.appendChild(app.view);
        
        const canvas = app.view;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.display = 'block';
    }
    
    function updateSizeAndPosition() {
        if (!spineCharacter || !originalBounds) return;
        
        // Вычисляем нужную высоту контейнера на основе масштаба
        const containerWidth = container.clientWidth;
        const scale = (containerWidth / originalBounds.width) * 1;
        const scaledHeight = originalBounds.height * scale;
        
        // Устанавливаем высоту контейнера с отступом
        const newHeight = Math.max(scaledHeight + 40, 300);
        container.style.minHeight = `${newHeight}px`;
        
        // Изменяем размер приложения
        app.renderer.resize(containerWidth, newHeight);
        
        // Применяем масштаб и позицию
        spineCharacter.scale.set(scale);
        
        // Центрируем по горизонтали
        const scaledWidth = originalBounds.width * scale;
        spineCharacter.x = (app.screen.width - scaledWidth) / 2 - originalBounds.x * scale;
        
        // Центрируем по вертикали
        spineCharacter.y = (app.screen.height - scaledHeight) / 2 - originalBounds.y * scale;
    }
    
    function resize() {
        updateSizeAndPosition();
    }
    
    window.addEventListener('resize', resize);
    
    initApp();
    
    app.loader
        .add("spine", "assets/animations/rand_walk/animation_rand.json")
        .load((loader, resources) => {
            spineCharacter = new PIXI.spine.Spine(resources.spine.spineData);
            window.spineChar = spineCharacter;
            
            setTimeout(() => {
                const bounds = spineCharacter.getBounds();
                originalBounds = {
                    width: bounds.width,
                    height: bounds.height,
                    x: bounds.x,
                    y: bounds.y
                };
                
                console.log('Original bounds:', originalBounds);
                
                updateSizeAndPosition();
                app.stage.addChild(spineCharacter);
            }, 100);
            
            const idleAnimations = [
                "idle_left_1",
                "idle_right_3",
                "idle_left_5",
                "idle_right_7",
                "idle_left_9"
            ];
            
            const stepMap = {
                "idle_left_1": "left_step_2",
                "idle_right_3": "right_step_4",
                "idle_left_5": "left_step_6",
                "idle_right_7": "right_step_8"
            };
            
            Object.keys(stepMap).forEach(idle => {
                const step = stepMap[idle];
                spineCharacter.state.data.setMix(idle, step, 0.5);
                spineCharacter.state.data.setMix(step, idle, 0.5);
            });
            
            let currentIndex = 0;
            let isPlayingStep = false;
            
            function playIdle() {
                const anim = idleAnimations[currentIndex];
                spineCharacter.state.setAnimation(0, anim, true);
            }
            
            function playStep() {
                const currentIdle = idleAnimations[currentIndex];
                const stepAnim = stepMap[currentIdle];
                
                if (!stepAnim) return;
                
                isPlayingStep = true;
                
                spineCharacter.state.setAnimation(0, stepAnim, false);
                
                const listener = {
                    complete: function (entry) {
                        if (entry.animation.name === stepAnim) {
                            spineCharacter.state.removeListener(listener);
                            
                            currentIndex++;
                            
                            if (currentIndex >= idleAnimations.length) {
                                const btn = document.getElementById('randSwitch');
                                if (btn) btn.style.display = 'none';
                                return;
                            }
                            
                            playIdle();
                            isPlayingStep = false;
                            
                            if (idleAnimations[currentIndex] === "idle_left_9") {
                                const btn = document.getElementById('randSwitch');
                                if (btn) btn.style.display = 'none';
                            }
                        }
                    }
                };
                
                spineCharacter.state.addListener(listener);
            }
            
            playIdle();
            
            switchBtn.onclick = () => {
                if (!isPlayingStep) playStep();
            };
        });
    
    return { app, container };
}

export function removeRandAnimation() {
    const container = document.querySelector('.animation_rand');
    if (container) {
        container.innerHTML = '';
        container.style.minHeight = '';
    }
    
    const btn = document.getElementById('randSwitch');
    if (btn) btn.remove();
    
    window.spineChar = null;
}