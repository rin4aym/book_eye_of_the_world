// main.js
import { initCover } from './index.js';
import { initMap } from './map.js';
import { initMenuButton } from './menu.js';
import { initSoundToggle, registerBackgroundMusic } from './sound.js';
import { initTextSizeSlider } from './textSize.js';
import { initFullscreenToggle } from './fullscreen.js';
import { removeRandAnimation } from './Rand_anim.js';
import { removeBattleAnimation } from './Battle.js';
import { saveScrollPosition, restoreScrollPosition } from './storage.js';
import { initWelcomePopup } from './welcome.js';
import { initMobileMenu } from './toolbar.js';
import { initBackgroundMusic, switchMusicForPage, getBackgroundAudio } from './music.js';


document.addEventListener('DOMContentLoaded', async () => {
  const page = document.body.dataset.page;

  // ========== ИНИЦИАЛИЗАЦИЯ МУЗЫКИ ==========
  // Инициализируем музыку на всех страницах
  initBackgroundMusic();
  
  // Получаем ссылку на уже созданный аудиоэлемент из music.js
  const backgroundAudio = getBackgroundAudio();
  if (backgroundAudio) {
    registerBackgroundMusic(backgroundAudio);
  }

  // Отслеживаем переходы между страницами для смены музыки
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && !link.target) {
      const url = new URL(link.href);
      const pathname = url.pathname;
      
      if (pathname.includes('map.html')) {
        switchMusicForPage('map');
      } else if (pathname.includes('index.html') || pathname === '/' || pathname === '/index.html') {
        switchMusicForPage('index');
      } else if (pathname.includes('chapter_')) {
        switchMusicForPage('event');
      }
    }
  });

  

  // Кнопки, которые задвигаются при скролле вниз и появляются при скролле вверх
const disappearButtons = document.querySelectorAll('.btn.disappear');
let scrollThreshold = 500;
let lastScrollY = window.scrollY;
let isHidden = false;

// Флаг, чтобы не сворачивать кнопки пока мышь над ними
let isHovering = false;

function setButtonsHidden(hidden) {
  disappearButtons.forEach(btn => {
    if (hidden && !isHovering) {
      // Задвигаем влево на 70% от ширины кнопки
      const btnWidth = btn.offsetWidth;
      btn.style.transform = `translateX(-${btnWidth * 0.73}px)`;
      btn.style.transition = 'transform 0.4s ease';
    } else if (!hidden) {
      btn.style.transform = 'translateX(0)';
      btn.style.transition = 'transform 0.4s ease';
    }
  });
  isHidden = hidden;
}

function setButtonsVisible() {
  disappearButtons.forEach(btn => {
    btn.style.transform = 'translateX(0)';
    btn.style.transition = 'transform 0.3s ease';
  });
  isHidden = false;
}

// Добавляем обработчики наведения для всех кнопок
disappearButtons.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    isHovering = true;
    if (isHidden) {
      // Раскрываем ВСЕ кнопки
      disappearButtons.forEach(b => {
        b.style.transform = 'translateX(0)';
        b.style.transition = 'transform 0.2s ease';
      });
    }
  });
  
  btn.addEventListener('mouseleave', () => {
    isHovering = false;
    if (isHidden) {
      // Сворачиваем обратно ВСЕ кнопки
      disappearButtons.forEach(b => {
        const btnWidth = b.offsetWidth;
        b.style.transform = `translateX(-${btnWidth * 0.7}px)`;
        b.style.transition = 'transform 0.3s ease';
      });
    }
  });
});

function handleScrollButtons() {
  const currentScrollY = window.scrollY;

  // Скроллим вниз и прошли порог - задвигаем кнопки
  if (currentScrollY > scrollThreshold && currentScrollY > lastScrollY && !isHidden) {
    setButtonsHidden(true);
  } 
  // Скроллим вверх - показываем полностью
  else if (currentScrollY < lastScrollY && isHidden) {
    setButtonsVisible();
  }
  // Если мы в зоне выше порога и кнопки скрыты - показываем
  else if (currentScrollY <= scrollThreshold && isHidden) {
    setButtonsVisible();
  }
  
  lastScrollY = currentScrollY;
}

// Обработчик скролла с requestAnimationFrame для плавности
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

// Добавляем обработчики наведения для всех кнопок
disappearButtons.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    if (isHidden) {
      // Раскрываем ВСЕ кнопки и больше не сворачиваем
      disappearButtons.forEach(b => {
        b.style.transform = 'translateX(0)';
        b.style.transition = 'transform 0.2s ease';
      });
      isHidden = false; // Отключаем свернутое состояние
    }
  });
});

// Вызываем при загрузке
handleScrollButtons();

// Обновляем позиции при ресайзе (чтобы ширина кнопок актуальная была)
window.addEventListener('resize', () => {
  if (isHidden && !isHovering) {
    disappearButtons.forEach(btn => {
      const btnWidth = btn.offsetWidth;
      btn.style.transform = `translateX(-${btnWidth * 0.7}px)`;
    });
  }
});
  
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
    removeRandAnimation();
    removeBattleAnimation();
    initMobileMenu();
    initWelcomePopup();
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