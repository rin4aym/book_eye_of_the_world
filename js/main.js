// main.js
import { initCover } from './index.js';
import { initMap } from './map.js';
import { initMenuButton } from './menu.js';
import { initSoundToggle } from './sound.js';

document.addEventListener('DOMContentLoaded', async () => {
  const page = document.body.dataset.page;

  // Инициализируем переключатель звука (есть на всех страницах)
  initSoundToggle();
  
  // Инициализируем меню (есть на всех страницах)
  try {
    await initMenuButton('menuBtn');
    console.log('Меню готово');
  } catch (error) {
    console.error('Ошибка инициализации меню:', error);
  }

  if (page === 'index') {
    initCover();
  }
  
  if (page === 'map') {
    initMap();  // Только здесь создаётся summaryPanel
  }
  
  // Для страницы event НЕ вызываем initMap()
});