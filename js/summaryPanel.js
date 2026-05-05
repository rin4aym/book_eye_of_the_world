let summaryEl;
let isOpen = false;
let currentMarkerId = null;
let onSummaryCloseCallback = null;

export function initSummary(onClose) {
    // Сохраняем колбэк для уведомления о закрытии
    onSummaryCloseCallback = onClose;
    
    summaryEl = document.createElement('div');
    summaryEl.className = 'summary';

    summaryEl.innerHTML = `
        <div class="summary-header">
            <h1 class="summary-title"></h1>
            <div class="summary-close">
                <svg class="close" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="#585C62" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
        </div>
        <div class="summary-chapters">
            <p class="summary-chapters-text"></p>
        </div>
        <div class="ornament_header">
            <svg id="_Слой_2" data-name="Слой 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 779.74 37.04">
                <defs>
                    <style>
                    .cls-1 {
                        stroke-width: 2.83px;
                    }
                    .cls-1, .cls-2, .cls-3 {
                        fill: #585c62;
                        stroke: #585c62;
                        stroke-miterlimit: 10;
                    }
                    .cls-3 {
                        stroke-width: 2.83px;
                    }
                    </style>
                </defs>
                <g id="_Слой_4" data-name="Слой 4">
                    <line id="long_r" class="cls-3" x1="779.74" y1="14.87" x2="429.04" y2="14.87"/>
                    <path class="cls-2" d="M319.84,19.33s26.65-6.6,30.14,7.33c.24,.95-7.09,9.81-9.69,2.13-2.6-7.68-13.24-9.22-20.45-9.45Z"/>
                    <path class="cls-2" d="M459.54,19.33s-26.65-6.6-30.14,7.33c-.24,.95,7.09,9.81,9.69,2.13s13.24-9.22,20.45-9.45Z"/>
                    <rect class="cls-2" x="379.3" y="5.01" width="20.77" height="20.77" transform="translate(125.02 -271.04) rotate(45)"/>
                    <path class="cls-2" d="M394.77,36.82s7.24-23.1,30.73-23.99c2.76-.11,7.64,.16,10.87,.71-2.83,.9,.55,2.45-7.3,3.31-1.01,.11-2.1,.57-3.25,1-3.7,1.38-5.08,3.68-5.52,6.2-.71,4.02-1.65,9.93-12.53,9.22-10.87-.71-13,3.55-13,3.55Z"/>
                    <line id="long_l" class="cls-3" x1="0" y1="14.87" x2="350.21" y2="14.87"/>
                    <path class="cls-2" d="M384.49,36.82s-7.24-23.1-30.73-23.99c-2.76-.11-7.64,.16-10.87,.71,2.83,.9-.55,2.45,7.3,3.31,1.01,.11,2.1,.57,3.25,1,3.7,1.38,5.08,3.68,5.52,6.2,.71,4.02,1.65,9.93,12.53,9.22,10.87-.71,13,3.55,13,3.55Z"/>
                    <line class="cls-1" x1="309.47" y1="20.85" x2="172.11" y2="20.85"/>
                </g>
            </svg>
        </div>
        <div class="summary-content">
            <p class="summary-text"></p>
        </div>
        <div class="summary-button">
            <button class="summary-action-btn">
                <svg class="read" width="487" height="70" viewBox="0 0 487 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path id="active" d="M42.5885 1H444.564L484.566 35L444.564 69H42.5885L1.56641 35L42.5885 1Z" fill="url(#paint0_linear_1062_951)" stroke="url(#paint1_linear_1062_951)" stroke-width="2" stroke-linecap="round"/>
                    <path d="M42.5885 1H444.564L484.566 35L444.564 69H42.5885L1.56641 35L42.5885 1Z" fill="url(#paint2_linear_1062_951)"/>
                    <path id="hover" d="M42.5885 1H444.564L484.566 35L444.564 69H42.5885L1.56641 35L42.5885 1Z" fill="black" fill-opacity="0.2"/>
                    <path d="M42.5885 1H444.564L484.566 35L444.564 69H42.5885L1.56641 35L42.5885 1Z" stroke="url(#paint3_linear_1062_951)" stroke-width="2" stroke-linecap="round"/>
                    <path id="defoult" d="M42.5885 1H444.564L484.566 35L444.564 69H42.5885L1.56641 35L42.5885 1Z" fill="#585C62" stroke="url(#paint4_linear_1062_951)" stroke-width="2" stroke-linecap="round"/>
                    <path d="M209.52 43V41.834H210.444C210.664 41.834 210.855 41.8047 211.016 41.746C211.192 41.6727 211.324 41.5333 211.412 41.328C211.515 41.1227 211.566 40.8147 211.566 40.404V36.62C211.317 36.7227 211.009 36.8327 210.642 36.95C210.276 37.0673 209.843 37.17 209.344 37.258C208.846 37.346 208.281 37.39 207.65 37.39C206.902 37.39 206.228 37.3167 205.626 37.17C205.04 37.0087 204.534 36.752 204.108 36.4C203.698 36.0333 203.375 35.542 203.14 34.926C202.92 34.31 202.81 33.5473 202.81 32.638V29.888C202.81 29.4627 202.759 29.1547 202.656 28.964C202.568 28.7587 202.436 28.6267 202.26 28.568C202.099 28.4947 201.908 28.458 201.688 28.458H200.984V27.292H208.354V28.458H207.43C207.225 28.458 207.034 28.4947 206.858 28.568C206.682 28.6267 206.543 28.7587 206.44 28.964C206.352 29.1547 206.308 29.4627 206.308 29.888V32.572C206.308 33.3493 206.396 33.9653 206.572 34.42C206.748 34.86 207.027 35.1753 207.408 35.366C207.804 35.542 208.303 35.63 208.904 35.63C209.271 35.63 209.623 35.6007 209.96 35.542C210.312 35.4833 210.628 35.4173 210.906 35.344C211.185 35.256 211.405 35.1753 211.566 35.102V29.888C211.566 29.4627 211.515 29.1547 211.412 28.964C211.324 28.7587 211.192 28.6267 211.016 28.568C210.855 28.4947 210.664 28.458 210.444 28.458H209.52V27.292H217.11V28.458H216.186C215.981 28.458 215.79 28.4947 215.614 28.568C215.438 28.6267 215.299 28.7587 215.196 28.964C215.108 29.1547 215.064 29.4627 215.064 29.888V40.404C215.064 40.8147 215.108 41.1227 215.196 41.328C215.299 41.5333 215.438 41.6727 215.614 41.746C215.79 41.8047 215.981 41.834 216.186 41.834H217.11V43H209.52ZM218.106 43V41.834H218.37C218.59 41.834 218.818 41.8047 219.052 41.746C219.302 41.6727 219.507 41.5333 219.668 41.328C219.844 41.1227 219.932 40.8147 219.932 40.404V33.804C219.932 33.3787 219.844 33.0707 219.668 32.88C219.507 32.6747 219.302 32.5427 219.052 32.484C218.818 32.4107 218.59 32.374 218.37 32.374H218.106V31.208H224.772V32.374H224.728C224.538 32.374 224.325 32.4107 224.09 32.484C223.87 32.5427 223.68 32.6747 223.518 32.88C223.357 33.0707 223.276 33.3787 223.276 33.804V38.49L227.39 33.98V33.804C227.39 33.3787 227.31 33.0707 227.148 32.88C226.987 32.6747 226.796 32.5427 226.576 32.484C226.356 32.4107 226.144 32.374 225.938 32.374H225.894V31.208H232.56V32.374H232.296C232.091 32.374 231.864 32.4107 231.614 32.484C231.365 32.5427 231.152 32.6747 230.976 32.88C230.815 33.0707 230.734 33.3787 230.734 33.804V40.404C230.734 40.8147 230.815 41.1227 230.976 41.328C231.152 41.5333 231.365 41.6727 231.614 41.746C231.864 41.8047 232.091 41.834 232.296 41.834H232.56V43H225.894V41.834H225.938C226.144 41.834 226.356 41.8047 226.576 41.746C226.796 41.6727 226.987 41.5333 227.148 41.328C227.31 41.1227 227.39 40.8147 227.39 40.404V35.674L223.276 40.184V40.404C223.276 40.8147 223.357 41.1227 223.518 41.328C223.68 41.5333 223.87 41.6727 224.09 41.746C224.325 41.8047 224.538 41.834 224.728 41.834H224.772V43H218.106ZM235.693 43V41.834H235.935C236.229 41.834 236.493 41.7973 236.727 41.724C236.962 41.636 237.153 41.482 237.299 41.262C237.446 41.042 237.519 40.7413 237.519 40.36V32.462H236.243C235.979 32.462 235.767 32.5133 235.605 32.616C235.444 32.7187 235.312 32.902 235.209 33.166C235.121 33.4153 235.048 33.7747 234.989 34.244L234.901 34.97H233.383L233.515 31.208H244.845L244.977 34.97H243.459L243.371 34.244C243.313 33.7747 243.239 33.4153 243.151 33.166C243.063 32.902 242.939 32.7187 242.777 32.616C242.616 32.5133 242.396 32.462 242.117 32.462H240.863V40.36C240.863 40.7413 240.929 41.042 241.061 41.262C241.208 41.482 241.391 41.636 241.611 41.724C241.831 41.7973 242.073 41.834 242.337 41.834H242.579V43H235.693ZM249.87 43.22C249.224 43.22 248.638 43.0953 248.11 42.846C247.596 42.582 247.186 42.186 246.878 41.658C246.57 41.1153 246.416 40.4407 246.416 39.634C246.416 38.446 246.826 37.566 247.648 36.994C248.469 36.422 249.701 36.1067 251.344 36.048L253.148 35.982V34.772C253.148 34.2733 253.118 33.8407 253.06 33.474C253.001 33.0927 252.876 32.7993 252.686 32.594C252.495 32.374 252.194 32.264 251.784 32.264C251.417 32.264 251.124 32.3667 250.904 32.572C250.684 32.7773 250.53 33.0633 250.442 33.43C250.354 33.782 250.31 34.1853 250.31 34.64C249.327 34.64 248.586 34.53 248.088 34.31C247.589 34.09 247.34 33.7087 247.34 33.166C247.34 32.6233 247.545 32.1907 247.956 31.868C248.366 31.5453 248.916 31.3107 249.606 31.164C250.295 31.0027 251.05 30.922 251.872 30.922C253.412 30.922 254.563 31.2007 255.326 31.758C256.103 32.3153 256.492 33.2833 256.492 34.662V40.272C256.492 40.668 256.528 40.9833 256.602 41.218C256.69 41.438 256.829 41.5993 257.02 41.702C257.225 41.79 257.489 41.834 257.812 41.834H257.9V43H253.808L253.346 41.482H253.148C252.825 41.878 252.517 42.208 252.224 42.472C251.945 42.7213 251.622 42.9047 251.256 43.022C250.889 43.154 250.427 43.22 249.87 43.22ZM251.08 41.614C251.505 41.614 251.872 41.504 252.18 41.284C252.488 41.0493 252.722 40.7193 252.884 40.294C253.06 39.8687 253.148 39.37 253.148 38.798V37.148L252.158 37.214C251.571 37.2433 251.109 37.3607 250.772 37.566C250.434 37.7567 250.192 38.0353 250.046 38.402C249.899 38.754 249.826 39.194 249.826 39.722C249.826 40.1327 249.87 40.4847 249.958 40.778C250.046 41.0567 250.185 41.2693 250.376 41.416C250.566 41.548 250.801 41.614 251.08 41.614ZM260.916 43V41.834H261.158C261.451 41.834 261.715 41.7973 261.95 41.724C262.185 41.636 262.375 41.482 262.522 41.262C262.669 41.042 262.742 40.7413 262.742 40.36V32.462H261.466C261.202 32.462 260.989 32.5133 260.828 32.616C260.667 32.7187 260.535 32.902 260.432 33.166C260.344 33.4153 260.271 33.7747 260.212 34.244L260.124 34.97H258.606L258.738 31.208H270.068L270.2 34.97H268.682L268.594 34.244C268.535 33.7747 268.462 33.4153 268.374 33.166C268.286 32.902 268.161 32.7187 268 32.616C267.839 32.5133 267.619 32.462 267.34 32.462H266.086V40.36C266.086 40.7413 266.152 41.042 266.284 41.262C266.431 41.482 266.614 41.636 266.834 41.724C267.054 41.7973 267.296 41.834 267.56 41.834H267.802V43H260.916ZM271.022 43V41.834H271.264C271.631 41.834 271.924 41.7827 272.144 41.68C272.379 41.5773 272.555 41.4233 272.672 41.218C272.79 40.998 272.848 40.734 272.848 40.426V33.804C272.848 33.4667 272.79 33.1953 272.672 32.99C272.555 32.77 272.379 32.616 272.144 32.528C271.91 32.4253 271.616 32.374 271.264 32.374H271.022V31.208H278.282V32.462H277.996C277.674 32.462 277.373 32.506 277.094 32.594C276.83 32.6673 276.61 32.7993 276.434 32.99C276.273 33.1807 276.192 33.452 276.192 33.804V36.29H278.304C279.214 36.29 280.05 36.3707 280.812 36.532C281.575 36.6933 282.191 37.0087 282.66 37.478C283.13 37.9327 283.364 38.622 283.364 39.546C283.364 40.5287 282.954 41.35 282.132 42.01C281.326 42.67 280.086 43 278.414 43H271.022ZM277.842 41.724C278.576 41.724 279.096 41.5553 279.404 41.218C279.712 40.866 279.866 40.2867 279.866 39.48C279.866 38.7907 279.683 38.2993 279.316 38.006C278.95 37.7127 278.429 37.566 277.754 37.566H276.192V41.724H277.842Z" fill="white"/>
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
            </button>
        </div>
    `;

    document.body.appendChild(summaryEl);

    // Закрытие по крестику
    summaryEl.querySelector('.summary-close').addEventListener('click', () => {
        closeSummary();
    });
    
    // Обработчик для кнопки
    const actionBtn = summaryEl.querySelector('.summary-action-btn');
    if (actionBtn) {
        actionBtn.addEventListener('click', () => {
            console.log('Button clicked for marker:', currentMarkerId);
        });
    }
    
    return summaryEl;
}

