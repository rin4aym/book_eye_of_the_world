// spine.js
let app;
let currentSpine = null;
let originalBounds = null;

export function createApp(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return null;
  
  const width = container.clientWidth;
  const height = container.clientHeight;
   // Добавить настройки для ретина-экранов
   const pixelRatio = window.devicePixelRatio || 1;
  
   app = new PIXI.Application({
    width: width,
    height: height,

    backgroundAlpha: 0,

    antialias: true,

    resolution: window.devicePixelRatio || 1,

    autoDensity: true,

    powerPreference: "high-performance",
});
  
  container.appendChild(app.view);
  
  const canvas = app.view;
  canvas.style.display = 'block';
  
  window.addEventListener('resize', () => {
    if (currentSpine && originalBounds) {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      app.renderer.resize(newWidth, newHeight);
      applyAutoScale(currentSpine);
    }
  });
  
  return app;
}

export function loadSpine(path) {
  return new Promise((resolve, reject) => {
    app.loader.add('spineData', path).load((loader, resources) => {
      try {
        currentSpine = new PIXI.spine.Spine(resources.spineData.spineData);
        resolve(currentSpine);
      } catch (error) {
        reject(error);
      }
    });
  });
}

export function addToStage(spine) {
  if (app && app.stage) {
    app.stage.addChild(spine);
  }
}

export function getApp() {
  return app;
}

export function setupAutoScale(spine) {
  if (!spine) return;
  
  const bounds = spine.getBounds();
  originalBounds = {
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y
  };
  
  console.log('Original bounds:', originalBounds);
  applyAutoScale(spine);
}

export function applyAutoScale(spine) {
  if (!spine || !originalBounds || !app) return;
  
  const screenWidth = app.screen.width;
  const screenHeight = app.screen.height;
  
  const scaleX = screenWidth / originalBounds.width;
  const scaleY = screenHeight / originalBounds.height;
  const scale = Math.max(scaleX, scaleY);
  
  spine.scale.set(scale);
  
  const centerX = originalBounds.x + originalBounds.width / 2;
  const centerY = originalBounds.y + originalBounds.height / 2;
  
  spine.x = screenWidth / 2 - centerX * scale;
  spine.y = screenHeight / 2 - centerY * scale;
  
  console.log('Scale:', scale);
  console.log('Spine position:', spine.x, spine.y);
}

export function destroyApp() {
  if (app) {
    app.destroy(true, true);
    app = null;
    currentSpine = null;
    originalBounds = null;
  }
}