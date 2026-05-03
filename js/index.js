import { createApp, loadSpine, addToStage, setupAutoScale } from './spine.js';

export async function initCover() {
  createApp('cover');
  
  const spine = await loadSpine('assets/animations/cover/skeleton.json');
  addToStage(spine);
  
  // Автоматический расчёт масштаба и позиции
  setupAutoScale(spine);
  
  // Запускаем последовательность анимаций
  spine.state.setAnimation(0, 'start', false);
  spine.state.addAnimation(0, 'begining', false, 0);
  spine.state.addAnimation(0, 'idle', true, 0);
}