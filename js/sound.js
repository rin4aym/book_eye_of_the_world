// sound.js

let isSoundEnabled = true;
let toggleElement = null;
let textElement = null;

// Получаем элемент переключателя из DOM
export function initSoundToggle() {
    toggleElement = document.querySelector('.toggle');
    if (!toggleElement) return null;
    
    // Находим элемент с текстом рядом
    const toggleRow = toggleElement.closest('.toggle_row');
    if (toggleRow) {
        textElement = toggleRow.querySelector('p');
    }
    
    // Загружаем сохранённое состояние
    const savedState = localStorage.getItem('soundEnabled');
    if (savedState !== null) {
        isSoundEnabled = savedState === 'true';
    } else {
        // По умолчанию звук включен
        isSoundEnabled = true;
    }
    
    updateToggleState();
    updateTextState();
    
    // Добавляем обработчик клика
    toggleElement.addEventListener('click', () => {
        toggleSound();
    });
    
    return toggleElement;
}

// Переключение звука
export function toggleSound() {
    isSoundEnabled = !isSoundEnabled;
    updateToggleState();
    updateTextState();
    localStorage.setItem('soundEnabled', isSoundEnabled);
    
    // Событие для других модулей
    const event = new CustomEvent('soundToggle', { detail: { enabled: isSoundEnabled } });
    window.dispatchEvent(event);
}

// Обновление визуального состояния переключателя
function updateToggleState() {
    if (!toggleElement) return;
    
    if (isSoundEnabled) {
        toggleElement.classList.add('active');
    } else {
        toggleElement.classList.remove('active');
    }
}

// Обновление текста
function updateTextState() {
    if (!textElement) return;
    
    if (isSoundEnabled) {
        textElement.textContent = 'Включен';
    } else {
        textElement.textContent = 'Выключен';
    }
}

// Получить текущее состояние звука
export function isSoundEnabledState() {
    return isSoundEnabled;
}

// Включить звук
export function enableSound() {
    if (!isSoundEnabled) toggleSound();
}

// Выключить звук
export function disableSound() {
    if (isSoundEnabled) toggleSound();
}