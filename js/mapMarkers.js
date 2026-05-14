// mapMarkers.js
import { initSummary, toggleSummary, isSummaryOpen, getCurrentMarkerId } from './summaryPanel.js';
import { initTips, showTips, updateTipsPositions, isTipOpen, closeTips } from './tipsPanel.js';
import { isMobile, transformCoordinates } from './mapConfig.js';

let summaryPanel = null;

// Функции для синхронизации состояния маркеров с подсказками
function onTipOpen(markerId) {
    // Находим маркер и активируем его
    const marker = document.querySelector(`.map-marker[data-marker-id="${markerId}"]`);
    if (marker) {
        const svg = marker.querySelector('svg');
        if (svg) {
            marker.setAttribute('data-active', 'true');
            svg.classList.add('active');
        }
    }
}

function onTipClose(markerId) {
    // Находим маркер и деактивируем его
    const marker = document.querySelector(`.map-marker[data-marker-id="${markerId}"]`);
    if (marker) {
        const svg = marker.querySelector('svg');
        if (svg) {
            marker.setAttribute('data-active', 'false');
            svg.classList.remove('active');
        }
    }
}

const tipsContainer = initTips(onTipOpen, onTipClose);

export function createMapMarkers(camera) {
    const overlay = document.getElementById('map-overlay');
    
    let currentMarkersPositions = [];

    const markersConfig = [
        { x: 1667, y: 2488, type: 'type1', number: 1, label: 'Двуречье', chapters: 'Глава 7', eventPage: 'chapter_1.html',
        description: 'Описание Двуречья...'},
        { x: 1903, y: 2209, type: 'type1', number: 2, label: 'Шадар Лагот', chapters: 'Глава 8', eventPage: 'chapter_2.html',
        description: 'Описание Шадар Лагот...' },
        { x: 2633, y: 2489, type: 'type1', number: 3, label: 'Лагерь Белоплащников', chapters: 'Глава 9', eventPage: 'chapter_3.html',
        description: 'Описание лагеря Белоплащников...' },
        { x: 3031, y: 2589, type: 'type1', number: 4, label: 'Кеймлин', chapters: 'Глава 10', eventPage: 'chapter_4.html',
        description: 'Описание Кеймлина...' },
        { x: 3748, y: 1068, type: 'type1', number: 5, label: 'Око мира', chapters: 'Глава 11', eventPage: 'chapter_5.html',
        description: 'Описание Око мира...' },
        { x: 1728, y: 2300, type: 'type2', id: 'marker_bairlon', label: 'Байрлон', 
        tipsText: 'Байрлон — древний город, известный своими кузнецами и оружейниками.'},
        { x: 2287, y: 2611, type: 'type2', id: 'marker_belomostye', label: 'Беломостье',
        tipsText: 'Беломостье — портовый город на берегу Белого моря.'},
        { x: 3474, y: 2182, type: 'type2', id: 'marker_kairien', label: 'Кайриэн',
        tipsText: 'Кайриэн — столица эльфов, город вечной зелени.'},
        { x: 3123, y: 1938, type: 'type2', id: 'marker_dragon_mountain', label: 'Драконова гора',
        tipsText: 'Легендарная гора, где по преданиям обитают драконы.'},
        { x: 3268, y: 1745, type: 'type2', id: 'marker_tar_valon', label: 'Тар Валон',
        tipsText: 'Тар Валон — город магов и чародеев.'},
        { x: 3853, y: 1278, type: 'type2', id: 'marker_fal_dara', label: 'Фал Дара',
        tipsText: 'Фал Дара — крепость на границе с Проклятыми землями.'},
        { x: 4017, y: 479, type: 'type2', id: 'marker_cursed_lands', label: 'Проклятые земли',
        tipsText: 'Проклятые земли — пустошь, поражённая тёмной магией.'},
        { x: 3586, y: 141, type: 'type2', id: 'marker_shayol_gul', label: 'Шайол Гул',
        tipsText: 'Шайол Гул — тюрьма Тёмного Властелина.'},
        { x: 3055, y: 299, type: 'type2', id: 'marker_great_waste', label: 'Великое Запустение',
        tipsText: 'Великое Запустение — безжизненная пустыня на востоке.'},
    ];

    const markers = [];

    summaryPanel = initSummary((closedMarkerId) => {

        if (closedMarkerId) {
            const marker = document.querySelector(`.map-marker[data-marker-id="${closedMarkerId}"]`);
            if (marker) {
                marker.setAttribute('data-active', 'false');
                const svg = marker.querySelector('svg');
                if (svg) {
                    svg.classList.remove('active');
                }
            }
        }
    });

    markersConfig.forEach(cfg => {
        // Трансформируем координаты для мобильной версии
        const transformedCoords = transformCoordinates(cfg.x, cfg.y);
        
        // Создаём копию конфига с трансформированными координатами
        const transformedCfg = {
            ...cfg,
            x: transformedCoords.x,
            y: transformedCoords.y
        };
        
        const marker = createMarker(transformedCfg, camera);
        // Добавляем атрибут для идентификации маркера
        marker.el.setAttribute('data-marker-id', cfg.id || String(cfg.number));
        overlay.appendChild(marker.el);
        markers.push(marker);
    });

    function update() {
        const newPositions = [];
        
        for (const m of markers) {
            // Используем трансформированные координаты из cfg
            const screen = worldToScreen(m.cfg.x, m.cfg.y, camera);
            m.el.style.left = screen.x + 'px';
            m.el.style.top = screen.y + 'px';
            
            newPositions.push({
                id: m.cfg.id || String(m.cfg.number),
                screenX: screen.x,
                screenY: screen.y
            });
        }
        
        currentMarkersPositions = newPositions;
        updateTipsPositions(currentMarkersPositions);
        
        requestAnimationFrame(update);
    }

    update();

    return markers;
}

