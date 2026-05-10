
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
    
    function initApp() {
        const containerWidth = container.clientWidth;
        const containerHeight = 400;
        
        app = new PIXI.Application({
            width: containerWidth,
            height: containerHeight,
            backgroundAlpha: 0,
            antialias: false,        // ОТКЛЮЧИ сглаживание (самое важное!)
            resolution: window.devicePixelRatio || 1,           // Не используй retina-разрешение
            autoDensity: true,      // Отключи авто-плотность
            powerPreference: "high-performance"  // Запрос высокой производительности
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
    }
    
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
            }, 100);
        });
    
    return { app, container };
}

export function removeIschezAnimation() {
    const container = document.querySelector('.animation_ischez');
    if (container) {
        container.innerHTML = '';
        container.style.minHeight = '';
    }
    
    window.ischezSpine = null;
}