// storage.js
import { showScrollRestoreNotification, closeScrollNotification } from './tipsPanel.js';

const STORAGE_KEY = 'scrollPosition';

export function saveScrollPosition() {
    const scrollY = window.scrollY;
    const currentPage = window.location.pathname;
    
    const savedPositions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    savedPositions[currentPage] = scrollY;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPositions));
}

export function restoreScrollPosition() {
    const currentPage = window.location.pathname;
    const savedPositions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    let savedY = savedPositions[currentPage];
    
    if (!savedY || savedY <= 0) return;
    
    // Определяем: обновление страницы или переход?
    // Если referrer пустой или это та же страница - значит обновление
    const isReload = document.referrer === '' || document.referrer === window.location.href;
    
    let restoreAttempts = 0;
    const maxAttempts = 20;
    let lastHeight = document.body.scrollHeight;
    let stableCount = 0;
    
    const tryRestore = () => {
        const currentHeight = document.body.scrollHeight;
        
        if (currentHeight === lastHeight) {
            stableCount++;
        } else {
            stableCount = 0;
            lastHeight = currentHeight;
        }
        
        if (stableCount >= 3 || restoreAttempts >= maxAttempts) {
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            savedY = Math.min(savedY, maxScroll);
            
            window.scrollTo({
                top: savedY,
                behavior: 'instant'
            });
            
            console.log(`Restored scroll position to: ${savedY}px`);
            
            // Показываем уведомление ТОЛЬКО если это переход (не обновление)
            if (!isReload) {
                setTimeout(() => {
                    showScrollRestoreNotification(savedY);
                }, 500);
            }
            
            return;
        }
        
        restoreAttempts++;
        setTimeout(tryRestore, 100);
    };
    
    const startRestore = () => {
        lastHeight = document.body.scrollHeight;
        stableCount = 0;
        restoreAttempts = 0;
        tryRestore();
    };
    
    if (document.readyState === 'complete') {
        setTimeout(startRestore, 100);
    } else {
        window.addEventListener('load', () => setTimeout(startRestore, 100));
    }
}

export function clearScrollPosition() {
    localStorage.removeItem(STORAGE_KEY);
}