function createMarker(cfg, camera) {
    const el = document.createElement('div');
    el.className = 'map-marker';
    el.setAttribute('data-active', 'false');
    el.setAttribute('data-type', cfg.type);

    if (cfg.type === 'type1') {
        el.innerHTML = `
            <div class="marker-tag tag1">
                <span class="tag-label">${cfg.label || ''}</span>
            </div>
            <div class="marker-icon-wrapper">
                <div class="marker-svg">
                    ${getSVG_type1()}
                </div>
                <div class="marker-number">
                    ${cfg.number ?? ''}
                </div>
            </div>
        `;
    } else if (cfg.type === 'type2') {
        el.innerHTML = `
            <div class="marker-tag tag2">
                <span class="tag-label">${cfg.label || ''}</span>
            </div>
            <div class="marker-icon-wrapper">
                <div class="marker-svg">
                    ${getSVG_type2()}
                </div>
            </div>
        `;
    }

    el.addEventListener('click', (e) => {
        e.stopPropagation();

        const screenPos = worldToScreen(cfg.x, cfg.y, camera);
        
        if (cfg.type === 'type1') {
            const markerId = cfg.id || String(cfg.number);
            const svg = el.querySelector('svg');
            
            // Проверяем, открыто ли сейчас окно именно для этого маркера
            if (summaryPanel && typeof isSummaryOpen === 'function' && typeof getCurrentMarkerId === 'function' && isSummaryOpen() && getCurrentMarkerId() === markerId) {
                // Если окно открыто для этого маркера - закрываем
                toggleSummary(
                    {
                        title: cfg.label,
                        chapters: cfg.chapters || 'Глава не указана',
                        text: cfg.description || 'Нет описания',
                        page: cfg.eventPage || null 
                    },
                    markerId
                );
                // Маркер будет деактивирован через колбэк в initSummary
            } else {
                // Деактивируем все маркеры
                const allMarkers = document.querySelectorAll('.map-marker[data-type="type1"]');
                allMarkers.forEach(marker => {
                    marker.setAttribute('data-active', 'false');
                    const markerSvg = marker.querySelector('svg');
                    if (markerSvg) {
                        markerSvg.classList.remove('active');
                    }
                });
                
                // Активируем текущий
                el.setAttribute('data-active', 'true');
                if (svg) {
                    svg.classList.add('active');
                }
                
                // Открываем summary
                toggleSummary(
                    {
                        title: cfg.label,
                        chapters: cfg.chapters || 'Глава не указана',
                        text: cfg.description || 'Нет описания',
                        page: cfg.eventPage || null 
                    },
                    markerId
                );
            }
        } else if (cfg.type === 'type2') {
            // Проверяем, открыта ли уже подсказка
            if (isTipOpen(cfg.id)) {
                closeTips(cfg.id);
            } else {
                showTips(
                    {
                        title: cfg.label,
                        text: cfg.tipsText || 'Нет описания'
                    },
                    cfg.id,
                    screenPos.x,
                    screenPos.y
                );
            }
        }
        
        console.log('Marker clicked:', cfg.id || cfg.number, 'Type:', cfg.type);
    });

    return { el, cfg };
}

