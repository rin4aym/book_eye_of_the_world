// mobileMenu.js

export function initMobileMenu() {
    const isMobile = window.innerWidth <= 500;
    const mobileMenu = document.querySelector('.mobile-bottom-menu');
    
    if (!mobileMenu) return;
    
    if (isMobile) {
        mobileMenu.style.display = 'flex';
        
        // Определяем тип страницы
        const page = document.body.dataset.page;
        const isChapterPage = page === 'event';
        const isMapPage = page === 'map';
        
        // ---- ОБЩАЯ КНОПКА МЕНЮ (работает на всех страницах) ----
        const menuBtn = document.getElementById('menuBtn');
        const menuItem = mobileMenu.querySelector('[data-action="menu"]');
        
        if (menuItem && menuBtn) {
            const newMenuItem = menuItem.cloneNode(true);
            menuItem.parentNode.replaceChild(newMenuItem, menuItem);
            newMenuItem.addEventListener('click', (e) => {
                e.stopPropagation();
                menuBtn.click();
            });
        }
        
        if (isMapPage) {
            // === КАРТА: кнопки back, marks, path ===
            const backBtn = document.getElementById('backBtn');
            const marksBtn = document.getElementById('marksBtn');
            const pathBtn = document.getElementById('pathBtn');
            
            const backItem = mobileMenu.querySelector('[data-action="back"]');
            const marksItem = mobileMenu.querySelector('[data-action="marks"]');
            const pathItem = mobileMenu.querySelector('[data-action="path"]');
            
            if (backItem && backBtn) {
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
            
        } else if (isChapterPage) {
            // === СТРАНИЦЫ ГЛАВ: кнопки prev, up, map, next ===
            const currentChapter = getCurrentChapter();
            const totalChapters = 5;
            
            // Кнопка "ПРЕДЫДУЩАЯ ГЛАВА"
            const prevItem = mobileMenu.querySelector('[data-action="prev"]');
            if (prevItem) {
                const newPrevItem = prevItem.cloneNode(true);
                prevItem.parentNode.replaceChild(newPrevItem, prevItem);
                
                if (currentChapter <= 1) {
                    newPrevItem.style.opacity = '0.5';
                    newPrevItem.style.pointerEvents = 'none';
                } else {
                    newPrevItem.addEventListener('click', (e) => {
                        e.stopPropagation();
                        goToPrevChapter(currentChapter);
                    });
                }
            }
            
            // Кнопка "НАВЕРХ" (прокрутка вверх)
            const upItem = mobileMenu.querySelector('[data-action="up"]');
            if (upItem) {
                const newUpItem = upItem.cloneNode(true);
                upItem.parentNode.replaceChild(newUpItem, upItem);
                newUpItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
            
            // Кнопка "КАРТА"
            const mapItem = mobileMenu.querySelector('[data-action="map"]');
            if (mapItem) {
                const newMapItem = mapItem.cloneNode(true);
                mapItem.parentNode.replaceChild(newMapItem, mapItem);
                newMapItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.location.href = 'map.html';
                });
            }
            
            // Кнопка "СЛЕДУЮЩАЯ ГЛАВА"
            const nextItem = mobileMenu.querySelector('[data-action="next"]');
            if (nextItem) {
                const newNextItem = nextItem.cloneNode(true);
                nextItem.parentNode.replaceChild(newNextItem, nextItem);
                
                if (currentChapter >= totalChapters) {
                    newNextItem.style.opacity = '0.5';
                    newNextItem.style.pointerEvents = 'none';
                } else {
                    newNextItem.addEventListener('click', (e) => {
                        e.stopPropagation();
                        goToNextChapter(currentChapter);
                    });
                }
            }
        }
        
    } else {
        mobileMenu.style.display = 'none';
    }
}

function getCurrentChapter() {
    const url = window.location.pathname;
    const match = url.match(/chapter_(\d+)\.html/);
    if (match) {
        return parseInt(match[1], 10);
    }
    const chapterAttr = document.body.getAttribute('data-chapter');
    if (chapterAttr) {
        return parseInt(chapterAttr, 10);
    }
    return 1;
}

function goToPrevChapter(currentChapter) {
    const prevChapter = currentChapter - 1;
    if (prevChapter >= 1) {
        window.location.href = `chapter_${prevChapter}.html`;
    }
}

function goToNextChapter(currentChapter) {
    const nextChapter = currentChapter + 1;
    if (nextChapter <= 5) {
        window.location.href = `chapter_${nextChapter}.html`;
    }
}

window.addEventListener('resize', () => {
    initMobileMenu();
});

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
});