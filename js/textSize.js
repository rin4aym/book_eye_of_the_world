// textSize.js

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

    function getSizeFromPos(pos) {

        if (pos < 0.33) return 'small';

        if (pos > 0.66) return 'large';

        return 'medium';
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

export function setTextSize(size) {

    currentSize = size;

    localStorage.setItem('textSize', size);

    applyCurrentSize();
}

export function getTextSize() {
    return currentSize;
}

// 🔥 ВАЖНО
// сразу применяем размер при загрузке файла
applyCurrentSize();