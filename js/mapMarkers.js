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
        description: 'Накануне весеннего праздника Бель Тайн в деревне Двуречье друзья Ранд, Мэт и&nbsp;Перрин встречают пугающего незнакомца в плаще. В деревню прибывают Айз Сейдай Морейн, и&nbsp;её&nbsp;страж Лан, чем&nbsp;вызывают тревогу у&nbsp;местных жителей. Когда деревню окутала ночь, а Ранд ушел к своему отцу на далекую ферму на юношу и его отца напали троллоки – страшные преспешники Темного. Им удалось отбиться от неприятелей, но Тэм оказался серьезно ранен. Чтобы спасти его жизнь Ранд соорудил носилки и они вместе направились за помощью в деревню по&nbsp;опасной дороге.'},
        { x: 1903, y: 2209, type: 'type1', number: 2, label: 'Шадар Лагот', chapters: 'Глава 8', eventPage: 'chapter_2.html',
        description: 'Ранд узнаёт, что&nbsp;троллоки и&nbsp;мурдраал охотятся именно за&nbsp;ним,&nbsp;Мэтом и&nbsp;Перрином. Морейн убеждает их&nbsp;покинуть Эмондов Луг вместе с&nbsp;ней,&nbsp;Ланом, Эгвейн и&nbsp;позже Найнив, чтобы не&nbsp;подвергать деревню опасности. По&nbsp;пути герои переправляются через реку на&nbsp;пароме у&nbsp;Таренского перевала. Дальше компания добирается до&nbsp;Байрлона, где&nbsp;впервые сталкивается с&nbsp;настоящими слухами о&nbsp;войне, Лжедраконе и&nbsp;угрозе Темного. Там Ранд снова замечает загадочного черного всадника. После выхода из&nbsp;Байрлона героев начинают преследовать Белоплащники, Морейн вынуждена использовать Силу, чтобы спасти всех. Затем путники оказываются в&nbsp;проклятом городе-призраке Шадар Логот, где&nbsp;сталкиваются с древним злом. Там Мэт находит проклятый кинжал.' },
        { x: 2633, y: 2489, type: 'type1', number: 3, label: 'Лагерь Белоплащников', chapters: 'Глава 9', eventPage: 'chapter_3.html',
        description: 'После бегства из&nbsp;Шадар Логот герои разделяются на&nbsp;три&nbsp;группы. Ранд, Мэт и&nbsp;Том Меррилин спасаются на&nbsp;корабле и&nbsp;плывут вниз по&nbsp;реке. Мэт начинает меняться из-за&nbsp;проклятого кинжала из&nbsp;Шадар Логота. Позже им&nbsp;приходится путешествовать пешком, зарабатывая едой и&nbsp;ночлегом выступлениями. Когда их&nbsp;настигает мурдраал, Том&nbsp;жертвует собой, чтобы дать&nbsp;ребятам сбежать. После этого Ранд и&nbsp;Мэт продолжают путь вдвоем, постоянно скрываясь и&nbsp;едва не сходя с ума от&nbsp;усталости и страха. Перрин и&nbsp;Эгвейн встречают Элиас Мачера – человека, умеющего общаться с волками. Перрин начинает понимать, что и у него есть такая связь. Вместе с волками они уходят от троллоков и некоторое время путешествуют с кочевниками туата’ан, которые следуют «Пути Листа» и отказываются от насилия. Позже Перрина и Эгвейн захватывают Белоплащники. Их держат в плену и собираются судить, а возможно – пытать и казнить. Морейн, Лан и Найнив ищут остальных после разделения группы. В итоге они находят лагерь Белоплащников и составляют план по спасению ребят из плена.' },
        { x: 3031, y: 2589, type: 'type1', number: 4, label: 'Кеймлин', chapters: 'Глава 10', eventPage: 'chapter_4.html',
        description: 'Описание Кеймлина...' },
        { x: 3748, y: 1068, type: 'type1', number: 5, label: 'Око мира', chapters: 'Глава 11', eventPage: 'chapter_5.html',
        description: 'Описание Око мира...' },
        { x: 1728, y: 2300, type: 'type2', id: 'marker_bairlon', label: 'Байрлон', 
        tipsText: 'Город окружен бревенчатой стеной высотой почти в шесть метров с большими воротами, которые открываются только с рассвета до заката.'},
        { x: 2287, y: 2611, type: 'type2', id: 'marker_belomostye', label: 'Беломостье',
        tipsText: 'Город, названный в честь огромного молочно-белого моста, перекинутого через реку Аринель. Здесь представлены все социальные классы: от купцов до фермеров и крестьян.'},
        { x: 3474, y: 2182, type: 'type2', id: 'marker_kairien', label: 'Кайриэн',
        tipsText: 'Город известен прежде всего как резиденция короля Галдриана, место проведения политической игры Даэс Даэмар и прежде всего тем, что здесь ненавидят Айиль со времен Айильской войны.'},
        { x: 3123, y: 1938, type: 'type2', id: 'marker_dragon_mountain', label: 'Драконья гора',
        tipsText: 'Говорят, что это, возможно, самая высокая гора в мире, ее высота составляет не менее нескольких миль. Она был создан во время Разлома мира, когда Льюс Терин Теламон обрушил на себя столб энергии.'},
        { x: 3268, y: 1745, type: 'type2', id: 'marker_tar_valon', label: 'Тар Валон',
        tipsText: 'Это центр власти Айз Седай, а также второй по величине и численности населения город в Западных землях. ар Валоном управляет Амерлин, хотя повседневными делами занимается совет, состоящий из сестер Айз Седай и гражданских администраторов.'},
        { x: 3853, y: 1278, type: 'type2', id: 'marker_fal_dara', label: 'Фал Дара',
        tipsText: 'Город, расположенный недалеко от Границы со Скверной и являющийся частью последней линии обороны между ней и городами и фермами, расположенными южнее.'},
        { x: 4017, y: 479, type: 'type2', id: 'marker_cursed_lands', label: 'Проклятые земли',
        tipsText: 'Мертвые и безжизненные, они остаются такими из-за растущего влияния Темного, поскольку именно здесь находится гора Шайол-Гул, и поэтому они более уязвимы для него.'},
        { x: 3586, y: 141, type: 'type2', id: 'marker_shayol_gul', label: 'Шайол Гул',
        tipsText: 'Огромная черная гора, являющаяся тюрьмой Темного.'},
        { x: 3055, y: 299, type: 'type2', id: 'marker_great_waste', label: 'Великое Запустение',
        tipsText: 'Это выжженная земля, созданная под влиянием Тёмного на весь мир.Вся земля превратилась в пыль, и здесь почти нет растительности.Это очень засушливая местность, и, несмотря на существование Тысячи озёр Малкира, их воды ядовиты, и в них обитают чудовища.'},
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