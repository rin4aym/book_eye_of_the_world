let app;
let currentSpine = null;
let originalBounds = null;

export function createApp(containerId) {
  const container = document.getElementById(containerId);
  
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  app = new PIXI.Application({
    width: width,
    height: height,
    backgroundAlpha: 0,
    antialias: false,        // ОТКЛЮЧИ сглаживание (самое важное!)
    resolution: 1,           // Не используй retina-разрешение
    autoDensity: false,      // Отключи авто-плотность
    powerPreference: "high-performance"  // Запрос высокой производительности
  });
  
  container.appendChild(app.view);
  
  const canvas = app.view;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  
  window.addEventListener('resize', () => {
    if (currentSpine && originalBounds) {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      app.renderer.resize(newWidth, newHeight);
      applyAutoScale(currentSpine);
    }
  });
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
  app.stage.addChild(spine);
}

export function getApp() {
  return app;
}

export function setupAutoScale(spine) {
  // Получаем оригинальные границы
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
  if (!spine || !originalBounds) return;
  
  const screenWidth = app.screen.width;
  const screenHeight = app.screen.height;
  
  // Рассчитываем масштаб для заполнения экрана
  const scaleX = screenWidth / originalBounds.width;
  const scaleY = screenHeight / originalBounds.height;
  const scale = Math.max(scaleX, scaleY);
  
  spine.scale.set(scale);
  
  // Вычисляем центр анимации с учётом bounds
  const centerX = originalBounds.x + originalBounds.width / 2;
  const centerY = originalBounds.y + originalBounds.height / 2;
  
  // Помещаем центр анимации в центр экрана
  spine.x = screenWidth / 2 - centerX * scale;
  spine.y = screenHeight / 2 - centerY * scale;
  
  console.log('Scale:', scale);
  console.log('Spine position:', spine.x, spine.y);
}