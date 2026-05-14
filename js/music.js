// backgroundMusic.js

let audio = null;
let isMusicEnabled = true;
let isInitialized = false;
let currentPage = null;

// Пути к музыкальным файлам
const MUSIC_URLS = {
    index: 'assets/audio/index.mp3',   // музыка для главной страницы
    map: 'assets/audio/map.mp3',       // музыка для карты
    event: 'assets/audio/event-music.mp3'    // музыка для страниц глав (опционально)
};

export function initBackgroundMusic() {
    if (isInitialized) return;
    
    const page = document.body.dataset.page;
    currentPage = page;
    
    const musicUrl = MUSIC_URLS[page] || MUSIC_URLS.index;
    
    // Проверяем, есть ли уже аудио для этой страницы
    if (window.backgroundAudio && window.backgroundAudio.src === musicUrl) {
        audio = window.backgroundAudio;
    } else if (window.backgroundAudio) {
        // Если музыка была для другой страницы - останавливаем и создаём новую
        window.backgroundAudio.pause();
        audio = new Audio(musicUrl);
        window.backgroundAudio = audio;
    } else {
        audio = new Audio(musicUrl);
        window.backgroundAudio = audio;
    }
    
    audio.loop = true;
    audio.volume = 0.5;
    
    // Проверяем состояние музыки из localStorage
    const savedMusic = localStorage.getItem('musicEnabled');
    isMusicEnabled = savedMusic !== null ? savedMusic === 'true' : true;
    
    // Слушаем событие переключения музыки
    window.addEventListener('musicToggle', (e) => {
        if (e.detail.enabled) {
            playMusic();
        } else {
            pauseMusic();
        }
    });
    
    // Сохраняем время воспроизведения при уходе со страницы
    window.addEventListener('beforeunload', () => {
        if (audio && !audio.paused) {
            sessionStorage.setItem(`${currentPage}_musicTime`, audio.currentTime);
        }
    });
    
    // Запускаем музыку если включена
    if (isMusicEnabled) {
        const savedTime = sessionStorage.getItem(`${currentPage}_musicTime`);
        if (savedTime) {
            audio.currentTime = parseFloat(savedTime);
            sessionStorage.removeItem(`${currentPage}_musicTime`);
        }
        waitForUserInteraction();
    }
    
    isInitialized = true;
}

function waitForUserInteraction() {
    const startMusic = () => {
        if (isMusicEnabled && audio && audio.paused) {
            audio.play().catch(e => console.log('Автовоспроизведение заблокировано:', e));
        }
        document.removeEventListener('click', startMusic);
        document.removeEventListener('touchstart', startMusic);
        document.removeEventListener('keydown', startMusic);
    };
    
    document.addEventListener('click', startMusic);
    document.addEventListener('touchstart', startMusic);
    document.addEventListener('keydown', startMusic);
    
    // Пробуем сразу
    if (isMusicEnabled && audio) {
        audio.play().catch(e => console.log('Ожидание взаимодействия пользователя'));
    }
}

export function playMusic() {
    if (!audio) return;
    isMusicEnabled = true;
    audio.play().catch(e => console.log('Ошибка воспроизведения:', e));
}

export function pauseMusic() {
    if (!audio) return;
    isMusicEnabled = false;
    audio.pause();
}

export function setMusicVolume(volume) {
    if (!audio) return;
    audio.volume = Math.max(0, Math.min(1, volume));
}

export function getMusicState() {
    return {
        isPlaying: audio ? !audio.paused : false,
        isEnabled: isMusicEnabled,
        volume: audio ? audio.volume : 0.5,
        currentPage: currentPage
    };
}

// Переключение музыки для конкретной страницы (при переходе)
export function switchMusicForPage(page) {
    const musicUrl = MUSIC_URLS[page];
    if (!musicUrl) return;
    
    if (audio && audio.src !== musicUrl) {
        const wasPlaying = !audio.paused;
        const currentTime = audio.currentTime;
        
        // Сохраняем прогресс текущей страницы
        if (currentPage) {
            sessionStorage.setItem(`${currentPage}_musicTime`, currentTime);
        }
        
        // Создаём новый аудио элемент
        const newAudio = new Audio(musicUrl);
        newAudio.loop = true;
        newAudio.volume = audio.volume;
        
        // Заменяем старый
        audio.pause();
        audio = newAudio;
        window.backgroundAudio = audio;
        currentPage = page;
        
        // Восстанавливаем прогресс для новой страницы
        const savedTime = sessionStorage.getItem(`${page}_musicTime`);
        if (savedTime) {
            audio.currentTime = parseFloat(savedTime);
            sessionStorage.removeItem(`${page}_musicTime`);
        }
        
        if (wasPlaying && isMusicEnabled) {
            audio.play().catch(e => console.log('Ошибка воспроизведения:', e));
        }
    }
}