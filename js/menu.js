let menuOverlay = null;
let menuEl = null;
let menuMobile = null;
let menuMobileOverlay = null;
let isMenuOpen = false;
let onCloseCallback = null;
let isMenuInitialized = false;
import { setTextSize, getTextSize } from './textSize.js';

// Функция для скачивания файла
function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function loadMenuHTML() {
    const response = await fetch('/menu.html');
    if (!response.ok) {
        throw new Error(`Ошибка загрузки menu.html: ${response.status} ${response.statusText}`);
    }
    return await response.text();
}

function isMobile() {
    return window.innerWidth <= 500;
}

function createMobileMenu() {
    const el = document.createElement('div');
    el.className = 'menu-mobile';
    el.innerHTML = `
        <div class="menu-mobile-content">
            <!-- ЗАГОЛОВОК С КНОПКОЙ ЗАКРЫТИЯ -->
            <div class="menu-mobile-header">
                <h2 class="menu-mobile-title">Настройки</h2>
                <div class="menu-mobile-close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="#696B62" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
            </div>
            
            <!-- Орнамент -->
            <div class="menu-mobile-ornament">
                <svg id="_Слой_2" data-name="Слой 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 779.74 36.11">
                    <defs>
                        <style>
                            .cls-1 { fill: none; stroke: #585c62; stroke-miterlimit: 10; stroke-width: 2.83px; }
                            .cls-2 { fill: #585c62; }
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

            <!-- Настройки текста -->
            <div class="menu-mobile-settings">
                <div class="menu-mobile-subheader">
                    <h3>Текст</h3>
                </div>
                <div class="menu-mobile-pols">
                    <div class="menu-mobile-line_pols">
                        <div class="menu-mobile-mid-marker"></div>
                        <div class="menu-mobile-slider-handle"></div>
                    </div>
                    <div class="menu-mobile-label">
                        <p>Маленький</p>
                        <p>Средний</p>
                        <p>Большой</p>
                    </div>
                </div>
                <div class="menu-mobile-exemple">
                    <h1 class="real">Пример</h1>
                    <p class="real">Время от\u00A0времени дворец подрагивал, словно сама земля содрогалась от\u00A0воспоминаний и\u00A0тяжко вздыхала.</p>
                </div>
            </div>

            <!-- Звук -->
            <div class="menu-mobile-settings">
                <div class="menu-mobile-subheader">
                    <h3>Звук</h3>
                </div>
                <div class="menu-mobile-toggle_row">
                    <p class="menu-mobile-toggle-label">Музыка</p>
                    <div class="menu-mobile-toggle" data-sound="music">
                        <div class="menu-mobile-toggle_btn"></div>
                    </div>
                </div>
                <div class="menu-mobile-toggle_row">
                    <p class="menu-mobile-toggle-label">Эффекты</p>
                    <div class="menu-mobile-toggle" data-sound="effects">
                        <div class="menu-mobile-toggle_btn"></div>
                    </div>
                </div>
            </div>

            <!-- Отображение -->
            <div class="menu-mobile-settings">
                <div class="menu-mobile-subheader">
                    <h3>Отображение</h3>
                </div>
                <div class="menu-mobile-toggle_row">
                    <p class="menu-mobile-toggle-label">Полноэкранный режим</p>
                    <div class="menu-mobile-toggle" data-display="fullscreen">
                        <div class="menu-mobile-toggle_btn"></div>
                    </div>
                </div>
            </div>

            <!-- Информация -->
            <div class="menu-mobile-header_menu">
                <div class="menu-mobile-head_close">
                    <h2>Информация</h2>
                </div>
                <div class="menu-mobile-ornament">
                    <svg id="_Слой_2" data-name="Слой 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 779.74 36.11">
                        <defs>
                            <style>
                                .cls-1 { fill: none; stroke: #585c62; stroke-miterlimit: 10; stroke-width: 2.83px; }
                                .cls-2 { fill: #585c62; }
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
            </div>

            <div class="menu-mobile-settings">
                <div class="menu-mobile-subheader">
                    <h3>Права</h3>
                </div>
                <p>«Око Мира» © Robert Jordan<br>& Bandersnatch Group<br><br>Иллюстрации и разработка — Аймалетдинова Рината, 2026</p>
            </div>

            <div class="menu-mobile-settings">
                <div class="menu-mobile-subheader">
                    <h3>Контакты</h3>
                </div>
                <p>rinaymaletdin@mail.ru</p>
            </div>

    <div class="download_block dmob">
        <div class="download">
        <svg class="read dmob" width="282" height="48" viewBox="0 0 282 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path id="active" d="M29.1621 0.734375H252.162L280.162 23.7344L252.162 46.7344H29.1621L1.16211 23.7344L29.1621 0.734375Z" fill="url(#paint0_linear_1183_1512)" stroke="url(#paint1_linear_1183_1512)" stroke-width="1.47486" stroke-linecap="round"/>
            <path d="M29.1621 0.734375H252.162L280.162 23.7344L252.162 46.7344H29.1621L1.16211 23.7344L29.1621 0.734375Z" fill="url(#paint2_linear_1183_1512)"/>
            <path d="M29.1621 0.734375H252.162L280.162 23.7344L252.162 46.7344H29.1621L1.16211 23.7344L29.1621 0.734375Z" fill="black" fill-opacity="0.2"/>
            <path d="M29.1621 0.734375H252.162L280.162 23.7344L252.162 46.7344H29.1621L1.16211 23.7344L29.1621 0.734375Z" stroke="url(#paint3_linear_1183_1512)" stroke-width="1.47486" stroke-linecap="round"/>
            <path id="defoult" d="M29.1621 0.734375H252.162L280.162 23.7344L252.162 46.7344H29.1621L1.16211 23.7344L29.1621 0.734375Z" fill="#585C62"/>
            <path d="M29.1621 0.734375H252.162L280.162 23.7344L252.162 46.7344H29.1621L1.16211 23.7344L29.1621 0.734375Z" stroke="url(#paint4_linear_1183_1512)" stroke-width="1.47486" stroke-linecap="round"/>
                <text x="141" y="29" text-anchor="middle" fill="white" font-size="16" font-family="NotoSerifB" pointer-events="none">
                    Скачать артбук
                </text>
            <defs>
            <linearGradient id="paint0_linear_1183_1512" x1="271.717" y1="-17.8734" x2="-29.8376" y2="132.798" gradientUnits="userSpaceOnUse">
            <stop stop-color="#C7AA7F"/>
            <stop offset="0.0001" stop-color="#CCAA79"/>
            <stop offset="0.211538" stop-color="#A98959"/>
            <stop offset="0.514423" stop-color="#E5CCA8"/>
            <stop offset="0.75" stop-color="#AA8A59"/>
            <stop offset="0.870192" stop-color="#F0DBBC"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1183_1512" x1="264.463" y1="-20.0902" x2="-32.5423" y2="113.379" gradientUnits="userSpaceOnUse">
            <stop stop-color="#C7AA7F"/>
            <stop offset="0.211538" stop-color="#785C32"/>
            <stop offset="0.514423" stop-color="#D9AF72"/>
            <stop offset="0.75" stop-color="#9C8460"/>
            <stop offset="0.870192" stop-color="#F8F4EE"/>
            </linearGradient>
            <linearGradient id="paint2_linear_1183_1512" x1="271.717" y1="-17.8734" x2="-29.8376" y2="132.798" gradientUnits="userSpaceOnUse">
            <stop stop-color="#C7AA7F"/>
            <stop offset="0.0001" stop-color="#CCAA79"/>
            <stop offset="0.211538" stop-color="#A98959"/>
            <stop offset="0.514423" stop-color="#E5CCA8"/>
            <stop offset="0.75" stop-color="#AA8A59"/>
            <stop offset="0.870192" stop-color="#F0DBBC"/>
            </linearGradient>
            <linearGradient id="paint3_linear_1183_1512" x1="264.463" y1="-20.0902" x2="-32.5423" y2="113.379" gradientUnits="userSpaceOnUse">
            <stop stop-color="#C7AA7F"/>
            <stop offset="0.211538" stop-color="#785C32"/>
            <stop offset="0.514423" stop-color="#D9AF72"/>
            <stop offset="0.75" stop-color="#9C8460"/>
            <stop offset="0.870192" stop-color="#F8F4EE"/>
            </linearGradient>
            <linearGradient id="paint4_linear_1183_1512" x1="264.463" y1="-20.0902" x2="-32.5423" y2="113.379" gradientUnits="userSpaceOnUse">
            <stop stop-color="#C7AA7F"/>
            <stop offset="0.211538" stop-color="#785C32"/>
            <stop offset="0.514423" stop-color="#D9AF72"/>
            <stop offset="0.75" stop-color="#9C8460"/>
            <stop offset="0.870192" stop-color="#F8F4EE"/>
            </linearGradient>
            </defs>
            </svg>
            </div>
         </div>

        </div>
    `;
    return el;
}

