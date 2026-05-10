// windows.js
import {
    showHeroPath,
    hideHeroPath
} from './pathLines.js';

// ======================================================
// ELEMENTS
// ======================================================

let heroPath;
let heroPathMobile;
let marksWindow;

let pathBtn;
let marksBtn;

let closePathBtn;
let closeMarksBtn;

let isHeroPathOpen = false;
let isMobileHeroPathOpen = false;

// ======================================================
// CREATE WINDOWS CONTAINER
// ======================================================

function createWindowsContainer() {
    let container = document.getElementById('windowsContainer');

    if (container) return container;

    container = document.createElement('div');
    container.id = 'windowsContainer';

    document.body.appendChild(container);

    return container;
}

// ======================================================
// HELPER
// ======================================================

function isMobile() {
    return window.innerWidth <= 500;
}

// ======================================================
// SETUP FLEX LAYOUT
// ======================================================

function setupWindowsLayout() {
    const container = createWindowsContainer();

    heroPath = document.getElementById('heroPath');
    marksWindow = document.getElementById('marksWindow');

    if (heroPath) {
        container.appendChild(heroPath);
    }

    if (marksWindow) {
        container.appendChild(marksWindow);
    }

    if (heroPath) {
        heroPath.style.display = 'none';
    }

    if (marksWindow) {
        marksWindow.style.display = 'none';
    }
}

// ======================================================
// CREATE MOBILE HERO PATH
// ======================================================

function createMobileHeroPath() {
    const el = document.createElement('div');
    el.className = 'hero-path-mobile';
    el.innerHTML = `
        <div class="hero-path-mobile-drag-bar">
            <div class="hero-path-mobile-drag-line"></div>
        </div>
        <div class="hero-path-mobile-content">
            <div class="hero-path-mobile-header">
                <h3 class="hero-path-mobile-title">Путь героев</h3>
                <div class="hero-path-mobile-close">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="#696B62" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
            </div>
            <div class="hero-path-mobile-ornament">
                <?xml version="1.0" encoding="UTF-8"?>
<svg id="_Слой_2" data-name="Слой 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 779.74 36.11">
  <defs>
    <style>
      .cls-1 {
        fill: none;
        stroke: #585c62;
        stroke-miterlimit: 10;
        stroke-width: 2.83px;
      }

      .cls-2 {
        fill: #585c62;
      }
    </style>
  </defs>
  <g id="_Слой_2-2" data-name="Слой 2">
    <g>
      <path class="cls-1" d="M608.23,20.14h-137.36"/>
      <path class="cls-1" d="M779.74,14.16H429.04"/>
      <path class="cls-2" d="M319.84,18.62s26.65-6.6,30.14,7.33c.24,.95-7.09,9.81-9.69,2.13-2.6-7.68-13.24-9.22-20.45-9.45h0Z"/>
      <path class="cls-2" d="M459.54,18.62s-26.65-6.6-30.14,7.33c-.24,.95,7.09,9.81,9.69,2.13,2.6-7.68,13.24-9.22,20.45-9.45h0Z"/>
      <path class="cls-2" d="M404.37,14.69l-14.69-14.69-14.69,14.69,14.69,14.69,14.69-14.69Z"/>
      <path class="cls-2" d="M394.77,36.11s7.24-23.1,30.73-23.99c2.76-.11,7.64,.16,10.87,.71-2.83,.9,.55,2.45-7.3,3.31-1.01,.11-2.1,.57-3.25,1-3.7,1.38-5.08,3.68-5.52,6.2-.71,4.02-1.65,9.93-12.53,9.22-10.87-.71-13,3.55-13,3.55Z"/>
      <path class="cls-1" d="M0,14.16H350.21"/>
      <path class="cls-2" d="M384.49,36.11s-7.24-23.1-30.73-23.99c-2.76-.11-7.64,.16-10.87,.71,2.83,.9-.55,2.45,7.3,3.31,1.01,.11,2.1,.57,3.25,1,3.7,1.38,5.08,3.68,5.52,6.2,.71,4.02,1.65,9.93,12.53,9.22,10.87-.71,13,3.55,13,3.55Z"/>
      <path class="cls-1" d="M309.47,20.14H172.11"/>
    </g>
  </g>
</svg>
            </div>
            <div class="hero-path-mobile-list">
                <div class="hero-path-mobile-item mor" data-hero-id="mor">
                    <div class="hero-path-mobile-avatar">
                        <img src="assets/images/avatars/mor.png" alt="Морейн">
                        <div class="hero-path-mobile-circle"></div>
                    </div>
                    <span class="hero-path-mobile-name">Морейн</span>
                </div>
                <div class="hero-path-mobile-item rand" data-hero-id="rand">
                    <div class="hero-path-mobile-avatar">
                        <img src="assets/images/avatars/rand.png" alt="Ранд">
                        <div class="hero-path-mobile-circle"></div>
                    </div>
                    <span class="hero-path-mobile-name">Ранд</span>
                </div>
                <div class="hero-path-mobile-item per" data-hero-id="per">
                    <div class="hero-path-mobile-avatar">
                        <img src="assets/images/avatars/per.png" alt="Перрин">
                        <div class="hero-path-mobile-circle"></div>
                    </div>
                    <span class="hero-path-mobile-name">Перрин</span>
                </div>
                <div class="hero-path-mobile-item mat" data-hero-id="mat">
                    <div class="hero-path-mobile-avatar">
                        <img src="assets/images/avatars/mat.png" alt="Мэт">
                        <div class="hero-path-mobile-circle"></div>
                    </div>
                    <span class="hero-path-mobile-name">Мэт</span>
                </div>
                <div class="hero-path-mobile-item eg" data-hero-id="eg">
                    <div class="hero-path-mobile-avatar">
                        <img src="assets/images/avatars/eg.png" alt="Эгвейн">
                        <div class="hero-path-mobile-circle"></div>
                    </div>
                    <span class="hero-path-mobile-name">Эгвейн</span>
                </div>
                <div class="hero-path-mobile-item nay" data-hero-id="nay">
                    <div class="hero-path-mobile-avatar">
                        <img src="assets/images/avatars/nay.png" alt="Найнив">
                        <div class="hero-path-mobile-circle"></div>
                    </div>
                    <span class="hero-path-mobile-name">Найнив</span>
                </div>
                <div class="hero-path-mobile-item lan" data-hero-id="lan">
                    <div class="hero-path-mobile-avatar">
                        <img src="assets/images/avatars/lan.png" alt="Лан">
                        <div class="hero-path-mobile-circle"></div>
                    </div>
                    <span class="hero-path-mobile-name">Лан</span>
                </div>
            </div>
        </div>
    `;
    return el;
}

