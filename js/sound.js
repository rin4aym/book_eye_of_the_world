// sound.js

let musicEnabled = true;
let effectsEnabled = true;
let musicToggle = null;
let effectsToggle = null;
let musicLabel = null;
let effectsLabel = null;

export function initSoundToggle() {
    // Находим переключатель музыки
    musicToggle = document.querySelector('.toggle[data-sound="music"]');
    if (musicToggle) {
        const toggleRow = musicToggle.closest('.toggle_row');
        if (toggleRow) {
            musicLabel = toggleRow.querySelector('.toggle-label');
        }
        
        const savedMusic = localStorage.getItem('musicEnabled');
        musicEnabled = savedMusic !== null ? savedMusic === 'true' : true;
        
        updateMusicToggleState();
        updateMusicLabelColor();
        
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMusic();
        });
    }
    
    // Находим переключатель эффектов
    effectsToggle = document.querySelector('.toggle[data-sound="effects"]');
    if (effectsToggle) {
        const toggleRow = effectsToggle.closest('.toggle_row');
        if (toggleRow) {
            effectsLabel = toggleRow.querySelector('.toggle-label');
        }
        
        const savedEffects = localStorage.getItem('effectsEnabled');
        effectsEnabled = savedEffects !== null ? savedEffects === 'true' : true;
        
        updateEffectsToggleState();
        updateEffectsLabelColor();
        
        effectsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleEffects();
        });
    }
}

// Переключение музыки
export function toggleMusic() {
    musicEnabled = !musicEnabled;
    updateMusicToggleState();
    updateMusicLabelColor();
    localStorage.setItem('musicEnabled', musicEnabled);
    
    const event = new CustomEvent('musicToggle', { detail: { enabled: musicEnabled } });
    window.dispatchEvent(event);
}

// Переключение эффектов
export function toggleEffects() {
    effectsEnabled = !effectsEnabled;
    updateEffectsToggleState();
    updateEffectsLabelColor();
    localStorage.setItem('effectsEnabled', effectsEnabled);
    
    const event = new CustomEvent('effectsToggle', { detail: { enabled: effectsEnabled } });
    window.dispatchEvent(event);
}

// Обновление визуального состояния переключателя музыки
function updateMusicToggleState() {
    if (!musicToggle) return;
    
    if (musicEnabled) {
        musicToggle.classList.add('active');
    } else {
        musicToggle.classList.remove('active');
    }
}

// Обновление визуального состояния переключателя эффектов
function updateEffectsToggleState() {
    if (!effectsToggle) return;
    
    if (effectsEnabled) {
        effectsToggle.classList.add('active');
    } else {
        effectsToggle.classList.remove('active');
    }
}

// Обновление цвета подписи музыки
function updateMusicLabelColor() {
    if (!musicLabel) return;
    
    if (musicEnabled) {
        musicLabel.style.color = '#FFFFFF';
        musicLabel.style.transition = 'color 0.3s ease';
    } else {
        musicLabel.style.color = '#585C62';
    }
}

// Обновление цвета подписи эффектов
function updateEffectsLabelColor() {
    if (!effectsLabel) return;
    
    if (effectsEnabled) {
        effectsLabel.style.color = '#FFFFFF';
        effectsLabel.style.transition = 'color 0.3s ease';
    } else {
        effectsLabel.style.color = '#585C62';
    }
}

// Получить состояние музыки
export function isMusicEnabled() {
    return musicEnabled;
}

// Получить состояние эффектов
export function isEffectsEnabled() {
    return effectsEnabled;
}

// Включить/выключить музыку
export function setMusic(enabled) {
    if (musicEnabled !== enabled) {
        toggleMusic();
    }
}

// Включить/выключить эффекты
export function setEffects(enabled) {
    if (effectsEnabled !== enabled) {
        toggleEffects();
    }
}