// textSize.js
import { playSliderSnapSound } from './sound.js';

const desktopTextSizes = {
    small: {
        text: '--text_size_S',
        line: '--line_size_S',
        head: '--head_size_S'
    },
    medium: {
        text: '--text_size_M',
        line: '--line_size_M',
        head: '--head_size_M'
    },
    large: {
        text: '--text_size_L',
        line: '--line_size_L',
        head: '--head_size_L'
    }
};

const mobileTextSizes = {
    small: {
        text: '--text_mob_S',
        line: '--line_mob_S',
        head: '--head_mob_S'
    },
    medium: {
        text: '--text_mob_M',
        line: '--line_mob_M',
        head: '--head_mob_M'
    },
    large: {
        text: '--text_mob_L',
        line: '--line_mob_L',
        head: '--head_mob_L'
    }
};

function isMobile() {
    return window.innerWidth <= 500;
}

let currentSize = localStorage.getItem('textSize') || 'medium';

function applyCurrentSize() {
    const sizes = isMobile()
        ? mobileTextSizes[currentSize]
        : desktopTextSizes[currentSize];

    const rootStyles = getComputedStyle(document.documentElement);

    const textValue = rootStyles.getPropertyValue(sizes.text).trim();
    const lineValue = rootStyles.getPropertyValue(sizes.line).trim();
    const headValue = rootStyles.getPropertyValue(sizes.head).trim();

    document.documentElement.style.setProperty('--current-text-size', textValue);
    document.documentElement.style.setProperty('--current-line-size', lineValue);
    document.documentElement.style.setProperty('--current-head-size', headValue);

    console.log('APPLIED:', {
        mobile: isMobile(),
        currentSize,
        textValue,
        lineValue,
        headValue
    });
}

export function initTextSizeSlider() {
    applyCurrentSize();

    const sliderContainer = document.querySelector('.line_pols');
    const handle = document.getElementById('textSizeSlider');

    if (!sliderContainer || !handle) return;

    const handleWidth = handle.offsetWidth;

    function updateSliderPosition() {
        const maxLeft = sliderContainer.offsetWidth - handleWidth;
        let percent = 0.5;
        if (currentSize === 'small') percent = 0;
        if (currentSize === 'large') percent = 1;
        handle.style.left = `${percent * maxLeft}px`;
    }

    function setSize(size) {
        if (size === currentSize) return;
        currentSize = size;
        localStorage.setItem('textSize', size);
        applyCurrentSize();
        updateSliderPosition();
    }

    let lastSliderSize = null;

    function getSizeFromPos(pos) {
        let size;
        if (pos < 0.33) {
            size = 'small';
        } else if (pos > 0.66) {
            size = 'large';
        } else {
            size = 'medium';
        }

        // звук только при смене позиции И если эффекты включены
        if (lastSliderSize !== size) {
            lastSliderSize = size;
            // Проверяем, включены ли эффекты через глобальную переменную или событие
            playSliderSnapSound();
        }
        return size;
    }

    sliderContainer.addEventListener('click', (e) => {
        const rect = sliderContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pos = x / rect.width;
        setSize(getSizeFromPos(pos));
    });

    let dragging = false;

    handle.addEventListener('mousedown', (e) => {
        dragging = true;
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const rect = sliderContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pos = x / rect.width;
        setSize(getSizeFromPos(pos));
    });

    window.addEventListener('mouseup', () => {
        dragging = false;
    });

    handle.addEventListener('touchstart', (e) => {
        dragging = true;
        e.preventDefault();
    });

    window.addEventListener('touchmove', (e) => {
        if (!dragging) return;
        const touch = e.touches[0];
        const rect = sliderContainer.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const pos = x / rect.width;
        setSize(getSizeFromPos(pos));
    }, { passive: false });

    window.addEventListener('touchend', () => {
        dragging = false;
    });

    updateSliderPosition();

    window.addEventListener('resize', () => {
        applyCurrentSize();
        updateSliderPosition();
    });
}

// Функция для мобильного ползунка в меню
export function initMobileTextSizeSlider() {
    const sliderContainer = document.querySelector('.menu-mobile-line_pols');
    const handle = document.querySelector('.menu-mobile-slider-handle');
    
    if (!sliderContainer || !handle) return false;
    
    let localCurrentSize = localStorage.getItem('textSize') || 'medium';
    const handleWidth = handle.offsetWidth;
    
    function updateSliderPosition() {
        let percent = 0.5;
        if (localCurrentSize === 'small') percent = 0;
        if (localCurrentSize === 'large') percent = 1;
        const maxLeft = sliderContainer.offsetWidth - handleWidth;
        handle.style.left = `${percent * maxLeft}px`;
    }
    
    function setSize(size) {
        if (size === localCurrentSize) return;
        localCurrentSize = size;
        localStorage.setItem('textSize', size);
        applyCurrentSize();
        updateSliderPosition();
    }
    
    let lastSize = null;
    
    function getSizeFromPosition(pos) {
        let size;
        if (pos < 0.33) {
            size = 'small';
        } else if (pos > 0.66) {
            size = 'large';
        } else {
            size = 'medium';
        }
        
        if (lastSize !== size) {
            lastSize = size;
            playSliderSnapSound();
        }
        return size;
    }
    
    function updateFromClientX(clientX) {
        const rect = sliderContainer.getBoundingClientRect();
        let x = clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width - handleWidth));
        const pos = x / (rect.width - handleWidth);
        const newSize = getSizeFromPosition(pos);
        setSize(newSize);
    }
    
    sliderContainer.addEventListener('click', (e) => {
        updateFromClientX(e.clientX);
    });
    
    let isDragging = false;
    
    handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
    });
    
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateFromClientX(e.clientX);
    });
    
    window.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    handle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDragging = true;
        const touch = e.touches[0];
        updateFromClientX(touch.clientX);
    }, { passive: false });
    
    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        updateFromClientX(touch.clientX);
    }, { passive: false });
    
    window.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    window.addEventListener('resize', () => {
        localCurrentSize = localStorage.getItem('textSize') || 'medium';
        updateSliderPosition();
    });
    
    updateSliderPosition();
    return true;
}

export function setTextSize(size) {
    currentSize = size;
    localStorage.setItem('textSize', size);
    applyCurrentSize();
}

export function getTextSize() {
    return currentSize;
}

// сразу применяем размер при загрузке файла
applyCurrentSize();