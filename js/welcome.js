// welcomePopup.js

let popupElement = null;
let overlayElement = null;

function isMobile() {
    return window.innerWidth <= 500;
}

export function initWelcomePopup() {

    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (hasSeenWelcome === 'true') return;
    
    const mobile = isMobile();
    
    // Создаём затемнение
    overlayElement = document.createElement('div');
    overlayElement.className = 'welcome-overlay';
    
    // Создаём окно
    popupElement = document.createElement('div');
    
    if (mobile) {
        // Мобильная версия - добавляем специальный класс
        popupElement.className = 'welcome-popup welcome-popup-mobile';
    } else {
        popupElement.className = 'welcome-popup';
    }
    
    popupElement.innerHTML = `
        <div class="welcome-header">
            <h2 class="welcome-title">Добро пожаловать<br>в&nbsp;мир Колеса времени!</h2>
            <div class="welcome-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="#696B62" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
        </div>
        <div class="welcome-ornament">
            <svg id="_Слой_2" data-name="Слой 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 779.74 36.11">
            <defs>
                <style>
                .cls-1 {
                    fill: none;
                    stroke: #585c62;
                    stroke-miterlimit: 10;
                    stroke-width: 2.83px;
                }
                .cls-2 {
                    fill: #585c62;
                }
                </style>
            </defs>
            <g id="_Слой_2-2" data-name="Слой 2">
                <g>
                <path class="cls-1" d="M608.23,20.14h-137.36"/>
                <path class="cls-1" d="M779.74,14.16H429.04"/>
                <path class="cls-2" d="M319.84,18.62s26.65-6.6,30.14,7.33c.24,.95-7.09,9.81-9.69,2.13-2.6-7.68-13.24-9.22-20.45-9.45h0Z"/>
                <path class="cls-2" d="M459.54,18.62s-26.65-6.6-30.14,7.33c-.24,.95,7.09,9.81,9.69,2.13,2.6-7.68,13.24-9.22,20.45-9.45h0Z"/>
                <path class="cls-2" d="M404.37,14.69l-14.69-14.69-14.69,14.69,14.69,14.69,14.69-14.69Z"/>
                <path class="cls-2" d="M394.77,36.11s7.24-23.1,30.73-23.99c2.76-.11,7.64,.16,10.87,.71-2.83,.9,.55,2.45-7.3,3.31-1.01,.11-2.1,.57-3.25,1-3.7,1.38-5.08,3.68-5.52,6.2-.71,4.02-1.65,9.93-12.53,9.22-10.87-.71-13,3.55-13,3.55Z"/>
                <path class="cls-1" d="M0,14.16H350.21"/>
                <path class="cls-2" d="M384.49,36.11s-7.24-23.1-30.73-23.99c-2.76-.11-7.64,.16-10.87,.71,2.83,.9-.55,2.45,7.3,3.31,1.01,.11,2.1,.57,3.25,1,3.7,1.38,5.08,3.68,5.52,6.2,.71,4.02-1.65,9.93-12.53,9.22,10.87-.71,13,3.55,13,3.55Z"/>
                <path class="cls-1" d="M309.47,20.14H172.11"/>
                </g>
            </g>
            </svg>
        </div>
        <div class="welcome-content">
            <p class="welcome-text">Здесь Вы можете исследовать карту мира, узнавать об&nbsp;интересных местах и&nbsp;прочитать самые важные события из&nbsp;книги в&nbsp;сопровождении иллюстраций и&nbsp;анимаций.<br><br>Весь прогресс чтения сохраняется автоматически. Для&nbsp;большего погружения рекомендуем включить полноэкранный режим в&nbsp;меню. Приятного путешествия! </p>
            <div class="welcome-tips">
                <div class="welcome-tip">
                    <img class="tip-icon" src="assets/icons/tip_path.png" alt="пути">
                    <span class="tip-text">Нажмите, чтобы управлять отображением маршрутов героев</span>
                </div>
                <div class="welcome-tip">
                    <img class="tip-icon" src="assets/icons/tip_mark.png" alt="обозначения">
                    <span class="tip-text">Нажмите, чтобы увидеть условные обозначения </span>
                </div>
            </div>
        </div>
        <div class="welcome-button">
            <button type="button" class="welcome-action-btn" >
                ${mobile ? `
                <!-- Мобильная кнопка SVG -->
                <svg class="read" width="282" height="48" viewBox="0 0 282 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path id="active" d="M29.1621 0.734375H252.162L280.162 23.7344L252.162 46.7344H29.1621L1.16211 23.7344L29.1621 0.734375Z" fill="url(#paint0_linear_1183_1512)" stroke="url(#paint1_linear_1183_1512)" stroke-width="1.47486" stroke-linecap="round"/>
<path d="M29.1621 0.734375H252.162L280.162 23.7344L252.162 46.7344H29.1621L1.16211 23.7344L29.1621 0.734375Z" fill="url(#paint2_linear_1183_1512)"/>
<path d="M29.1621 0.734375H252.162L280.162 23.7344L252.162 46.7344H29.1621L1.16211 23.7344L29.1621 0.734375Z" fill="black" fill-opacity="0.2"/>
<path d="M29.1621 0.734375H252.162L280.162 23.7344L252.162 46.7344H29.1621L1.16211 23.7344L29.1621 0.734375Z" stroke="url(#paint3_linear_1183_1512)" stroke-width="1.47486" stroke-linecap="round"/>
<path id="defoult" d="M29.1621 0.734375H252.162L280.162 23.7344L252.162 46.7344H29.1621L1.16211 23.7344L29.1621 0.734375Z" fill="#585C62"/>
<path d="M29.1621 0.734375H252.162L280.162 23.7344L252.162 46.7344H29.1621L1.16211 23.7344L29.1621 0.734375Z" stroke="url(#paint4_linear_1183_1512)" stroke-width="1.47486" stroke-linecap="round"/>

<text class="text_btn" x="140" y="30" text-anchor="middle" fill="white" font-size="17"  pointer-events="none">
        Начать путешествие
    </text>

<defs>
<linearGradient id="paint0_linear_1183_1512" x1="271.717" y1="-17.8734" x2="-29.8376" y2="132.798" gradientUnits="userSpaceOnUse">
<stop stop-color="#C7AA7F"/>
<stop offset="0.0001" stop-color="#CCAA79"/>
<stop offset="0.211538" stop-color="#A98959"/>
<stop offset="0.514423" stop-color="#E5CCA8"/>
<stop offset="0.75" stop-color="#AA8A59"/>
<stop offset="0.870192" stop-color="#F0DBBC"/>
</linearGradient>
<linearGradient id="paint1_linear_1183_1512" x1="264.463" y1="-20.0902" x2="-32.5423" y2="113.379" gradientUnits="userSpaceOnUse">
<stop stop-color="#C7AA7F"/>
<stop offset="0.211538" stop-color="#785C32"/>
<stop offset="0.514423" stop-color="#D9AF72"/>
<stop offset="0.75" stop-color="#9C8460"/>
<stop offset="0.870192" stop-color="#F8F4EE"/>
</linearGradient>
<linearGradient id="paint2_linear_1183_1512" x1="271.717" y1="-17.8734" x2="-29.8376" y2="132.798" gradientUnits="userSpaceOnUse">
<stop stop-color="#C7AA7F"/>
<stop offset="0.0001" stop-color="#CCAA79"/>
<stop offset="0.211538" stop-color="#A98959"/>
<stop offset="0.514423" stop-color="#E5CCA8"/>
<stop offset="0.75" stop-color="#AA8A59"/>
<stop offset="0.870192" stop-color="#F0DBBC"/>
</linearGradient>
<linearGradient id="paint3_linear_1183_1512" x1="264.463" y1="-20.0902" x2="-32.5423" y2="113.379" gradientUnits="userSpaceOnUse">
<stop stop-color="#C7AA7F"/>
<stop offset="0.211538" stop-color="#785C32"/>
<stop offset="0.514423" stop-color="#D9AF72"/>
<stop offset="0.75" stop-color="#9C8460"/>
<stop offset="0.870192" stop-color="#F8F4EE"/>
</linearGradient>
<linearGradient id="paint4_linear_1183_1512" x1="264.463" y1="-20.0902" x2="-32.5423" y2="113.379" gradientUnits="userSpaceOnUse">
<stop stop-color="#C7AA7F"/>
<stop offset="0.211538" stop-color="#785C32"/>
<stop offset="0.514423" stop-color="#D9AF72"/>
<stop offset="0.75" stop-color="#9C8460"/>
<stop offset="0.870192" stop-color="#F8F4EE"/>
</linearGradient>
</defs>
</svg>
                ` : `
                <!-- Десктопная кнопка SVG -->
                <svg class="read" width="487" height="70" viewBox="0 0 487 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path id="active" d="M42.5885 1H444.564L484.566 35L444.564 69H42.5885L1.56641 35L42.5885 1Z" fill="url(#paint0_linear_1062_951)" stroke="url(#paint1_linear_1062_951)" stroke-width="2" stroke-linecap="round"/>
                    <path d="M42.5885 1H444.564L484.566 35L444.564 69H42.5885L1.56641 35L42.5885 1Z" fill="url(#paint2_linear_1062_951)"/>
                    <path id="hover" d="M42.5885 1H444.564L484.566 35L444.564 69H42.5885L1.56641 35L42.5885 1Z" fill="black" fill-opacity="0.2"/>
                    <path d="M42.5885 1H444.564L484.566 35L444.564 69H42.5885L1.56641 35L42.5885 1Z" stroke="url(#paint3_linear_1062_951)" stroke-width="2" stroke-linecap="round"/>
                    <path id="defoult" d="M42.5885 1H444.564L484.566 35L444.564 69H42.5885L1.56641 35L42.5885 1Z" fill="#585C62" stroke="url(#paint4_linear_1062_951)" stroke-width="2" stroke-linecap="round"/>
                    <text class="text_btn" x="243" y="43" text-anchor="middle" fill="white" font-size="20" font-family="Georgia">Начать путешествие</text>
                    <defs>
                        <linearGradient id="paint0_linear_1062_951" x1="469.947" y1="-26.5071" x2="-16.0354" y2="257.859" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#C7AA7F"/>
                            <stop offset="0.0001" stop-color="#CCAA79"/>
                            <stop offset="0.211538" stop-color="#A98959"/>
                            <stop offset="0.514423" stop-color="#E5CCA8"/>
                            <stop offset="0.75" stop-color="#AA8A59"/>
                            <stop offset="0.870192" stop-color="#F0DBBC"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_1062_951" x1="469.947" y1="-26.5071" x2="-16.0354" y2="257.859" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#C7AA7F"/>
                            <stop offset="0.211538" stop-color="#785C32"/>
                            <stop offset="0.514423" stop-color="#D9AF72"/>
                            <stop offset="0.75" stop-color="#9C8460"/>
                            <stop offset="0.870192" stop-color="#F8F4EE"/>
                        </linearGradient>
                        <linearGradient id="paint2_linear_1062_951" x1="469.947" y1="-26.5071" x2="-16.0354" y2="257.859" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#C7AA7F"/>
                            <stop offset="0.0001" stop-color="#CCAA79"/>
                            <stop offset="0.211538" stop-color="#A98959"/>
                            <stop offset="0.514423" stop-color="#E5CCA8"/>
                            <stop offset="0.75" stop-color="#AA8A59"/>
                            <stop offset="0.870192" stop-color="#F0DBBC"/>
                        </linearGradient>
                        <linearGradient id="paint3_linear_1062_951" x1="469.947" y1="-26.5071" x2="-16.0354" y2="257.859" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#C7AA7F"/>
                            <stop offset="0.211538" stop-color="#785C32"/>
                            <stop offset="0.514423" stop-color="#D9AF72"/>
                            <stop offset="0.75" stop-color="#9C8460"/>
                            <stop offset="0.870192" stop-color="#F8F4EE"/>
                        </linearGradient>
                        <linearGradient id="paint4_linear_1062_951" x1="469.947" y1="-26.5071" x2="-16.0354" y2="257.859" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#C7AA7F"/>
                            <stop offset="0.211538" stop-color="#785C32"/>
                            <stop offset="0.514423" stop-color="#D9AF72"/>
                            <stop offset="0.75" stop-color="#9C8460"/>
                            <stop offset="0.870192" stop-color="#F8F4EE"/>
                        </linearGradient>
                    </defs>
                </svg>
                `}
            </button>
        </div>
    `;
    
    overlayElement.appendChild(popupElement);
    document.body.appendChild(overlayElement);
    
    // Закрытие по кнопке
    const closeBtn = popupElement.querySelector('.welcome-close');
    closeBtn.addEventListener('click', closeWelcomePopup);
    
    // Закрытие по клику на кнопку действия
    const actionBtn = popupElement.querySelector('.welcome-action-btn');
    actionBtn.addEventListener('click', () => {
        closeWelcomePopup();
    });
    
    // Закрытие по клику на оверлей
    overlayElement.addEventListener('click', (e) => {
        if (e.target === overlayElement) {
            closeWelcomePopup();
        }
    });
    
    localStorage.setItem('hasSeenWelcome', 'true');
}

export function closeWelcomePopup() {
    if (popupElement) {
        popupElement.remove();
        popupElement = null;
    }
    if (overlayElement) {
        overlayElement.remove();
        overlayElement = null;
    }
}

export function resetWelcomePopup() {
    localStorage.removeItem('hasSeenWelcome');
}

window.resetWelcome = () => {
    localStorage.removeItem('hasSeenWelcome');
    console.log('Приветственное окно сброшено');
};

window.showWelcome = () => {
    closeWelcomePopup();
    initWelcomePopup();
    console.log('Приветственное окно показано');
};