// sound.js

let musicEnabled = true;
let effectsEnabled = true;

let musicToggle = null;
let effectsToggle = null;

let musicLabel = null;
let effectsLabel = null;

let thunderSound = null;
let molniyaSound = null;

let thunder2Sound = null;
let kanatSound = null;

let screamSound = null;
let timeSound = null;

// В sound.js добавьте
let strikeSound = null;
let endSound = null;

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

// HOVER звук (для наведения)
let hoverSound = null;

// BTN нажатие звук
let btnPressSound = null;

let observerInitialized = false;

let stepSound = null;

// Флаг для предотвращения множественных звуков при клике на toggle
let lastToggleClickTime = 0;
const TOGGLE_COOLDOWN = 150;

// Флаг для предотвращения множественных звуков ховера
let lastHoverTime = 0;
const HOVER_COOLDOWN = 200;

// ========== ДЛЯ ОСТАНОВКИ МУЗЫКИ ПРИ СВОРАЧИВАНИИ ==========
let backgroundMusicElement = null; // ссылка на текущий элемент музыки
let isPageVisible = true;

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
        
        // HOVER звук (легкий, короткий)
        hoverSound = createAudio('./assets/audio/button.mp3', 0.3);
        
        // BTN нажатие звук
        btnPressSound = createAudio('./assets/audio/toggle.mp3', 0.5);

        stepSound = createAudio('./assets/audio/step.mp3', 0.7);

        thunderSound = createAudio('./assets/audio/long_L.mp3', 0.6);
        molniyaSound = createAudio('./assets/audio/electr.mp3', 0.5);

        thunder2Sound = createAudio('./assets/audio/thunder.mp3', 0.6);
        kanatSound = createAudio('./assets/audio/kanat.mp3', 0.8);
        screamSound = createAudio('./assets/audio/scream.mp3', 0.8);

        // В initSounds()
        strikeSound = createAudio('./assets/audio/strike.mp3', 0.6);

        timeSound = createAudio('./assets/audio/time.mp3', 0.5);
        
        clickSound.load();
        menuSound.load();
        mobileMenuSound.load();
        toggleSound.load();
        hoverSound.load();
        btnPressSound.load();
        stepSound.load();
        thunderSound.load();
        molniyaSound.load();
        thunder2Sound.load();
        kanatSound.load();
        screamSound.load();
        strikeSound.load();
        timeSound.load();
        
        console.log('Все звуки инициализированы');
    } catch (error) {
        console.warn('Ошибка загрузки звуков:', error);
    }
}

// =========================
// PLAY
// =========================

function playSound(baseAudio, preventCooldown = false) {
    if (!effectsEnabled) {
        return;
    }
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
    const now = Date.now();
    if (now - lastToggleClickTime < TOGGLE_COOLDOWN) {
        return;
    }
    lastToggleClickTime = now;
    playSound(toggleSound);
}

export function playSliderSnapSound() {
    playSound(toggleSound);
}

// HOVER звук (с защитой от спама)
export function playHoverSound() {
    if (!effectsEnabled) return;
    
    const now = Date.now();
    if (now - lastHoverTime < HOVER_COOLDOWN) {
        return;
    }
    lastHoverTime = now;
    playSound(hoverSound);
}

// Звук нажатия на кнопку
export function playBtnPressSound() {
    playSound(btnPressSound);
}

export function playStepSound() {
    playSound(stepSound);
}

export function playThunderSound() {
    playSound(thunderSound);
}

export function playMolniyaSound() {
    playSound(molniyaSound);
}

export function playThunder2Sound() {
    playSound(thunder2Sound);
}

export function playKanatSound() {
    playSound(kanatSound);
}
export function playStrikeSound() {
    playSound(strikeSound);
}
export function playTimeSound() {
    playSound(timeSound);
}
// ========== ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ ФОНОВОЙ МУЗЫКОЙ ==========

// Регистрация элемента фоновой музыки
export function registerBackgroundMusic(audioElement) {
    backgroundMusicElement = audioElement;
}

// Пауза музыки при сворачивании
function pauseMusicOnHide() {
    if (backgroundMusicElement && musicEnabled && !backgroundMusicElement.paused) {
        backgroundMusicElement.pause();
        console.log('Музыка приостановлена (страница скрыта)');
    }
}

// Возобновление музыки при возвращении
function resumeMusicOnShow() {
    if (backgroundMusicElement && musicEnabled && backgroundMusicElement.paused && isPageVisible) {
        const playPromise = backgroundMusicElement.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.debug('Ошибка возобновления музыки:', error);
            });
        }
        console.log('Музыка возобновлена (страница видима)');
    }
}

// Обработчик видимости страницы
function handleVisibilityChange() {
    isPageVisible = !document.hidden;
    
    if (isPageVisible) {
        resumeMusicOnShow();
    } else {
        pauseMusicOnHide();
    }
}

