// main.js
import { initCover } from './index.js';
import { initMap } from './map.js';
import { initMenuButton } from './menu.js';
import { initSoundToggle } from './sound.js';
import { initTextSizeSlider } from './textSize.js';
import { initFullscreenToggle } from './fullscreen.js';
import { removeRandAnimation } from './Rand_anim.js';
import { removeBattleAnimation } from './Battle.js';
import { saveScrollPosition, restoreScrollPosition } from './storage.js';
import { initWelcomePopup } from './welcome.js';
import { initMobileMenu } from './toolbar.js';



document.addEventListener('DOMContentLoaded', async () => {
  const page = document.body.dataset.page;

  // Кнопки, которые исчезают при скролле вниз и появляются при скролле вверх
  const disappearButtons = document.querySelectorAll('.btn.disappear');
  let scrollThreshold = 500;
  let lastScrollY = window.scrollY;
  let isHidden = false;
  
  function handleScrollButtons() {
    const currentScrollY = window.scrollY;
    
    // Скроллим вниз и прошли порог - скрываем
    if (currentScrollY > scrollThreshold && currentScrollY > lastScrollY && !isHidden) {
      disappearButtons.forEach(btn => {
        btn.style.opacity = '0';
        btn.style.visibility = 'hidden';
        btn.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
      });
      isHidden = true;
    } 
    // Скроллим вверх - показываем (любое движение вверх)
    else if (currentScrollY < lastScrollY && isHidden) {
      disappearButtons.forEach(btn => {
        btn.style.opacity = '1';
        btn.style.visibility = 'visible';
      });
      isHidden = false;
    }
    // Если мы в зоне выше порога и кнопки скрыты - показываем
    else if (currentScrollY <= scrollThreshold && isHidden) {
      disappearButtons.forEach(btn => {
        btn.style.opacity = '1';
        btn.style.visibility = 'visible';
      });
      isHidden = false;
    }
    
    lastScrollY = currentScrollY;
  }
  
  if (disappearButtons.length > 0) {
    // Добавляем стили для плавности
    disappearButtons.forEach(btn => {
      btn.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
    });
    
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScrollButtons();
          ticking = false;
        });
        ticking = true;
      }
    });
    handleScrollButtons();
  }

  try {
    await initMenuButton('menuBtn');
    console.log('Меню готово');
    
    initSoundToggle();
    initTextSizeSlider();
    initFullscreenToggle();
  } catch (error) {
    console.error('Ошибка инициализации меню:', error);
  }

  const upBtn = document.getElementById('up_btn');
  if (upBtn) {
    upBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (page === 'index') {
    initCover();
  }
  
  if (page === 'map') {
    initMap();
    initMobileMenu();
    removeRandAnimation();
    removeBattleAnimation();
  }

// В секции event
if (page === 'event') {
  restoreScrollPosition();
  
  // Сохраняем при скролле с задержкой
  let saveTimeout;
  window.addEventListener('scroll', () => {
      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
          saveScrollPosition();
      }, 500);
  });
  
  window.addEventListener('beforeunload', saveScrollPosition);
}


});