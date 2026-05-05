let activeTips = [];
let onTipOpenCallback = null;
let onTipCloseCallback = null;

export function initTips(onOpen, onClose) {
    const tipsContainer = document.createElement('div');
    tipsContainer.className = 'tips-container';
    document.body.appendChild(tipsContainer);
    
    // Сохраняем колбэки для уведомления маркеров
    onTipOpenCallback = onOpen;
    onTipCloseCallback = onClose;
    
    console.log('Tips container created');
    return tipsContainer;
}

export function showTips(data, markerId, markerX, markerY) {
    console.log('showTips called:', { markerId, markerX, markerY, data });
    
    // Проверяем, открыта ли уже подсказка для этого маркера
    const existingTip = activeTips.find(tip => tip.markerId === markerId);
    
    if (existingTip) {
        closeTips(markerId);
        return;
    }
    
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
    
    setTimeout(() => {
        positionTip(tipEl, markerX, markerY);
        tipEl.style.opacity = '1';
    }, 10);
    
    // Закрытие по клику на крестик
    const closeBtn = tipEl.querySelector('.tips-close');
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeTips(markerId);
    });
    
    // 🟢 НОВОЕ: закрытие по клику на всю подсказку
    tipEl.addEventListener('click', (e) => {
        // Проверяем, что клик не по крестику (чтобы не закрыть дважды)
        if (!e.target.closest('.tips-close')) {
            closeTips(markerId);
        }
    });
    
    activeTips.push({
        el: tipEl,
        markerId: markerId
    });
    
    // Уведомляем об открытии подсказки
    if (onTipOpenCallback) {
        onTipOpenCallback(markerId);
    }
    
    console.log('Tips added, total active:', activeTips.length);
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
    const tipIndex = activeTips.findIndex(tip => tip.markerId === markerId);
    
    if (tipIndex !== -1) {
        const tip = activeTips[tipIndex];
        tip.el.remove();
        activeTips.splice(tipIndex, 1);
        
        // Уведомляем о закрытии подсказки
        if (onTipCloseCallback) {
            onTipCloseCallback(markerId);
        }
        
        console.log('Tips closed:', markerId);
    }
}

export function closeAllTips() {
    const markerIds = activeTips.map(tip => tip.markerId);
    activeTips.forEach(tip => {
        tip.el.remove();
    });
    activeTips = [];
    
    // Уведомляем о закрытии всех подсказок
    markerIds.forEach(markerId => {
        if (onTipCloseCallback) {
            onTipCloseCallback(markerId);
        }
    });
    
    console.log('All tips closed');
}

export function updateTipsPositions(markersPositions) {
    activeTips.forEach(tip => {
        const markerData = markersPositions.find(m => String(m.id) === String(tip.markerId));
        if (markerData) {
            positionTip(tip.el, markerData.screenX, markerData.screenY);
        }
    });
}

export function isTipOpen(markerId) {
    return activeTips.some(tip => tip.markerId === markerId);
}