let menuOverlay = null;
let menuEl = null;
let isMenuOpen = false;
let onCloseCallback = null;

// Загружаем HTML меню
async function loadMenuHTML() {
    const response = await fetch('/menu.html');
    if (!response.ok) {
        throw new Error(`Ошибка загрузки menu.html: ${response.status} ${response.statusText}`);
    }
    return await response.text();
}

export async function initMenu(onClose) {
    onCloseCallback = onClose;
    
    // Загружаем HTML
    const menuHTML = await loadMenuHTML();
    
    // Создаем временный контейнер для парсинга HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = menuHTML;
    
    // Находим элементы
    menuOverlay = tempDiv.querySelector('.menu-overlay');
    menuEl = tempDiv.querySelector('.menu');
    
    if (!menuOverlay) {
        console.error('.menu-overlay не найден в menu.html');
    }
    if (!menuEl) {
        console.error('.menu не найден в menu.html');
    }
    
    // Добавляем на страницу
    if (menuOverlay) document.body.appendChild(menuOverlay);
    if (menuEl) document.body.appendChild(menuEl);
    
    // Добавляем обработчики событий
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }
    
    if (menuEl) {
        // Закрытие по крестику (ищем по классам)
        const closeBtn = menuEl.querySelector('.close') || menuEl.querySelector('.menu-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeMenu();
            });
        } else {
            console.warn('Кнопка закрытия не найдена в menu.html');
        }
        
        // Предотвращаем закрытие при клике на само меню
        menuEl.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Обработчики для пунктов меню
        const links = menuEl.querySelectorAll('.menu-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-link');
                handleMenuClick(page);
                closeMenu();
            });
        });
    }
    
    return { menuEl, menuOverlay };
}

function handleMenuClick(page) {
    console.log('Нажата ссылка:', page);
    switch(page) {
        case 'home':
            window.location.href = '/';
            break;
        case 'about':
        case 'map':
        case 'gallery':
        case 'contacts':
            console.log(page);
            break;
    }
}

export function openMenu() {
    if (!menuOverlay || !menuEl) {
        console.error('Меню не инициализировано');
        return;
    }
    
    menuOverlay.classList.add('open');
    menuEl.classList.add('open');
    isMenuOpen = true;
    document.body.style.overflow = 'hidden';
}

export function closeMenu() {
    if (!menuOverlay || !menuEl) {
        console.error('Меню не инициализировано');
        return;
    }
    
    menuOverlay.classList.remove('open');
    menuEl.classList.remove('open');
    isMenuOpen = false;
    document.body.style.overflow = '';
    
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

// Инициализация кнопки меню
export async function initMenuButton(menuBtnId = 'menuBtn') {
    await initMenu();
    
    const menuBtn = document.getElementById(menuBtnId);
    if (!menuBtn) {
        throw new Error(`Кнопка с id="${menuBtnId}" не найдена в DOM`);
    }
    
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
    console.log('Меню успешно инициализировано');
}