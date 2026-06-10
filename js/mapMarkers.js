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
        description: 'Накануне весеннего праздника Бел Тайн в\u00A0деревне Двуречье друзья Ранд, Мэт и\u00A0Перрин встречают пугающего незнакомца в\u00A0плаще. В\u00A0деревню прибывают Айз Сейдай Морейн, и\u00A0её\u00A0страж Лан, чем\u00A0вызывают тревогу у\u00A0местных жителей. Когда деревню окутала ночь, а\u00A0Ранд ушел к\u00A0своему отцу на\u00A0далекую ферму на\u00A0юношу и\u00A0его отца напали троллоки — страшные преспешники Темного. Им\u00A0удалось отбиться от\u00A0неприятелей, но\u00A0Тэм оказался серьезно ранен. Чтобы спасти его\u00A0жизнь Ранд соорудил носилки и\u00A0они\u00A0вместе направились за\u00A0помощью в\u00A0деревню по\u00A0опасной дороге.'},
        { x: 1903, y: 2209, type: 'type1', number: 2, label: 'Шадар Лагот', chapters: 'Глава 20', eventPage: 'chapter_2.html',
        description: 'Ранд узнаёт, что\u00A0троллоки и\u00A0мурдраал охотятся именно за\u00A0ним,\u00A0Мэтом и\u00A0Перрином. Морейн убеждает их\u00A0покинуть Эмондов Луг вместе с\u00A0ней,\u00A0Ланом, Эгвейн и\u00A0позже Найнив, чтобы не\u00A0подвергать деревню опасности. По\u00A0пути герои переправляются через реку на\u00A0пароме у\u00A0Таренского перевала. Дальше компания добирается до\u00A0Байрлона, где\u00A0впервые сталкивается с\u00A0настоящими слухами о\u00A0войне, Лжедраконе и\u00A0угрозе Темного. Там Ранд снова замечает загадочного черного всадника. После выхода из\u00A0Байрлона героев начинают преследовать Белоплащники, Морейн вынуждена использовать Силу, чтобы спасти всех. Затем путники оказываются в\u00A0проклятом городе-призраке Шадар Логот, где\u00A0сталкиваются с древним злом. Там\u00A0Мэт находит проклятый кинжал.' },
        { x: 2633, y: 2489, type: 'type1', number: 3, label: 'Лагерь Белоплащников', chapters: 'Глава 37', eventPage: 'chapter_3.html',
        description: 'После бегства из\u00A0Шадар Логот герои разделяются на\u00A0три\u00A0группы. Ранд, Мэт и\u00A0Том Меррилин спасаются на\u00A0корабле и\u00A0плывут вниз по\u00A0реке. Мэт начинает меняться из-за\u00A0проклятого кинжала из\u00A0Шадар Логота. Позже им\u00A0приходится путешествовать пешком, зарабатывая едой и\u00A0ночлегом выступлениями. Когда их\u00A0настигает мурдраал, Том\u00A0жертвует собой, чтобы дать\u00A0ребятам сбежать. После этого Ранд и\u00A0Мэт продолжают путь вдвоем, постоянно скрываясь и\u00A0едва не\u00A0сходя с\u00A0ума от\u00A0усталости и\u00A0страха. Перрин и\u00A0Эгвейн встречают Элиас Мачера – человека, умеющего общаться с волками. Перрин начинает понимать, что и\u00A0у\u00A0него есть такая связь. Вместе с волками они\u00A0уходят от\u00A0троллоков и\u00A0некоторое время путешествуют с\u00A0кочевниками туата’ан, которые следуют «Пути Листа» и\u00A0отказываются от\u00A0насилия. Позже Перрина и\u00A0Эгвейн захватывают Белоплащники. Их держат в\u00A0плену и\u00A0собираются судить, а\u00A0возможно – пытать и\u00A0казнить. Морейн, Лан и\u00A0Найнив ищут остальных после разделения группы. В\u00A0итоге они\u00A0находят лагерь Белоплащников и\u00A0составляют план по\u00A0спасению ребят из\u00A0плена.' },
        { x: 3031, y: 2589, type: 'type1', number: 4, label: 'Кеймлин', chapters: 'Глава 39', eventPage: 'chapter_4.html',
        description: 'Группа Морейн продолжает путь к\u00A0Кеймлину. Тем временем Ранд и\u00A0Мэт почти без\u00A0сил добираются до\u00A0Кеймлина. Мэт становится всё хуже из-за кинжала из\u00A0Шадар Логот: он\u00A0болен, раздражителен и\u00A0почти не\u00A0доверяет людям. Денег у\u00A0них почти\u00A0нет, поэтому они\u00A0ночуют где\u00A0придется и\u00A0скрываются от\u00A0друзей Тёмного. В\u00A0Кеймлине Ранд случайно оказывается рядом с\u00A0королевским дворцом и,\u00A0пытаясь лучше рассмотреть процессию, перелезает через стену сада. Там он\u00A0неожиданно встречает наследницу трона Элейн, её\u00A0брата Гавина и\u00A0Айз Седай Элэйну Траканд. Ранд ведет себя неловко, но\u00A0производит впечатление честного деревенского парня. Позже Ранд приводит больного Мэта в\u00A0гостиницу «Благословение королевы».' },
        { x: 3748, y: 1068, type: 'type1', number: 5, label: 'Око мира', chapters: 'Глава 50', eventPage: 'chapter_5.html',
        description: 'Группа оставалась в\u00A0Кеймлине недолго. Там Морейн узнаёт тревожные новости: ребята одновременно видели во\u00A0снах знак Ока Мира и\u00A0слышали, что Темный ищет\u00A0его. Она\u00A0понимает, что\u00A0нужно немедленно отправляться туда раньше слуг Тени. К\u00A0путешественникам присоединяется Лойал — огир, любящий книги и\u00A0истории. Именно он\u00A0помогает провести группу через Пути — древние магические дороги, созданные когда-то для огиров. Пути оказываются страшным и\u00A0почти мёртвым местом, заражённым тьмой. Там\u00A0героев преследует Черный Ветер — Ма́шин Шин, который пытается свести их\u00A0с\u00A0ума, выкрикивая их\u00A0страхи и тайны. Группа с\u00A0трудом выбирается из\u00A0Путей возле пограничного города Фал Дара в\u00A0Шиенар. Правитель города, лорд Агелмар, принимает их\u00A0как союзников в\u00A0борьбе с Тенью. Здесь герои впервые оказываются совсем близко к\u00A0Великому Запустению и\u00A0чувствуют, насколько серьёзна угроза Темного. Затем Морейн ведёт всех в\u00A0Запустение к\u00A0Оку Мира.' },
        { x: 1728, y: 2300, type: 'type2', id: 'marker_bairlon', label: 'Байрлон', 
        tipsText: 'Город окружен бревенчатой стеной высотой почти в\u00A0шесть метров с\u00A0большими воротами, которые открываются только с\u00A0рассвета до\u00A0заката.'},
        { x: 2287, y: 2611, type: 'type2', id: 'marker_belomostye', label: 'Беломостье',
        tipsText: 'Город, названный в\u00A0честь огромного молочно-белого моста, перекинутого через реку Аринель. Здесь представлены все социальные классы: от\u00A0купцов до\u00A0фермеров и\u00A0крестьян.'},
        { x: 3474, y: 2182, type: 'type2', id: 'marker_kairien', label: 'Кайриэн',
        tipsText: 'Город известен прежде всего как резиденция короля Галдриана, место проведения политической игры Даэс Даэмар и\u00A0прежде всего тем, что\u00A0здесь ненавидят Айиль со\u00A0времен Айильской войны.'},
        { x: 3123, y: 1938, type: 'type2', id: 'marker_dragon_mountain', label: 'Драконья гора',
        tipsText: 'Говорят, что\u00A0это, возможно, самая высокая гора в\u00A0мире, ее\u00A0высота составляет не\u00A0менее нескольких миль. Она был создан во\u00A0время Разлома мира, когда Льюс Терин Теламон обрушил на\u00A0себя столб энергии.'},
        { x: 3268, y: 1745, type: 'type2', id: 'marker_tar_valon', label: 'Тар Валон',
        tipsText: 'Это центр власти Айз Седай, а\u00A0также второй по величине и\u00A0численности населения город в Западных землях. Тар\u00A0Валоном управляет Амерлин, хотя повседневными делами занимается совет, состоящий из\u00A0сестер Айз Седай и\u00A0гражданских администраторов.'},
        { x: 3853, y: 1278, type: 'type2', id: 'marker_fal_dara', label: 'Фал Дара',
        tipsText: 'Город, расположенный недалеко от\u00A0Границы со\u00A0Скверной и\u00A0являющийся частью последней линии обороны между ней и\u00A0городами и\u00A0фермами, расположенными южнее.'},
        { x: 4017, y: 479, type: 'type2', id: 'marker_cursed_lands', label: 'Проклятые земли',
        tipsText: 'Мертвые и\u00A0безжизненные, они\u00A0остаются такими из-за растущего влияния Тёмного, поскольку именно здесь находится гора Шайол-Гул.'},
        { x: 3586, y: 141, type: 'type2', id: 'marker_shayol_gul', label: 'Шайол Гул',
        tipsText: 'Огромная чёрная гора, в\u00A0которую заточили Тёмного во\u00A0Времена Легенд.'},
        { x: 3055, y: 299, type: 'type2', id: 'marker_great_waste', label: 'Великое Запустение',
        tipsText: 'Это выжженная земля, созданная под влиянием Тёмного. Вся\u00A0земля превратилась в\u00A0пыль, здесь почти нет\u00A0растительности. Это\u00A0очень засушливая местность, несмотря на\u00A0существование Тысячи озёр Малкира, их\u00A0воды ядовиты, и\u00A0в\u00A0них обитают чудовища.'},
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