function initMobileSlider() {

    const sliderContainer = document.querySelector('.menu-mobile-line_pols');
    const handle = document.querySelector('.menu-mobile-slider-handle');

    if (!sliderContainer || !handle) return;

    let currentSize = getTextSize();

    const handleWidth = handle.offsetWidth;

    function updateSliderPosition() {

        let percent = 0.5;

        if (currentSize === 'small') percent = 0;
        if (currentSize === 'large') percent = 1;

        const maxLeft = sliderContainer.offsetWidth - handleWidth;

        handle.style.left = `${percent * maxLeft}px`;
    }

    updateSliderPosition();

    function getSizeFromPosition(pos) {

        if (pos < 0.33) return 'small';
        if (pos > 0.66) return 'large';

        return 'medium';
    }

    function updateFromClientX(clientX) {

        const rect = sliderContainer.getBoundingClientRect();

        let x = clientX - rect.left;

        x = Math.max(
            0,
            Math.min(x, rect.width - handleWidth)
        );

        const pos = x / (rect.width - handleWidth);

        const newSize = getSizeFromPosition(pos);

        currentSize = newSize;

        setTextSize(newSize);

        updateSliderPosition();
    }

    // CLICK

    sliderContainer.addEventListener('click', (e) => {
        updateFromClientX(e.clientX);
    });

    // DRAG

    let isDragging = false;

    handle.addEventListener('mousedown', (e) => {

        e.preventDefault();

        isDragging = true;
    });

    window.addEventListener('mousemove', (e) => {

        if (!isDragging) return;

        updateFromClientX(e.clientX);
    });

    window.addEventListener('mouseup', () => {

        isDragging = false;
    });

    // TOUCH

    handle.addEventListener('touchstart', (e) => {

        e.preventDefault();

        isDragging = true;

        const touch = e.touches[0];

        updateFromClientX(touch.clientX);

    }, { passive: false });

    window.addEventListener('touchmove', (e) => {

        if (!isDragging) return;

        e.preventDefault();

        const touch = e.touches[0];

        updateFromClientX(touch.clientX);

    }, { passive: false });

    window.addEventListener('touchend', () => {

        isDragging = false;
    });

    // RESIZE

    window.addEventListener('resize', () => {

        currentSize = getTextSize();

        updateSliderPosition();
    });
}

