// textSize.js

const textSizes = {
    small: {
        text: 'var(--text_size_S)',
        line: 'var(--line_size_S)',
        head: 'var(--head_size_S)'
    },
    medium: {
        text: 'var(--text_size_M)',
        line: 'var(--line_size_M)',
        head: 'var(--head_size_M)'
    },
    large: {
        text: 'var(--text_size_L)',
        line: 'var(--line_size_L)',
        head: 'var(--head_size_L)'
    }
};

let currentSize = 'medium';

export function initTextSizeSlider() {
    const sliderContainer = document.querySelector('.line_pols');
    const handle = document.getElementById('textSizeSlider');
    
    if (!sliderContainer || !handle) {
        console.warn('Text size slider not found');
        return;
    }
    
    const handleWidth = handle.offsetWidth; // 16px
    
    // Загружаем сохранённое состояние
    const savedSize = localStorage.getItem('textSize');
    if (savedSize && textSizes[savedSize]) {
        currentSize = savedSize;
    }
    
    // Устанавливаем положение ползунка
    updateSliderPosition();
    
    // Применяем размеры текста
    applyTextSize();
    
    // Вычисляем позицию по клику
    function getPositionFromClick(clientX) {
        const rect = sliderContainer.getBoundingClientRect();
        let x = clientX - rect.left;
        // Ограничиваем от 0 до ширины контейнера
        x = Math.max(0, Math.min(x, rect.width));
        // Нормализуем от 0 до 1, учитывая ширину ползунка
        // крайнее левое положение: x = 0, крайнее правое: x = rect.width - handleWidth
        let adjustedX = Math.max(0, Math.min(x, rect.width - handleWidth));
        return adjustedX / (rect.width - handleWidth);
    }
    
    // Получаем размер по позиции
    function getSizeFromPosition(pos) {
        if (pos < 0.33) return 'small';
        if (pos > 0.66) return 'large';
        return 'medium';
    }
    
    // Обработчик клика по линии
    sliderContainer.addEventListener('click', (e) => {
        const pos = getPositionFromClick(e.clientX);
        const newSize = getSizeFromPosition(pos);
        setTextSize(newSize);
    });
    
    // Обработчик перетаскивания ползунка
    let isDragging = false;
    
    handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });
    
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const rect = sliderContainer.getBoundingClientRect();
        let x = e.clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width - handleWidth));
        const pos = x / (rect.width - handleWidth);
        const newSize = getSizeFromPosition(pos);
        setTextSize(newSize);
    });
    
    window.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    function updateSliderPosition() {
        let percent = 0.5;
        if (currentSize === 'small') percent = 0;
        else if (currentSize === 'large') percent = 1;
        else percent = 0.5;
        
        const sliderWidth = sliderContainer.offsetWidth;
        // Кружок шириной 16px, его центр должен быть на нужном проценте
        // left = (процент * ширина) - 8px (половина ширины кружка)
        const leftPos = (percent * sliderWidth) - 8;
        handle.style.left = `${leftPos}px`;
        
        // Добавляем атрибут для стилизации
        if (currentSize === 'small') handle.setAttribute('data-position', 'left');
        else if (currentSize === 'large') handle.setAttribute('data-position', 'right');
        else handle.removeAttribute('data-position');
    }
    
    function setTextSize(size) {
        if (size === currentSize) return;
        if (!textSizes[size]) return;
        
        currentSize = size;
        updateSliderPosition();
        applyTextSize();
        localStorage.setItem('textSize', size);
        
        console.log('Text size changed to:', size);
    }
    
    function applyTextSize() {
        const sizes = textSizes[currentSize];
        
        document.documentElement.style.setProperty('--current-text-size', sizes.text);
        document.documentElement.style.setProperty('--current-line-size', sizes.line);
        document.documentElement.style.setProperty('--current-head-size', sizes.head);
    }
}

export function getTextSize() {
    return currentSize;
}

export function setTextSize(size) {
    if (textSizes[size]) {
        currentSize = size;
        applyTextSize();
        localStorage.setItem('textSize', size);
        
        const handle = document.getElementById('textSizeSlider');
        const sliderContainer = document.querySelector('.line_pols');
        if (handle && sliderContainer) {
            const handleWidth = handle.offsetWidth;
            let percent = 0.5;
            if (size === 'small') percent = 0;
            else if (size === 'large') percent = 1;
            else percent = 0.5;
            
            const maxLeft = sliderContainer.offsetWidth - handleWidth;
            const leftPos = percent * maxLeft;
            handle.style.left = `${leftPos}px`;
        }
    }
}