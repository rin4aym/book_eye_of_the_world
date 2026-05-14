// tipsPanel.js

let activeTips = [];
let onTipOpenCallback = null;
let onTipCloseCallback = null;
let scrollNotification = null;
let notificationTimeout = null;

// Для мобильных подсказок
let mobileTip = null;
let currentMobileMarkerId = null;

export function initTips(onOpen, onClose) {
    const tipsContainer = document.createElement('div');
    tipsContainer.className = 'tips-container';
    document.body.appendChild(tipsContainer);
    
    onTipOpenCallback = onOpen;
    onTipCloseCallback = onClose;
    
    // Создаем мобильную подсказку
    createMobileTip();
    
    console.log('Tips container created');
    return tipsContainer;
}

function createMobileTip() {
    // Удаляем старую, если есть
    if (mobileTip) {
        mobileTip.remove();
    }
    
    mobileTip = document.createElement('div');
    mobileTip.className = 'tips-mobile';
    mobileTip.innerHTML = `
        <div class="tips-mobile-header">
            <h4 class="tips-mobile-title"></h4>
            <div class="tips-mobile-close">
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L4 12M4 4L12 12" stroke="#585C62" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </div>
        </div>
        <div class="tips-mobile-content">
            <p class="tips-mobile-text"></p>
        </div>
    `;
    
    document.body.appendChild(mobileTip);
    
    // Закрытие по клику на крестик
    const closeBtn = mobileTip.querySelector('.tips-mobile-close');
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeCurrentMobileTip();
    });
    
    // Закрытие по клику на саму подсказку (но не на крестик)
    mobileTip.addEventListener('click', (e) => {
        if (!e.target.closest('.tips-mobile-close')) {
            closeCurrentMobileTip();
        }
    });
}

function isMobile() {
    return window.innerWidth <= 500;
}

function showMobileTip(data, markerId) {
    if (!mobileTip) {
        createMobileTip();
    }
    
    // Закрываем текущую подсказку, если открыта другая
    if (currentMobileMarkerId && currentMobileMarkerId !== markerId) {
        closeCurrentMobileTip();
    }
    
    // Заполняем данные
    const titleEl = mobileTip.querySelector('.tips-mobile-title');
    const textEl = mobileTip.querySelector('.tips-mobile-text');
    
    titleEl.textContent = data.title || '';
    textEl.textContent = data.text || 'Нет описания';
    
    // Показываем подсказку
    mobileTip.classList.add('open');
    currentMobileMarkerId = markerId;
    
    if (onTipOpenCallback) {
        onTipOpenCallback(markerId);
    }
    
    console.log('Mobile tip shown for marker:', markerId);
}

function closeCurrentMobileTip() {
    if (mobileTip) {
        mobileTip.classList.remove('open');
        
        if (currentMobileMarkerId && onTipCloseCallback) {
            onTipCloseCallback(currentMobileMarkerId);
        }
        
        currentMobileMarkerId = null;
        console.log('Mobile tip closed');
    }
}

export function showTips(data, markerId, markerX, markerY) {
    console.log('showTips called:', { markerId, markerX, markerY, data });
    
    // Проверяем, открыта ли уже эта подсказка
    const existingTip = activeTips.find(tip => tip.markerId === markerId);
    if (existingTip) {
        closeTips(markerId);
        return;
    }
    
    // НА МОБИЛЬНЫХ - показываем мобильную подсказку
    if (isMobile()) {
        showMobileTip(data, markerId);
        return;
    }
    
    // НА ДЕСКТОПЕ - создаем обычную подсказку
    const tipEl = document.createElement('div');
    tipEl.className = 'tips';
    tipEl.setAttribute('data-marker-id', markerId);
    
    tipEl.innerHTML = `
        <div class="tips-header">
            <h4 class="tips-title">${escapeHtml(data.title || '')}</h4>
            <div class="tips-close">
                <svg class="close tip" width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L4 12M4 4L12 12" stroke="#585C62" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </div>
        </div>
        <div class="tips-content">
            <p class="tips-text">${escapeHtml(data.text || 'Нет описания')}</p>
        </div>
    `;
    
    const container = document.querySelector('.tips-container');
    if (!container) {
        console.error('Tips container not found!');
        return;
    }
    container.appendChild(tipEl);
    
    // Позиционируем подсказку
    positionTip(tipEl, markerX, markerY);
    
    const closeBtn = tipEl.querySelector('.tips-close');
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeTips(markerId);
    });
    
    tipEl.addEventListener('click', (e) => {
        if (!e.target.closest('.tips-close')) {
            closeTips(markerId);
        }
    });
    
    activeTips.push({
        el: tipEl,
        markerId: markerId
    });
    
    if (onTipOpenCallback) {
        onTipOpenCallback(markerId);
    }
    
    console.log('Tips added, total active:', activeTips.length);
}