function initMobileToggle(toggleElement, soundType) {
    if (!toggleElement) return;
    
    const savedState = localStorage.getItem(`${soundType}Enabled`);
    let isEnabled = savedState !== null ? savedState === 'true' : true;
    
    function updateState() {
        if (isEnabled) {
            toggleElement.classList.add('active');
        } else {
            toggleElement.classList.remove('active');
        }
    }
    
    updateState();
    
    toggleElement.addEventListener('click', (e) => {
        e.stopPropagation();
        isEnabled = !isEnabled;
        updateState();
        localStorage.setItem(`${soundType}Enabled`, isEnabled);
        
        const event = new CustomEvent(`${soundType}Toggle`, { detail: { enabled: isEnabled } });
        window.dispatchEvent(event);
    });
}

function initMobileFullscreenToggle(toggleElement) {
    if (!toggleElement) return;
    
    const savedState = localStorage.getItem('fullscreenEnabled');
    let isEnabled = savedState === 'true';
    
    function updateState() {
        if (isEnabled) {
            toggleElement.classList.add('active');
        } else {
            toggleElement.classList.remove('active');
        }
    }
    
    updateState();
    
    toggleElement.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            isEnabled = true;
        } else {
            document.exitFullscreen();
            isEnabled = false;
        }
        updateState();
        localStorage.setItem('fullscreenEnabled', isEnabled);
    });
    
    document.addEventListener('fullscreenchange', () => {
        isEnabled = !!document.fullscreenElement;
        updateState();
        localStorage.setItem('fullscreenEnabled', isEnabled);
    });
}