function worldToScreen(x, y, camera) {
    return {
        x: x * camera.scale.x + camera.x,
        y: y * camera.scale.y + camera.y
    };
}

function getSVG_type1() {
    return `
        <svg id="sobytie" width="79" height="79" viewBox="0 0 79 79" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="39.502" cy="39.3555" r="32" fill="#33363B" stroke="url(#paint0_linear_1020_874)" stroke-width="2"/>
            <g id="rectang-group">
                <rect id="rectang" x="39.502" y="76.8826" width="52.8625" height="52.8625" transform="rotate(-135 39.502 76.8826)" stroke="url(#paint1_linear_1020_874)" stroke-width="3"/>
            </g>
            <circle id="circ" cx="39.502" cy="39.3555" r="29" fill="#33363B" stroke="url(#paint2_linear_1020_874)" stroke-width="2"/>
            <defs>
                <linearGradient id="paint0_linear_1020_874" x1="70.5042" y1="-20.3426" x2="-18.0393" y2="-13.0484" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#C7AA7F"/>
                    <stop offset="0.211538" stop-color="#785C32"/>
                    <stop offset="0.514423" stop-color="#D9AF72"/>
                    <stop offset="0.75" stop-color="#9C8460"/>
                    <stop offset="0.870192" stop-color="#F8F4EE"/>
                </linearGradient>
                <linearGradient id="paint1_linear_1020_874" x1="93.6736" y1="56.4066" x2="18.7301" y2="62.5804" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#C7AA7F"/>
                    <stop offset="0.211538" stop-color="#785C32"/>
                    <stop offset="0.514423" stop-color="#D9AF72"/>
                    <stop offset="0.75" stop-color="#9C8460"/>
                    <stop offset="0.870192" stop-color="#F8F4EE"/>
                </linearGradient>
                <linearGradient id="paint2_linear_1020_874" x1="67.6858" y1="-14.9155" x2="-12.8083" y2="-8.28446" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#C7AA7F"/>
                    <stop offset="0.211538" stop-color="#785C32"/>
                    <stop offset="0.514423" stop-color="#D9AF72"/>
                    <stop offset="0.75" stop-color="#9C8460"/>
                    <stop offset="0.870192" stop-color="#F8F4EE"/>
                </linearGradient>
            </defs>
        </svg>
    `;
}

function getSVG_type2() {
    return `
        <svg id="type2-marker" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_1025_906)">
                <g clip-path="url(#clip1_1025_906)">
                    <circle cx="14" cy="14" r="13.5" fill="#2C2C2C" stroke="url(#paint0_linear_1025_906)"/>
                </g>
            </g>
            <defs>
                <linearGradient id="paint0_linear_1025_906" x1="27.1525" y1="-11.3265" x2="-10.4115" y2="-8.23196" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#C7AA7F"/>
                    <stop offset="0.211538" stop-color="#785C32"/>
                    <stop offset="0.514423" stop-color="#D9AF72"/>
                    <stop offset="0.75" stop-color="#9C8460"/>
                    <stop offset="0.870192" stop-color="#F8F4EE"/>
                </linearGradient>
                <clipPath id="clip0_1025_906">
                    <rect width="28" height="28" fill="white"/>
                </clipPath>
                <clipPath id="clip1_1025_906">
                    <rect width="28" height="28" fill="white"/>
                </clipPath>
            </defs>
        </svg>
    `;
}