export function toggleSummary(data, markerId) {
    // Повторный клик = закрытие
    if (isOpen && currentMarkerId === markerId) {
        closeSummary();
        return;
    }

    currentMarkerId = markerId;

    // Заголовок
    summaryEl.querySelector('.summary-title').textContent = data.title || '';
    
    // Подпись с главами
    const chaptersText = summaryEl.querySelector('.summary-chapters-text');
    if (data.chapters) {
        chaptersText.textContent = data.chapters;
        chaptersText.parentElement.style.display = 'block';
    } else {
        chaptersText.parentElement.style.display = 'none';
    }
    
    // Основной текст
    const textEl = summaryEl.querySelector('.summary-text');
    if (data.text) {
        textEl.innerHTML = data.text;
    } else {
        textEl.textContent = 'Нет описания';
    }
    
    // Сброс скролла
    const contentEl = summaryEl.querySelector('.summary-content');
    if (contentEl) {
        contentEl.scrollTop = 0;
    }
    
    summaryEl.classList.add('open');
    isOpen = true;
}

export function closeSummary() {
    summaryEl.classList.remove('open');
    
    // Уведомляем о закрытии, чтобы деактивировать маркер
    if (onSummaryCloseCallback) {
        onSummaryCloseCallback(currentMarkerId);
    }
    
    isOpen = false;
    currentMarkerId = null;
}

export function updateSummaryContent(data) {
    if (!isOpen) return;
    
    if (data.title) {
        summaryEl.querySelector('.summary-title').textContent = data.title;
    }
    if (data.chapters !== undefined) {
        const chaptersText = summaryEl.querySelector('.summary-chapters-text');
        if (data.chapters) {
            chaptersText.textContent = data.chapters;
            chaptersText.parentElement.style.display = 'block';
        } else {
            chaptersText.parentElement.style.display = 'none';
        }
    }
    if (data.text) {
        summaryEl.querySelector('.summary-text').innerHTML = data.text;
    }
}

export function getCurrentMarkerId() {
    return currentMarkerId;
}