

let audio = null;
let isMusicEnabled = true;
let isInitialized = false;
let currentPage = null;

// Пути к музыкальным файлам
const MUSIC_URLS = {
    index: 'assets/audio/index.mp3',   // музыка для главной страницы
    map: 'assets/audio/map.mp3',       // музыка для карты
    event: null                         // для event музыки нет
};

export function initBackgroundMusic() {
    if (isInitialized) return;
    
    const page = document.body.dataset.page;
    currentPage = page;
    
    const musicUrl = MUSIC_URLS[page];
    
    // Для страницы event музыку не включаем
    if (page === 'event' || !musicUrl) {
        console.log('На этой странице музыка не предусмотрена');
        isInitialized = true;
        return;
    }
    
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

    let started = false;

    const startMusic = () => {

        // Защита от двойного вызова
        if (started) return;

        started = true;

        if (isMusicEnabled && audio && audio.paused) {

            audio.play().catch(e => {
                console.log('Автовоспроизведение заблокировано:', e);
            });
        }

        document.removeEventListener('pointerdown', startMusic);
        document.removeEventListener('keydown', startMusic);
    };

    // Вместо click + touchstart
    document.addEventListener('pointerdown', startMusic, {
        passive: true,
        once: true
    });

    document.addEventListener('keydown', startMusic, {
        once: true
    });

    // Пробуем сразу
    if (isMusicEnabled && audio) {

        audio.play().catch(() => {
            console.log('Ожидание взаимодействия пользователя');
        });
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

// Получить ссылку на текущий аудиоэлемент
export function getBackgroundAudio() {
    return audio;
}

// Переключение музыки для конкретной страницы (при переходе)
export function switchMusicForPage(page) {
    // Для страницы event музыку не включаем
    if (page === 'event') {
        if (audio) {
            audio.pause();
            audio = null;
            window.backgroundAudio = null;
        }
        currentPage = page;
        return;
    }
    
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
    } else if (!audio && musicUrl) {
        // Если аудио нет, создаём новое
        audio = new Audio(musicUrl);
        audio.loop = true;
        audio.volume = 0.5;
        window.backgroundAudio = audio;
        currentPage = page;
        
        if (isMusicEnabled) {
            audio.play().catch(e => console.log('Ошибка воспроизведения:', e));
        }
    }
}