function initMobileMenu() {
    menuMobileOverlay = document.createElement('div');
    menuMobileOverlay.className = 'menu-mobile-overlay';
    document.body.appendChild(menuMobileOverlay);
    
    menuMobile = createMobileMenu();
    document.body.appendChild(menuMobile);
    
    menuMobileOverlay.addEventListener('click', closeMenu);
    
    const closeBtn = menuMobile.querySelector('.menu-mobile-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }
    
    // ========== ИНИЦИАЛИЗАЦИЯ КНОПКИ СКАЧИВАНИЯ ==========
    initDownloadButton();
    
    setTimeout(() => {
        initMobileSlider();
        
        const musicToggle = document.querySelector('.menu-mobile-toggle[data-sound="music"]');
        const effectsToggle = document.querySelector('.menu-mobile-toggle[data-sound="effects"]');
        const fullscreenToggle = document.querySelector('.menu-mobile-toggle[data-display="fullscreen"]');
        
        if (musicToggle) initMobileToggle(musicToggle, 'music');
        if (effectsToggle) initMobileToggle(effectsToggle, 'effects');
        if (fullscreenToggle) initMobileFullscreenToggle(fullscreenToggle);
    }, 100);
}

// Функция для инициализации кнопки скачивания
function initDownloadButton() {
    // Ищем все возможные кнопки скачивания
    const downloadButtons = document.querySelectorAll('.download, .download_block');
    
    downloadButtons.forEach(block => {
        const btn = block.querySelector('svg, .read');
        if (!btn) return;
        
        if (btn.dataset.downloadAttached === 'true') return;
        btn.dataset.downloadAttached = 'true';
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            const fileUrl = '/assets/files/artbook.pdf';
            const fileName = 'Артбук Око Мира.pdf';
            
            downloadFile(fileUrl, fileName);
            console.log('Скачивание файла начато:', fileName);
        });
    });
}


export async function initMenu(onClose) {

    // НЕ СОЗДАВАТЬ ПОВТОРНО
    if (menuEl || menuMobile) {

        return {
            menuEl,
            menuOverlay
        };
    }

    onCloseCallback = onClose;

    const menuHTML = await loadMenuHTML();

    const tempDiv = document.createElement('div');

    tempDiv.innerHTML = menuHTML;

    menuOverlay = tempDiv.querySelector('.menu-overlay');
    menuEl = tempDiv.querySelector('.menu');

    if (menuOverlay) {
        document.body.appendChild(menuOverlay);
    }

    if (menuEl) {
        document.body.appendChild(menuEl);
    }

    initMobileMenu();

    // =========================
    // OVERLAY
    // =========================

    if (menuOverlay) {

        menuOverlay.addEventListener('click', closeMenu);
    }

    // =========================
    // MENU
    // =========================

    if (menuEl) {

        const closeBtn =
            menuEl.querySelector('.close') ||
            menuEl.querySelector('.menu-close-btn');

        if (closeBtn) {

            closeBtn.addEventListener('click', (e) => {

                e.stopPropagation();

                closeMenu();
            });
        }

        menuEl.addEventListener('click', (e) => {

            e.stopPropagation();
        });
    }

    return {
        menuEl,
        menuOverlay
    };
}

export function openMenu() {
    if (isMobile()) {
        if (menuMobile) menuMobile.classList.add('open');
        if (menuMobileOverlay) menuMobileOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    } else {
        if (menuOverlay) menuOverlay.classList.add('open');
        if (menuEl) menuEl.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    isMenuOpen = true;
}

export function closeMenu() {
    if (isMobile()) {
        if (menuMobile) menuMobile.classList.remove('open');
        if (menuMobileOverlay) menuMobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
    } else {
        if (menuOverlay) menuOverlay.classList.remove('open');
        if (menuEl) menuEl.classList.remove('open');
        document.body.style.overflow = '';
    }
    isMenuOpen = false;
    
    if (onCloseCallback) {
        onCloseCallback();
    }
}

export function toggleMenu() {
    if (isMenuOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}

export function isMenuOpenState() {
    return isMenuOpen;
}

// menu.js - исправленная версия initMenuButton
export async function initMenuButton(menuBtnId = 'menuBtn') {

    // УЖЕ ИНИЦИАЛИЗИРОВАНО
    if (!isMenuInitialized) {
        await initMenu();
        isMenuInitialized = true;
    }

    const menuBtn = document.getElementById(menuBtnId);

    if (!menuBtn) {
        console.warn(`Кнопка с id="${menuBtnId}" не найдена в DOM, пропускаем инициализацию`);
        return; // Просто выходим, а не выбрасываем ошибку
    }

    // защита от повторного listener
    if (menuBtn.dataset.menuListenerAttached === 'true') {
        return;
    }

    menuBtn.dataset.menuListenerAttached = 'true';

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    console.log('Меню успешно инициализировано');
}
