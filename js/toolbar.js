// mobileMenu.js

import { playMobileMenuSound } from './sound.js';

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


            attachClickOnce(menuItem, () => {
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


                attachClickOnce(backItem, () => {
                    backBtn.click();
                });
            }
            
            if (marksItem && marksBtn) {


                attachClickOnce(marksItem, () => {
                    marksBtn.click();
                });
            }
            
            if (pathItem && pathBtn) {


                attachClickOnce(pathItem, () => {
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

                
                if (currentChapter <= 1) {

                    prevItem.style.opacity = '0.5';
                    prevItem.style.pointerEvents = 'none';

                } else {

                    attachClickOnce(prevItem, () => {
                        goToPrevChapter(currentChapter);
                    });
                }
            }
            
            // Кнопка "НАВЕРХ"
            const upItem = mobileMenu.querySelector('[data-action="up"]');

            if (upItem) {


                attachClickOnce(upItem, () => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }
            
            // Кнопка "КАРТА"
            const mapItem = mobileMenu.querySelector('[data-action="map"]');

            if (mapItem) {


                attachClickOnce(mapItem, () => {
                    window.location.href = 'map.html';
                });
            }
            
            // Кнопка "СЛЕДУЮЩАЯ ГЛАВА"
            const nextItem = mobileMenu.querySelector('[data-action="next"]');

            if (nextItem) {

                
                if (currentChapter >= totalChapters) {

                    nextItem.style.opacity = '0.5';
                    nextItem.style.pointerEvents = 'none';

                } else {

                    attachClickOnce(nextItem, () => {
                        goToNextChapter(currentChapter);
                    });
                }
            }
        }
        
    } else {

        mobileMenu.style.display = 'none';
    }
}




// ===== CLICK ONLY ONCE =====
function attachClickOnce(item, callback) {

    if (!item) return;

    // Уже привязан
    if (item.dataset.mobileClickAttached === 'true') {
        return;
    }

    item.addEventListener('click', (e) => {

        e.stopPropagation();

        callback();

    });

    item.dataset.mobileClickAttached = 'true';
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


// ===== RESIZE =====
window.addEventListener('resize', () => {
    initMobileMenu();
});


// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
});