// ======================================================
// MOBILE HERO PATH
// ======================================================

function initMobileHeroPath() {
    heroPathMobile = createMobileHeroPath();
    document.body.appendChild(heroPathMobile);
    
    const closeBtn = heroPathMobile.querySelector('.hero-path-mobile-close');
    const dragBar = heroPathMobile.querySelector('.hero-path-mobile-drag-bar');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeMobileHeroPath();
        });
    }
    
    // Свайп вниз
    if (dragBar) {
        let startY = 0;
        
        dragBar.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });
        
        dragBar.addEventListener('touchmove', (e) => {
            const deltaY = e.touches[0].clientY - startY;
            if (deltaY > 0) {
                heroPathMobile.style.transform = `translateY(${deltaY}px)`;
            }
        });
        
        dragBar.addEventListener('touchend', (e) => {
            const deltaY = e.changedTouches[0].clientY - startY;
            if (deltaY > 100) {
                closeMobileHeroPath();
            } else {
                heroPathMobile.style.transform = '';
            }
        });
    }
    
    // Обработчики для элементов
    const items = heroPathMobile.querySelectorAll('.hero-path-mobile-item');
    items.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const heroId = item.dataset.heroId;
            item.classList.toggle('active');
            
            if (item.classList.contains('active')) {
                showHeroPath(heroId);
            } else {
                hideHeroPath(heroId);
            }
        });
    });
}

function openMobileHeroPath() {
    if (heroPathMobile) {
        heroPathMobile.classList.add('open');
        isMobileHeroPathOpen = true;
        heroPathMobile.style.transform = '';
    }
}

function closeMobileHeroPath() {
    if (heroPathMobile) {
        heroPathMobile.classList.remove('open');
        heroPathMobile.style.transform = '';
        isMobileHeroPathOpen = false;
    }
}

function toggleMobileHeroPath() {
    if (isMobileHeroPathOpen) {
        closeMobileHeroPath();
    } else {
        openMobileHeroPath();
    }
}


// ======================================================
// CREATE MOBILE MARKS WINDOW
// ======================================================

