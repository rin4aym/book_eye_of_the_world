// main.js
import { initCover } from './index.js';
import { initMap } from './map.js';
import { initMenuButton } from './menu.js';
import { initSoundToggle } from './sound.js';
import { initTextSizeSlider } from './textSize.js';

// В main.js, при переходе между страницами
import { removeRandAnimation } from './Rand_anim.js';
import { removeBattleAnimation } from './Battle.js';

document.addEventListener('DOMContentLoaded', async () => {
  const page = document.body.dataset.page;

  // Инициализируем переключатель звука (есть на всех страницах)
  
  // Инициализируем меню (есть на всех страницах)
  try {
    await initMenuButton('menuBtn');
    console.log('Меню готово');
    initSoundToggle();
    initTextSizeSlider();

  } catch (error) {
    console.error('Ошибка инициализации меню:', error);
  }

  // ========== КНОПКА "НАВЕРХ" ==========
  const upBtn = document.getElementById('up_btn');
  if (upBtn) {
    upBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  if (page === 'index') {
    initCover();
  }
  
  if (page === 'map') {
    initMap();
    removeRandAnimation();
    removeBattleAnimation();
  }
  
  // Для страницы event НЕ вызываем initMap()
});