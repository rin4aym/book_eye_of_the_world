// mobileMenu.js

export function initMobileMenu() {
    const isMobile = window.innerWidth <= 500;
    const mobileMenu = document.querySelector('.mobile-bottom-menu');
    
    if (!mobileMenu) return;
    
    if (isMobile) {
        // Показываем меню
        mobileMenu.style.display = 'flex';
        
        // Получаем оригинальные кнопки
        const backBtn = document.getElementById('backBtn');
        const marksBtn = document.getElementById('marksBtn');
        const pathBtn = document.getElementById('pathBtn');
        const menuBtn = document.getElementById('menuBtn');
        
        // Добавляем обработчики
        const backItem = mobileMenu.querySelector('[data-action="back"]');
        const marksItem = mobileMenu.querySelector('[data-action="marks"]');
        const pathItem = mobileMenu.querySelector('[data-action="path"]');
        const menuItem = mobileMenu.querySelector('[data-action="menu"]');
        
        if (backItem && backBtn) {
            // Убираем старые обработчики
            const newBackItem = backItem.cloneNode(true);
            backItem.parentNode.replaceChild(newBackItem, backItem);
            newBackItem.addEventListener('click', (e) => {
                e.stopPropagation();
                backBtn.click();
            });
        }
        
        if (marksItem && marksBtn) {
            const newMarksItem = marksItem.cloneNode(true);
            marksItem.parentNode.replaceChild(newMarksItem, marksItem);
            newMarksItem.addEventListener('click', (e) => {
                e.stopPropagation();
                marksBtn.click();
            });
        }
        
        if (pathItem && pathBtn) {
            const newPathItem = pathItem.cloneNode(true);
            pathItem.parentNode.replaceChild(newPathItem, pathItem);
            newPathItem.addEventListener('click', (e) => {
                e.stopPropagation();
                pathBtn.click();
            });
        }
        
        if (menuItem && menuBtn) {
            const newMenuItem = menuItem.cloneNode(true);
            menuItem.parentNode.replaceChild(newMenuItem, menuItem);
            newMenuItem.addEventListener('click', (e) => {
                e.stopPropagation();
                menuBtn.click();
            });
        }
        
    } else {
        // Скрываем меню
        mobileMenu.style.display = 'none';
    }
}

// Слушаем изменение размера окна
window.addEventListener('resize', () => {
    initMobileMenu();
});

// Слушаем загрузку страницы
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
});