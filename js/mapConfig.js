// mapConfig.js

// Определяем мобильное устройство
export function isMobile() {
    return window.innerWidth <= 500;
}

// Получаем путь к карте в зависимости от устройства
export function getMapPath() {
    if (isMobile()) {
        return '../assets/images/map_mobile.jpg'; // мобильная версия карты (меньше по размеру)
    }
    return '../assets/images/map.jpg'; // десктопная версия
}

// Коэффициент масштабирования координат для мобильной версии
export function getCoordinateScale() {
    if (isMobile()) {
        // Если мобильная карта уменьшена, например, в 2 раза
        return 0.5;
    }
    return 1;
}

const scaleX = 3500 / 4300; // 0.5
const scaleY = 3229 / 3967; // 0.5

// Трансформируем координаты для мобильной версии
export function transformCoordinates(x, y) {
    if (isMobile()) {
        return {
            x: x * scaleX , // коэффициент уменьшения карты
            y: y * scaleY
        };
    }
    return { x, y };
}