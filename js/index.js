// index.js - альтернативный вариант
import { createApp, loadSpine, addToStage, setupAutoScale, destroyApp, getApp } from './spine.js';

let currentMobileState = false;

function isMobile() {
  return window.innerWidth <= 455;
}

function getAnimationPath() {
  if (isMobile()) {
    return 'assets/animations/cover_mobile/skeleton.json';
  }
  return 'assets/animations/cover/skeleton.json';
}

export async function initCover() {
  const wasMobile = currentMobileState;
  const nowMobile = isMobile();
  currentMobileState = nowMobile;
  
  const app = getApp();
  const container = document.getElementById('cover');
  
  // Если уже есть приложение и анимация, обновляем только если нужно сменить версию
  if (app && app.stage && app.stage.children.length > 0) {
    if (wasMobile !== nowMobile) {
      // Нужно сменить анимацию
      destroyApp();
      createApp('cover');
      const spine = await loadSpine(getAnimationPath());
      addToStage(spine);
      setupAutoScale(spine);
      spine.state.setAnimation(0, 'start', false);
      spine.state.addAnimation(0, 'begining', false, 0);
      spine.state.addAnimation(0, 'idle', true, 0);
    }
    // Если не нужно менять анимацию, ничего не делаем
    return;
  }
  
  // Первая инициализация
  createApp('cover');
  const spine = await loadSpine(getAnimationPath());
  addToStage(spine);
  setupAutoScale(spine);
  spine.state.setAnimation(0, 'start', false);
  spine.state.addAnimation(0, 'begining', false, 0);
  spine.state.addAnimation(0, 'idle', true, 0);
  
  window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
      if (isMobile() !== currentMobileState) {
        initCover();
      }
    }, 200);
  });
}

