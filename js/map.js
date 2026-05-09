import { createLightFx } from './lightFx.js';
import { createMapMarkers } from './mapMarkers.js';
import { initWindows } from './windows.js';
import { initPathLines } from './pathLines.js';
import { initWelcomePopup } from './welcome.js';

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

    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.background = '#000';

    const app = new PIXI.Application({
        width: container.clientWidth,
        height: container.clientHeight,
        backgroundColor: 0x000000,
        antialias: true
    });

    container.appendChild(app.view);

    const canvas = app.view;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';

    const camera = new PIXI.Container();
    app.stage.addChild(camera);

    let mapSprite;
    let isDragging = false;
    let lastPos = null;

    // Функция для обновления размера приложения
    function resizeApp() {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        
        app.renderer.resize(newWidth, newHeight);
        
        if (mapSprite) {
            // Обновляем масштаб и позицию камеры
            const texW = mapSprite.texture.width;
            const texH = mapSprite.texture.height;
            
            const scaleX = newWidth / texW;
            const scaleY = newHeight / texH;
            const minScale = Math.max(scaleX, scaleY);
            
            camera.scale.set(minScale);
            
            const scaledTexW = texW * camera.scale.x;
            const scaledTexH = texH * camera.scale.y;
            
            camera.x = (newWidth - scaledTexW) / 2;
            camera.y = (newHeight - scaledTexH) / 2;
            
            clampCamera();
        }
    }

    // Обработчик полноэкранного режима
    function onFullscreenChange() {
        // Небольшая задержка, чтобы браузер успел обновить размеры
        setTimeout(() => {
            resizeApp();
            
            // Принудительно обновляем маркеры и пути
            const resizeEvent = new Event('resize');
            window.dispatchEvent(resizeEvent);
        }, 100);
    }

    document.addEventListener('fullscreenchange', onFullscreenChange);

    PIXI.Loader.shared
        .add('map', '../assets/images/map.jpg')
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
        
        const scaleX = screenW / texW;
        const scaleY = screenH / texH;
        const minScale = Math.max(scaleX, scaleY);
        
        camera.scale.set(minScale);
        
        const scaledTexW = mapSprite.texture.width * camera.scale.x;
        const scaledTexH = mapSprite.texture.height * camera.scale.y;
        
        camera.x = (screenW - scaledTexW) / 2;
        camera.y = (screenH - scaledTexH) / 2;
        
        clampCamera();
    }
    
    function setupResizeHandler() {
        window.addEventListener('resize', () => {
            resizeApp();
        });
    }
    
    function setupInteraction() {
        app.view.addEventListener('pointerdown', (e) => {
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
                startInertia();
            }
        });

        app.view.addEventListener('click', (e) => {
            const worldX = (e.clientX - camera.x) / camera.scale.x;
            const worldY = (e.clientY - camera.y) / camera.scale.y;
            console.log(worldX, worldY);
        });
        
        window.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
        
            const now = performance.now();
            const dx = e.clientX - lastPos.x;
            const dy = e.clientY - lastPos.y;
        
            camera.x += dx;
            camera.y += dy;
            
            const dt = Math.max(1, now - lastMoveTime);
            
            velocity.x = (e.clientX - lastMovePos.x) / dt * 16;
            velocity.y = (e.clientY - lastMovePos.y) / dt * 16;
            
            const maxSpeed = 15;
            velocity.x = Math.min(maxSpeed, Math.max(-maxSpeed, velocity.x));
            velocity.y = Math.min(maxSpeed, Math.max(-maxSpeed, velocity.y));
        
            lastMoveTime = now;
            lastMovePos = { x: e.clientX, y: e.clientY };
            lastPos = { x: e.clientX, y: e.clientY };
        
            clampCamera();
        });
        
        app.view.addEventListener('wheel', (e) => {
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
        
        app.view.style.cursor = 'grab';
    }
    
    function startZoomInertia(minScale, maxScale) {
        if (currentZoomTarget) {
            cancelAnimationFrame(currentZoomTarget);
        }
        
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
        if (inertiaFrame) {
            cancelAnimationFrame(inertiaFrame);
        }
        
        const friction = 0.92;
        
        function animate() {
            if (isDragging) return;
            
            let moved = false;
            
            if (Math.abs(velocity.x) > 0.05 || Math.abs(velocity.y) > 0.05) {
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
        if (inertiaFrame) {
            cancelAnimationFrame(inertiaFrame);
            inertiaFrame = null;
        }
        velocity = { x: 0, y: 0 };
        
        if (currentZoomTarget) {
            cancelAnimationFrame(currentZoomTarget);
            currentZoomTarget = null;
        }
        zoomVelocity = 0;
    }
    
    function clampCamera() {
        if (!mapSprite) return;
        
        const screenW = app.screen.width;
        const screenH = app.screen.height;
        
        const texW = mapSprite.texture.width * camera.scale.x;
        const texH = mapSprite.texture.height * camera.scale.y;
        
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
    
    function getMinScale() {
        if (!mapSprite) return 1;
        
        const screenW = app.screen.width;
        const screenH = app.screen.height;
        const texW = mapSprite.texture.width;
        const texH = mapSprite.texture.height;
        
        const scaleX = screenW / texW;
        const scaleY = screenH / texH;
        
        return Math.max(scaleX, scaleY);
    }

    initWelcomePopup();
}