export function showScrollRestoreNotification(savedPosition) {
    if (scrollNotification) {
        scrollNotification.remove();
        if (notificationTimeout) clearTimeout(notificationTimeout);
    }
    
    const container = document.querySelector('.tips-container');
    if (!container) return;
    
    scrollNotification = document.createElement('div');
    scrollNotification.className = 'tips scroll-notification';
    scrollNotification.setAttribute('data-notification', 'scroll');
    
    scrollNotification.innerHTML = `
        <div class="tips-header">
            <h4 class="tips-title">Вы остановились на&nbsp;этом месте</h4>
            <div class="tips-close">
                <svg class="close tip scroll-close" width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L4 12M4 4L12 12" stroke="#585C62" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </div>
        </div>
        <div class="tips-content">
            <p class="tips-text go-to-top-link">Вернуться к началу</p>
        </div>
    `;
    
    container.appendChild(scrollNotification);
    
    requestAnimationFrame(() => {
        positionNotificationInCorner(scrollNotification);
    
        requestAnimationFrame(() => {
            scrollNotification.classList.add('open');
        });
    });
    
    const closeBtn = scrollNotification.querySelector('.scroll-close');
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeScrollNotification();
    });
    
    const goToTopLink = scrollNotification.querySelector('.go-to-top-link');
    goToTopLink.addEventListener('click', (e) => {
        e.stopPropagation();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeScrollNotification();
    });
    
    scrollNotification.addEventListener('click', (e) => {
        if (!e.target.closest('.tips-close') && !e.target.closest('.go-to-top-link')) {
            closeScrollNotification();
        }
    });
    
    notificationTimeout = setTimeout(() => {
        closeScrollNotification();
    }, 8000);
}

function positionNotificationInCorner(notification) {
    if (!notification) return;
    
    const notificationWidth = notification.offsetWidth;
    const notificationHeight = notification.offsetHeight;
    
    let right = 40;
    let bottom = 40;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (right + notificationWidth > viewportWidth - 20) {
        right = 40;
    }
    
    if (bottom + notificationHeight > viewportHeight - 20) {
        bottom = 40;
    }
    
    notification.style.position = 'fixed';
    notification.style.right = right + 'px';
    notification.style.bottom = bottom + 'px';
    notification.style.left = 'auto';
    notification.style.top = 'auto';
}

export function closeScrollNotification() {
    if (scrollNotification) {
        scrollNotification.remove();
        scrollNotification = null;
    }
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
        notificationTimeout = null;
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function positionTip(tipEl, markerX, markerY) {
    if (!tipEl) return;
    
    const tipWidth = tipEl.offsetWidth;
    const tipHeight = tipEl.offsetHeight;
    
    let left = markerX + 20;
    let top = markerY - tipHeight - 10;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (left + tipWidth > viewportWidth - 20) {
        left = markerX - tipWidth - 20;
    }
    
    if (top < 20) {
        top = markerY + 30;
    }
    
    if (top + tipHeight > viewportHeight - 20) {
        top = markerY - tipHeight - 10;
    }
    
    tipEl.style.position = 'absolute';
    tipEl.style.left = left + 'px';
    tipEl.style.top = top + 'px';
}

export function closeTips(markerId) {
    // Для мобильных
    if (isMobile()) {
        if (currentMobileMarkerId === markerId) {
            closeCurrentMobileTip();
        }
        return;
    }
    
    // Для десктопа
    const tipIndex = activeTips.findIndex(tip => tip.markerId === markerId);
    
    if (tipIndex !== -1) {
        const tip = activeTips[tipIndex];
        tip.el.remove();
        activeTips.splice(tipIndex, 1);
        
        if (onTipCloseCallback) {
            onTipCloseCallback(markerId);
        }
        
        console.log('Tips closed:', markerId);
    }
}

export function closeAllTips() {
    // Закрываем мобильную подсказку
    if (isMobile()) {
        closeCurrentMobileTip();
        return;
    }
    
    // Закрываем все десктопные
    const markerIds = activeTips.map(tip => tip.markerId);
    activeTips.forEach(tip => {
        tip.el.remove();
    });
    activeTips = [];
    
    markerIds.forEach(markerId => {
        if (onTipCloseCallback) {
            onTipCloseCallback(markerId);
        }
    });
    
    console.log('All tips closed');
}

export function updateTipsPositions(markersPositions) {
    // На мобильных не нужно обновлять позиции
    if (isMobile()) return;
    
    activeTips.forEach(tip => {
        const markerData = markersPositions.find(m => String(m.id) === String(tip.markerId));
        if (markerData) {
            positionTip(tip.el, markerData.screenX, markerData.screenY);
        }
    });
}

export function isTipOpen(markerId) {
    if (isMobile()) {
        return currentMobileMarkerId === markerId;
    }
    return activeTips.some(tip => tip.markerId === markerId);
}