// fullscreen.js

let fullscreenToggle = null;
let fullscreenLabel = null;
let isFullscreenEnabled = false;

export function initFullscreenToggle() {
    fullscreenToggle = document.querySelector('.toggle[data-display="fullscreen"]');
    if (!fullscreenToggle) return null;
    
    const toggleRow = fullscreenToggle.closest('.toggle_row');
    if (toggleRow) {
        fullscreenLabel = toggleRow.querySelector('.toggle-label');
    }
    
    // Загружаем сохранённое состояние
    const savedState = localStorage.getItem('fullscreenEnabled');
    
    // Проверяем текущее фактическое состояние
    const isActuallyFullscreen = !!document.fullscreenElement;
    
    if (savedState !== null && savedState === 'true' && !isActuallyFullscreen) {
        // Если сохранено "включено", но фактически не в полноэкранном режиме - включаем
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Ошибка при входе в полноэкранный режим: ${err.message}`);
            // Если не удалось включить, сбрасываем сохранённое состояние
            localStorage.setItem('fullscreenEnabled', 'false');
            isFullscreenEnabled = false;
            updateToggleState();
            updateLabelColor();
        });
        isFullscreenEnabled = true;
    } else if (savedState === 'true' && isActuallyFullscreen) {
        isFullscreenEnabled = true;
    } else if (savedState === 'false' && isActuallyFullscreen) {
        // Если сохранено "выключено", но в полноэкранном режиме - выходим
        document.exitFullscreen();
        isFullscreenEnabled = false;
    } else {
        isFullscreenEnabled = isActuallyFullscreen;
    }
    
    updateToggleState();
    updateLabelColor();
    
    // Обработчик клика по переключателю
    fullscreenToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFullscreen();
    });
    
    // Слушаем событие выхода из полноэкранного режима (ESC)
    document.addEventListener('fullscreenchange', onFullscreenChange);
    
    return fullscreenToggle;
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        // Вход в полноэкранный режим
        document.documentElement.requestFullscreen().then(() => {
            localStorage.setItem('fullscreenEnabled', 'true');
            isFullscreenEnabled = true;
            updateToggleState();
            updateLabelColor();
        }).catch(err => {
            console.error(`Ошибка при входе в полноэкранный режим: ${err.message}`);
            localStorage.setItem('fullscreenEnabled', 'false');
            isFullscreenEnabled = false;
            updateToggleState();
            updateLabelColor();
        });
    } else {
        // Выход из полноэкранного режима
        document.exitFullscreen().then(() => {
            localStorage.setItem('fullscreenEnabled', 'false');
            isFullscreenEnabled = false;
            updateToggleState();
            updateLabelColor();
        }).catch(err => {
            console.error(`Ошибка при выходе из полноэкранного режима: ${err.message}`);
        });
    }
}

function onFullscreenChange() {
    isFullscreenEnabled = !!document.fullscreenElement;
    
    // Сохраняем состояние
    localStorage.setItem('fullscreenEnabled', isFullscreenEnabled);
    
    updateToggleState();
    updateLabelColor();
    
    // Отправляем событие
    const event = new CustomEvent('fullscreenToggle', { 
        detail: { enabled: isFullscreenEnabled } 
    });
    window.dispatchEvent(event);
}

function updateToggleState() {
    if (!fullscreenToggle) return;
    
    if (isFullscreenEnabled) {
        fullscreenToggle.classList.add('active');
    } else {
        fullscreenToggle.classList.remove('active');
    }
}

function updateLabelColor() {
    if (!fullscreenLabel) return;
    
    if (isFullscreenEnabled) {
        fullscreenLabel.style.color = '#C7AA7F';
        fullscreenLabel.style.transition = 'color 0.3s ease';
    } else {
        fullscreenLabel.style.color = '#585C62';
    }
}

// Получить состояние полноэкранного режима
export function isFullscreenActive() {
    return isFullscreenEnabled;
}

// Включить полноэкранный режим
export function enableFullscreen() {
    if (!isFullscreenEnabled) {
        toggleFullscreen();
    }
}

// Выключить полноэкранный режим
export function disableFullscreen() {
    if (isFullscreenEnabled) {
        toggleFullscreen();
    }
}