// Инициализация слушателей видимости страницы
export function initVisibilityHandlers() {
    // Слушатель для сворачивания/разворачивания страницы
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Слушатель для события blur (окно потеряло фокус)
    window.addEventListener('blur', () => {
        if (backgroundMusicElement && musicEnabled && !backgroundMusicElement.paused) {
            backgroundMusicElement.pause();
            console.log('Музыка приостановлена (окно потеряло фокус)');
        }
    });
    
    // Слушатель для события focus (окно получило фокус)
    window.addEventListener('focus', () => {
        if (backgroundMusicElement && musicEnabled && backgroundMusicElement.paused && !document.hidden) {
            const playPromise = backgroundMusicElement.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.debug('Ошибка возобновления музыки:', error);
                });
            }
            console.log('Музыка возобновлена (окно получило фокус)');
        }
    });
    
    console.log('Слушатели видимости страницы инициализированы');
}

// =========================
// INIT
// =========================

export function initSoundToggle() {
    initSounds();
    
    // Инициализируем слушатели видимости
    initVisibilityHandlers();
    
    // =========================
    // MUSIC TOGGLE (десктопный)
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
        
        const newMusicToggle = musicToggle.cloneNode(true);
        musicToggle.parentNode?.replaceChild(newMusicToggle, musicToggle);
        musicToggle = newMusicToggle;
        
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            playToggleSound();
            toggleMusic();
        });
    }
    
    // =========================
    // EFFECTS TOGGLE (десктопный)
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
        
        const newEffectsToggle = effectsToggle.cloneNode(true);
        effectsToggle.parentNode?.replaceChild(newEffectsToggle, effectsToggle);
        effectsToggle = newEffectsToggle;
        
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
    // .btn КНОПКИ - HOVER (наведение)
    // =========================
    addSound('.btn', () => {
        playHoverSound();
    }, 'mouseenter');
    
    // =========================
    // .btn КНОПКИ - НАЖАТИЕ (click)
    // =========================
    addSound('.btn', () => {
        playBtnPressSound();
    }, 'click');
    
    // =========================
    // #sobytie КНОПКА - HOVER (наведение)
    // =========================
    addSound('#sobytie', () => {
        playHoverSound();
    }, 'mouseenter');
    
    // =========================
    // #sobytie КНОПКА - НАЖАТИЕ (click)
    // =========================
    addSound('#sobytie', () => {
        playBtnPressSound();
    }, 'click');

    addSound('.blue_btn', () => {
        playHoverSound();
    }, 'mouseenter');

    addSound('#blue_btn', () => {
        playBtnPressSound();
    }, 'click');

// =========================
// MOBILE MENU ITEM (ПРАВИЛЬНАЯ ВЕРСИЯ)
// =========================

    
    // =========================
    // MENU BTN
    // =========================
    addSound('#menuBtn', () => {
        playMenuSound();
    });
    
    // =========================
    // TOGGLE (десктопные)
    // =========================
    addSound('.toggle', () => {
        playToggleSound();
    });
    
    // =========================
    // MOBILE TOGGLE
    // =========================


    
    const mobileToggles = document.querySelectorAll('.menu-mobile-toggle');
    mobileToggles.forEach(toggle => {
        if (toggle.dataset.mobileToggleSoundAttached === 'true') return;
        toggle.dataset.mobileToggleSoundAttached = 'true';
        
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            playToggleSound();
        });
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
    
    // Если музыку выключили - останавливаем
    if (!musicEnabled && backgroundMusicElement) {
        backgroundMusicElement.pause();
    }
    // Если музыку включили и страница видима - запускаем
    if (musicEnabled && backgroundMusicElement && !document.hidden) {
        const playPromise = backgroundMusicElement.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.debug('Ошибка запуска музыки:', error);
            });
        }
    }
    
    console.log('Музыка:', musicEnabled ? 'включена' : 'выключена');
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
    
    console.log('Эффекты:', effectsEnabled ? 'включены' : 'выключены');
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
    
    const mobileMusicToggle = document.querySelector('.menu-mobile-toggle[data-sound="music"]');
    if (mobileMusicToggle) {
        if (musicEnabled) {
            mobileMusicToggle.classList.add('active');
        } else {
            mobileMusicToggle.classList.remove('active');
        }
    }
}

function updateEffectsToggleState() {
    if (!effectsToggle) return;
    if (effectsEnabled) {
        effectsToggle.classList.add('active');
    } else {
        effectsToggle.classList.remove('active');
    }
    
    const mobileEffectsToggle = document.querySelector('.menu-mobile-toggle[data-sound="effects"]');
    if (mobileEffectsToggle) {
        if (effectsEnabled) {
            mobileEffectsToggle.classList.add('active');
        } else {
            mobileEffectsToggle.classList.remove('active');
        }
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
        effectsLabel.style.color = '#585C62';
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

export function setThunderSoundDuration(durationMs) {
    if (thunderSound) {
        thunderSound.customDuration = durationMs;
        console.log(`Длительность звука грома установлена: ${durationMs}мс`);
    }

}

export function playScreamSound() {
    playSound(screamSound);
}