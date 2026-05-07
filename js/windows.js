import {
    showHeroPath,
    hideHeroPath
} from './pathLines.js';

// ======================================================
// ELEMENTS
// ======================================================

let heroPath;
let marksWindow;

let pathBtn;
let marksBtn;

let closePathBtn;
let closeMarksBtn;

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
// SETUP FLEX LAYOUT
// ======================================================

function setupWindowsLayout() {
    const container = createWindowsContainer();

    heroPath = document.getElementById('heroPath');
    marksWindow = document.getElementById('marksWindow');

    // Путь героя всегда сверху
    if (heroPath) {
        container.appendChild(heroPath);
    }

    // Метки всегда снизу
    if (marksWindow) {
        container.appendChild(marksWindow);
    }

    // Изначально скрываем
    if (heroPath) {
        heroPath.style.display = 'none';
    }

    if (marksWindow) {
        marksWindow.style.display = 'none';
    }
}

// ======================================================
// OPEN / CLOSE
// ======================================================

function openWindow(windowEl) {
    if (!windowEl) return;

    // уже открыто
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
    openWindow(heroPath);
}

function closeHeroPath() {
    closeWindow(heroPath);
}

function toggleHeroPath() {
    toggleWindow(heroPath);
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
// MARKS WINDOW
// ======================================================

function openMarksWindow() {
    openWindow(marksWindow);
}

function closeMarksWindow() {
    closeWindow(marksWindow);
}

function toggleMarksWindow() {
    toggleWindow(marksWindow);
}

function initMarksWindow() {
    marksBtn = document.getElementById('marksBtn');
    closeMarksBtn = document.getElementById('closeMarksBtn');

    if (marksBtn) {
        marksBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMarksWindow();
        });
    }

    if (closeMarksBtn) {
        closeMarksBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMarksWindow();
        });
    }
}

// ======================================================
// HERO ITEMS
// ======================================================

function initHeroClicks() {
    const items = document.querySelectorAll('.hero-path-item');

    items.forEach(item => {

        // удаляем старый обработчик
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
// INIT
// ======================================================

export function initWindows() {
    setupWindowsLayout();

    initHeroPath();
    initMarksWindow();

    initHeroClicks();
    initObserver();
}