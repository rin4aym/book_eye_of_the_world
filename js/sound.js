// sound.js

let musicEnabled = true;
let effectsEnabled = true;

let musicToggle = null;
let effectsToggle = null;

let musicLabel = null;
let effectsLabel = null;

// =========================
// ЗВУКИ
// =========================

// START / READ
let clickSound = null;

// MENU BTN
let menuSound = null;

// MOBILE MENU
let mobileMenuSound = null;

// TOGGLES
let toggleSound = null;

let observerInitialized = false;

// =========================
// СОЗДАНИЕ AUDIO
// =========================

function createAudio(src, volume = 0.5) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.volume = volume;
    return audio;
}

// =========================
// INIT SOUNDS
// =========================

function initSounds() {
    try {
        // START / READ
        clickSound = createAudio('./assets/audio/button.mp3', 0.5);
        
        // MENU BUTTON
        menuSound = createAudio('./assets/audio/menu.mp3', 0.5);
        
        // MOBILE MENU ITEMS
        mobileMenuSound = createAudio('./assets/audio/toggle.mp3', 0.5);
        
        // TOGGLES (для переключателей И ползунка)
        toggleSound = createAudio('./assets/audio/toggle.mp3', 0.5);
        
        clickSound.load();
        menuSound.load();
        mobileMenuSound.load();
        toggleSound.load();
        
        console.log('Все звуки инициализированы');
    } catch (error) {
        console.warn('Ошибка загрузки звуков:', error);
    }
}

// =========================
// PLAY
// =========================

function playSound(baseAudio) {
    if (!effectsEnabled) return;
    if (!baseAudio) return;
    
    try {
        const audio = baseAudio.cloneNode();
        audio.volume = baseAudio.volume;
        audio.currentTime = 0;
        
        const promise = audio.play();
        if (promise !== undefined) {
            promise.catch(error => {
                console.debug('Ошибка воспроизведения:', error);
            });
        }
    } catch (error) {
        console.debug('Ошибка звука:', error);
    }
}

// =========================
// PUBLIC PLAY
// =========================

export function playClickSound() {
    playSound(clickSound);
}

export function playMenuSound() {
    playSound(menuSound);
}

export function playMobileMenuSound() {
    playSound(mobileMenuSound);
}

export function playToggleSound() {
    playSound(toggleSound);
}

export function playSliderSnapSound() {
    playSound(toggleSound);
}

// =========================
// INIT
// =========================

export function initSoundToggle() {
    initSounds();
    
    // =========================
    // MUSIC TOGGLE
    // =========================
    
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
            playToggleSound();
            toggleMusic();
        });
    }
    
    // =========================
    // EFFECTS TOGGLE
    // =========================
    
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
            playToggleSound();
            toggleEffects();
        });
    }
    
    addSoundsToElements();
}

// =========================
// ДОБАВЛЕНИЕ ЗВУКОВ
// =========================

function addSound(selector, handler, eventType = 'click') {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
        const key = `soundAttached_${eventType}`;
        if (element.dataset[key] === 'true') return;
        
        element.dataset[key] = 'true';
        element.addEventListener(eventType, handler, { passive: true });
    });
}

function addSoundsToElements() {
    // =========================
    // START BUTTON
    // =========================
    addSound('.start_button', () => {
        playClickSound();
    }, 'mouseenter');
    
    // =========================
    // READ
    // =========================
    addSound('.read', () => {
        playClickSound();
    }, 'mouseenter');
    
    // =========================
    // MOBILE MENU ITEM
    // НО ИСКЛЮЧАЕМ кнопку меню, чтобы не было двойного звука
    // =========================
    const mobileItems = document.querySelectorAll('.mobile-menu-item');
    
    mobileItems.forEach(item => {
        // ПРОВЕРЯЕМ: если это кнопка меню - пропускаем, она получит звук через addSound('#menuBtn')
        const isMenuButton = item.closest('[data-action="menu"]') !== null;
        
        if (isMenuButton) {
            console.log('Пропускаем кнопку меню в mobile-menu-item, чтобы избежать двойного звука');
            return;
        }
        
        if (item.dataset.mobileSoundAttached === 'true') return;
        
        item.dataset.mobileSoundAttached = 'true';
        
        item.addEventListener('pointerdown', () => {
            playMobileMenuSound();
        }, { passive: true });
    });
    
    // =========================
    // MENU BTN (только для кнопки меню)
    // =========================
    addSound('#menuBtn', () => {
        playMenuSound();
    });
    
    // =========================
    // TOGGLE
    // =========================
    addSound('.toggle', () => {
        playToggleSound();
    });
    
    // =========================
    // MOBILE TOGGLE
    // =========================
    addSound('.menu-mobile-toggle', () => {
        playToggleSound();
    });
    
    // =========================
    // OBSERVER
    // =========================
    if (!observerInitialized) {
        observeNewElements();
        observerInitialized = true;
    }
}

// =========================
// OBSERVER
// =========================

function observeNewElements() {
    const observer = new MutationObserver(() => {
        addSoundsToElements();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// =========================
// MUSIC
// =========================

export function toggleMusic() {
    musicEnabled = !musicEnabled;
    updateMusicToggleState();
    updateMusicLabelColor();
    localStorage.setItem('musicEnabled', musicEnabled);
    
    const event = new CustomEvent('musicToggle', { detail: { enabled: musicEnabled } });
    window.dispatchEvent(event);
}

// =========================
// EFFECTS
// =========================

export function toggleEffects() {
    effectsEnabled = !effectsEnabled;
    updateEffectsToggleState();
    updateEffectsLabelColor();
    localStorage.setItem('effectsEnabled', effectsEnabled);
    
    const event = new CustomEvent('effectsToggle', { detail: { enabled: effectsEnabled } });
    window.dispatchEvent(event);
}

// =========================
// UI
// =========================

function updateMusicToggleState() {
    if (!musicToggle) return;
    if (musicEnabled) {
        musicToggle.classList.add('active');
    } else {
        musicToggle.classList.remove('active');
    }
}

function updateEffectsToggleState() {
    if (!effectsToggle) return;
    if (effectsEnabled) {
        effectsToggle.classList.add('active');
    } else {
        effectsToggle.classList.remove('active');
    }
}

function updateMusicLabelColor() {
    if (!musicLabel) return;
    musicLabel.style.transition = 'color 0.3s ease';
    if (musicEnabled) {
        musicLabel.style.color = '#FFFFFF';
    } else {
        musicLabel.style.color = '#585C62';
    }
}

function updateEffectsLabelColor() {
    if (!effectsLabel) return;
    effectsLabel.style.transition = 'color 0.3s ease';
    if (effectsEnabled) {
        effectsLabel.style.color = '#FFFFFF';
    } else {
        musicLabel.style.color = '#585C62';
    }
}

// =========================
// GETTERS
// =========================

export function isMusicEnabled() {
    return musicEnabled;
}

export function isEffectsEnabled() {
    return effectsEnabled;
}

// =========================
// SETTERS
// =========================

export function setMusic(enabled) {
    if (musicEnabled !== enabled) {
        toggleMusic();
    }
}

export function setEffects(enabled) {
    if (effectsEnabled !== enabled) {
        toggleEffects();
    }
}