function createMobileMarksWindow() {
    const el = document.createElement('div');
    el.className = 'marks-window-mobile';
    el.innerHTML = `
        <div class="marks-mobile-drag-bar">
            <div class="marks-mobile-drag-line"></div>
        </div>
        <div class="marks-mobile-content">
            <div class="marks-mobile-header">
                <h4 class="marks-mobile-title">Обозначения</h4>
                <div class="marks-mobile-close">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="#696B62" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
            </div>
            <div class="marks-mobile-ornament">
             <?xml version="1.0" encoding="UTF-8"?>
            <svg id="_Слой_2" data-name="Слой 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 779.74 36.11">
            <defs>
                <style>
                .cls-1 {
                    fill: none;
                    stroke: #585c62;
                    stroke-miterlimit: 10;
                    stroke-width: 2.83px;
                }

                .cls-2 {
                    fill: #585c62;
                }
                </style>
            </defs>
            <g id="_Слой_2-2" data-name="Слой 2">
                <g>
                <path class="cls-1" d="M608.23,20.14h-137.36"/>
                <path class="cls-1" d="M779.74,14.16H429.04"/>
                <path class="cls-2" d="M319.84,18.62s26.65-6.6,30.14,7.33c.24,.95-7.09,9.81-9.69,2.13-2.6-7.68-13.24-9.22-20.45-9.45h0Z"/>
                <path class="cls-2" d="M459.54,18.62s-26.65-6.6-30.14,7.33c-.24,.95,7.09,9.81,9.69,2.13,2.6-7.68,13.24-9.22,20.45-9.45h0Z"/>
                <path class="cls-2" d="M404.37,14.69l-14.69-14.69-14.69,14.69,14.69,14.69,14.69-14.69Z"/>
                <path class="cls-2" d="M394.77,36.11s7.24-23.1,30.73-23.99c2.76-.11,7.64,.16,10.87,.71-2.83,.9,.55,2.45-7.3,3.31-1.01,.11-2.1,.57-3.25,1-3.7,1.38-5.08,3.68-5.52,6.2-.71,4.02-1.65,9.93-12.53,9.22-10.87-.71-13,3.55-13,3.55Z"/>
                <path class="cls-1" d="M0,14.16H350.21"/>
                <path class="cls-2" d="M384.49,36.11s-7.24-23.1-30.73-23.99c-2.76-.11-7.64,.16-10.87,.71,2.83,.9-.55,2.45,7.3,3.31,1.01,.11,2.1,.57,3.25,1,3.7,1.38,5.08,3.68,5.52,6.2,.71,4.02,1.65,9.93,12.53,9.22,10.87-.71,13,3.55,13,3.55Z"/>
                <path class="cls-1" d="M309.47,20.14H172.11"/>
                </g>
            </g>
            </svg>
            </div>
            <div class="marks-mobile-list">
                <div class="marks-mobile-item">
                    <div class="marks-mobile-icon">
                        <img class="loc" src="assets/icons/location.png" alt="Локации">
                    </div>
                    <span class="marks-mobile-label">Локации</span>
                </div>
                <div class="marks-mobile-item">
                    <div class="marks-mobile-icon" >
                        <img class="ev" src="assets/icons/events.png" alt="События">
                    </div>
                    <span class="marks-mobile-label">События</span>
                </div>
            </div>
        </div>
    `;
    return el;
}

// ======================================================
// MOBILE MARKS WINDOW
// ======================================================

let marksWindowMobile;
let isMobileMarksOpen = false;

function initMobileMarksWindow() {
    marksWindowMobile = createMobileMarksWindow();
    document.body.appendChild(marksWindowMobile);
    
    const closeBtn = marksWindowMobile.querySelector('.marks-mobile-close');
    const dragBar = marksWindowMobile.querySelector('.marks-mobile-drag-bar');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeMobileMarksWindow();
        });
    }
    
    // Свайп вниз для закрытия
    if (dragBar) {
        let startY = 0;
        
        dragBar.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });
        
        dragBar.addEventListener('touchmove', (e) => {
            const deltaY = e.touches[0].clientY - startY;
            if (deltaY > 0) {
                marksWindowMobile.style.transform = `translateY(${deltaY}px)`;
            }
        });
        
        dragBar.addEventListener('touchend', (e) => {
            const deltaY = e.changedTouches[0].clientY - startY;
            if (deltaY > 100) {
                closeMobileMarksWindow();
            } else {
                marksWindowMobile.style.transform = '';
            }
        });
    }
}

function openMobileMarksWindow() {
    if (marksWindowMobile) {
        marksWindowMobile.classList.add('open');
        isMobileMarksOpen = true;
        marksWindowMobile.style.transform = '';
    }
}

function closeMobileMarksWindow() {
    if (marksWindowMobile) {
        marksWindowMobile.classList.remove('open');
        marksWindowMobile.style.transform = '';
        isMobileMarksOpen = false;
    }
}

function toggleMobileMarksWindow() {
    if (isMobileMarksOpen) {
        closeMobileMarksWindow();
    } else {
        openMobileMarksWindow();
    }
}





// ======================================================
// OPEN / CLOSE (DESKTOP)
// ======================================================

function openWindow(windowEl) {
    if (!windowEl) return;
    if (windowEl.classList.contains('open')) return;

    windowEl.style.display = 'block';

    requestAnimationFrame(() => {
        windowEl.classList.add('open');
    });
}

function closeWindow(windowEl) {
    if (!windowEl) return;

    windowEl.classList.remove('open');

    setTimeout(() => {
        if (!windowEl.classList.contains('open')) {
            windowEl.style.display = 'none';
        }
    }, 350);
}

function toggleWindow(windowEl) {
    if (!windowEl) return;

    if (windowEl.classList.contains('open')) {
        closeWindow(windowEl);
    } else {
        openWindow(windowEl);
    }
}

// ======================================================
// HERO PATH WINDOW
// ======================================================

function openHeroPath() {
    if (isMobile()) {
        openMobileHeroPath();
    } else {
        openWindow(heroPath);
    }
}

function closeHeroPath() {
    if (isMobile()) {
        closeMobileHeroPath();
    } else {
        closeWindow(heroPath);
    }
}

function toggleHeroPath() {
    if (isMobile()) {
        toggleMobileHeroPath();
    } else {
        toggleWindow(heroPath);
    }
}

function initHeroPath() {
    pathBtn = document.getElementById('pathBtn');
    closePathBtn = document.getElementById('closePathBtn');

    if (pathBtn) {
        pathBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleHeroPath();
        });
    }

    if (closePathBtn) {
        closePathBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeHeroPath();
        });
    }
}


// ======================================================
// HERO ITEMS (DESKTOP)
// ======================================================

function initHeroClicks() {
    const items = document.querySelectorAll('.hero-path-item');

    items.forEach(item => {
        if (item._clickHandler) {
            item.removeEventListener('click', item._clickHandler);
        }

        const handler = function(e) {
            e.stopPropagation();

            this.classList.toggle('active');

            let heroId = null;

            const heroClasses = [
                'mor',
                'rand',
                'per',
                'mat',
                'eg',
                'nay',
                'lan'
            ];

            for (const cls of heroClasses) {
                if (this.classList.contains(cls)) {
                    heroId = cls;
                    break;
                }
            }

            if (!heroId) return;

            if (this.classList.contains('active')) {
                showHeroPath(heroId);
            } else {
                hideHeroPath(heroId);
            }
        };

        item._clickHandler = handler;
        item.addEventListener('click', handler);
    });
}

// ======================================================
// OBSERVER
// ======================================================

function initObserver() {
    const observer = new MutationObserver(() => {
        initHeroClicks();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}




// ======================================================
// MARKS WINDOW (DESKTOP + MOBILE)
// ======================================================

function initMarksWindow() {
    marksBtn = document.getElementById('marksBtn');
    closeMarksBtn = document.getElementById('closeMarksBtn');

    if (marksBtn) {
        // Удаляем старый обработчик, если есть
        if (marksBtn._clickHandler) {
            marksBtn.removeEventListener('click', marksBtn._clickHandler);
        }
        
        const handler = (e) => {
            e.stopPropagation();
            toggleMarksWindow();
        };
        
        marksBtn._clickHandler = handler;
        marksBtn.addEventListener('click', handler);
    }

    if (closeMarksBtn) {
        if (closeMarksBtn._clickHandler) {
            closeMarksBtn.removeEventListener('click', closeMarksBtn._clickHandler);
        }
        
        const handler = (e) => {
            e.stopPropagation();
            closeMarksWindow();
        };
        
        closeMarksBtn._clickHandler = handler;
        closeMarksBtn.addEventListener('click', handler);
    }
}

function openMarksWindow() {
    if (isMobile()) {
        openMobileMarksWindow();
    } else {
        openWindow(marksWindow);
    }
}

function closeMarksWindow() {
    if (isMobile()) {
        closeMobileMarksWindow();
    } else {
        closeWindow(marksWindow);
    }
}

function toggleMarksWindow() {
    if (isMobile()) {
        toggleMobileMarksWindow();
    } else {
        toggleWindow(marksWindow);
    }
}


// ======================================================
// INIT
// ======================================================

export function initWindows() {
    setupWindowsLayout();
    initMobileHeroPath();
    initMobileMarksWindow();  
    initHeroPath();
    initMarksWindow();
    initHeroClicks();
    initObserver();
}