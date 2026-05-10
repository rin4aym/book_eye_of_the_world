// naymAnimation.js

export function initNaymAnimation() {
    let container = document.querySelector('.animation_nayn');
    
    if (!container) {
        console.error('Контейнер .animation_nayn не найден');
        return null;
    }
    
    container.innerHTML = '';
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.overflow = 'visible';
    
    let spineCharacter = null;
    let originalBounds = null;
    let app = null;
    
    // ========== СОЗДАНИЕ ШКАЛЫ ==========
    const scaleContainer = document.createElement('div');
scaleContainer.className = 'naym-scale-container';
    
    // SVG шкалы
    const scaleSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    scaleSvg.setAttribute('width', '73');
    scaleSvg.setAttribute('height', '278');
    scaleSvg.setAttribute('viewBox', '0 0 73 278');
    scaleSvg.style.position = 'absolute';
    scaleSvg.style.top = '0';
    scaleSvg.style.left = '0';
    scaleSvg.style.width = '100%';
    scaleSvg.style.height = '100%';
    scaleSvg.style.pointerEvents = 'none';
    
    scaleSvg.innerHTML = `<svg width="73" height="278" viewBox="0 0 73 278" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M47.4437 54.6133C56.2158 62.7458 68.0683 87.989 45.3017 123.902C16.8435 168.793 16.551 174.974 27.8731 183.757" stroke="url(#paint0_linear_1150_1344)" stroke-width="1.93161"/>
<path d="M24.5446 196.617C16.3135 188.56 5.19188 163.551 26.5545 127.97C53.2578 83.4944 51.5622 72.5735 40.9383 63.8718" stroke="url(#paint1_linear_1150_1344)" stroke-width="1.93161"/>
<path d="M47.6669 55.125C56.4166 63.2758 70.3799 99.3348 47.6713 135.329C19.2855 180.321 20.7655 178.039 32.0588 186.841" stroke="url(#paint2_linear_1150_1344)" stroke-width="1.93161"/>
<path d="M24.346 195.59C16.061 187.533 2.83936 151.888 24.3418 116.307C51.2199 71.8316 51.8973 71.5462 41.2039 62.8444" stroke="url(#paint3_linear_1150_1344)" stroke-width="1.93161"/>
<path d="M53.8262 22.7199L53.8262 229.543L36.3326 250.125L18.839 229.543L18.839 22.7199L36.3326 1.61328L53.8262 22.7199Z" fill="#404040" stroke="url(#paint4_linear_1150_1344)" stroke-width="2.0599" stroke-linecap="round"/>
<path d="M3 271.613V270.773H3.46C3.75333 270.773 4.02 270.747 4.26 270.693C4.51333 270.627 4.71333 270.5 4.86 270.313C5.02 270.113 5.1 269.82 5.1 269.433V258.333H3.18C2.79333 258.333 2.48667 258.413 2.26 258.573C2.03333 258.72 1.86667 258.92 1.76 259.173C1.65333 259.413 1.58 259.68 1.54 259.973L1.44 260.833H0.4L0.5 257.333H11.76L11.86 260.833H10.82L10.72 259.973C10.6933 259.68 10.62 259.413 10.5 259.173C10.3933 258.92 10.2267 258.72 10 258.573C9.77333 258.413 9.46 258.333 9.06 258.333H7.12V269.333C7.12 269.747 7.19333 270.06 7.34 270.273C7.48667 270.473 7.68667 270.607 7.94 270.673C8.19333 270.74 8.46667 270.773 8.76 270.773H9.22V271.613H3ZM12.4256 271.613V270.773H12.4856C12.7256 270.773 12.939 270.733 13.1256 270.653C13.3123 270.573 13.4856 270.447 13.6456 270.273C13.8056 270.087 13.9656 269.853 14.1256 269.573L15.8856 266.533C15.4856 266.453 15.079 266.3 14.6656 266.073C14.2656 265.847 13.9323 265.54 13.6656 265.153C13.399 264.767 13.2656 264.293 13.2656 263.733C13.2656 263.133 13.4056 262.627 13.6856 262.213C13.979 261.787 14.419 261.46 15.0056 261.233C15.6056 261.007 16.3723 260.893 17.3056 260.893H22.9256V261.733H22.8656C22.5723 261.733 22.299 261.767 22.0456 261.833C21.8056 261.887 21.6056 262.013 21.4456 262.213C21.299 262.4 21.2256 262.693 21.2256 263.093V269.433C21.2256 269.82 21.299 270.113 21.4456 270.313C21.6056 270.5 21.8056 270.627 22.0456 270.693C22.299 270.747 22.5723 270.773 22.8656 270.773H23.1256V271.613H17.4456V270.773H17.7056C17.999 270.773 18.2656 270.747 18.5056 270.693C18.759 270.627 18.959 270.5 19.1056 270.313C19.2656 270.113 19.3456 269.82 19.3456 269.433V266.893H17.6856L16.0256 269.993C15.839 270.353 15.619 270.653 15.3656 270.893C15.1256 271.133 14.779 271.313 14.3256 271.433C13.8723 271.553 13.239 271.613 12.4256 271.613ZM17.4056 265.933H19.3456V261.813H17.4056C16.859 261.813 16.4256 261.907 16.1056 262.093C15.7856 262.28 15.5523 262.527 15.4056 262.833C15.2723 263.14 15.2056 263.467 15.2056 263.813C15.2056 264.187 15.2723 264.54 15.4056 264.873C15.5523 265.193 15.7856 265.453 16.1056 265.653C16.439 265.84 16.8723 265.933 17.4056 265.933ZM23.8389 271.613V270.773H24.0989C24.3922 270.773 24.6589 270.747 24.8989 270.693C25.1522 270.627 25.3522 270.5 25.4989 270.313C25.6589 270.113 25.7389 269.82 25.7389 269.433V263.093C25.7389 262.693 25.6589 262.4 25.4989 262.213C25.3522 262.013 25.1522 261.887 24.8989 261.833C24.6589 261.767 24.3922 261.733 24.0989 261.733H23.8389V260.893H29.3189V261.733H29.2589C28.9656 261.733 28.6922 261.767 28.4389 261.833C28.1989 261.887 27.9989 262.007 27.8389 262.193C27.6922 262.38 27.6189 262.673 27.6189 263.073V265.653H32.8989V263.093C32.8989 262.693 32.8189 262.4 32.6589 262.213C32.5122 262.013 32.3122 261.887 32.0589 261.833C31.8189 261.767 31.5522 261.733 31.2589 261.733H31.1989V260.893H36.6789V261.733H36.4189C36.1256 261.733 35.8522 261.767 35.5989 261.833C35.3589 261.887 35.1589 262.007 34.9989 262.193C34.8522 262.38 34.7789 262.673 34.7789 263.073V269.433C34.7789 269.82 34.8522 270.113 34.9989 270.313C35.1589 270.5 35.3589 270.627 35.5989 270.693C35.8522 270.747 36.1256 270.773 36.4189 270.773H36.6789V271.613H31.1989V270.773H31.2589C31.5522 270.773 31.8189 270.747 32.0589 270.693C32.3122 270.627 32.5122 270.5 32.6589 270.313C32.8189 270.113 32.8989 269.82 32.8989 269.433V266.573H27.6189V269.433C27.6189 269.82 27.6922 270.113 27.8389 270.313C27.9989 270.5 28.1989 270.627 28.4389 270.693C28.6922 270.747 28.9656 270.773 29.2589 270.773H29.3189V271.613H23.8389ZM37.6084 271.613V270.773H37.8684C38.1618 270.773 38.4284 270.747 38.6684 270.693C38.9218 270.627 39.1218 270.5 39.2684 270.313C39.4284 270.113 39.5084 269.82 39.5084 269.433V263.093C39.5084 262.693 39.4284 262.4 39.2684 262.213C39.1218 262.013 38.9218 261.887 38.6684 261.833C38.4284 261.767 38.1618 261.733 37.8684 261.733H37.6084V260.893H43.2884V261.733H43.0284C42.7351 261.733 42.4618 261.767 42.2084 261.833C41.9684 261.887 41.7684 262.007 41.6084 262.193C41.4618 262.38 41.3884 262.673 41.3884 263.073V268.073L46.6684 263.153V263.093C46.6684 262.693 46.5884 262.4 46.4284 262.213C46.2818 262.013 46.0818 261.887 45.8284 261.833C45.5884 261.767 45.3218 261.733 45.0284 261.733H44.9684V260.893H50.4484V261.733H50.1884C49.8951 261.733 49.6218 261.767 49.3684 261.833C49.1284 261.887 48.9284 262.007 48.7684 262.193C48.6218 262.38 48.5484 262.673 48.5484 263.073V269.433C48.5484 269.82 48.6218 270.113 48.7684 270.313C48.9284 270.5 49.1284 270.627 49.3684 270.693C49.6218 270.747 49.8951 270.773 50.1884 270.773H50.4484V271.613H44.7684V270.773H45.0284C45.3218 270.773 45.5884 270.747 45.8284 270.693C46.0818 270.627 46.2818 270.5 46.4284 270.313C46.5884 270.113 46.6684 269.82 46.6684 269.433V264.453L41.3884 269.333V269.433C41.3884 269.82 41.4618 270.113 41.6084 270.313C41.7684 270.5 41.9684 270.627 42.2084 270.693C42.4618 270.747 42.7351 270.773 43.0284 270.773H43.2884V271.613H37.6084ZM53.558 271.613V270.773H53.818C54.1113 270.773 54.378 270.747 54.618 270.693C54.8713 270.627 55.0713 270.5 55.218 270.313C55.378 270.113 55.458 269.82 55.458 269.433V261.813H53.798C53.4913 261.813 53.2446 261.86 53.058 261.953C52.8846 262.047 52.7446 262.213 52.638 262.453C52.5446 262.68 52.4646 263.007 52.398 263.433L52.298 264.093H51.318L51.438 260.893H61.338L61.458 264.093H60.478L60.378 263.433C60.3113 263.007 60.2246 262.68 60.118 262.453C60.0246 262.213 59.8846 262.047 59.698 261.953C59.5246 261.86 59.2846 261.813 58.978 261.813H57.338V269.433C57.338 269.82 57.4113 270.113 57.558 270.313C57.718 270.5 57.918 270.627 58.158 270.693C58.4113 270.747 58.6846 270.773 58.978 270.773H59.438V271.613H53.558ZM67.5955 271.813C66.1421 271.813 65.0021 271.333 64.1755 270.373C63.3621 269.413 62.9555 268.067 62.9555 266.333C62.9555 264.467 63.3421 263.06 64.1155 262.113C64.8888 261.167 65.9821 260.693 67.3955 260.693C68.6888 260.693 69.7021 261.093 70.4355 261.893C71.1821 262.693 71.5555 263.887 71.5555 265.473V266.393H64.8955C64.9221 267.367 65.0488 268.16 65.2755 268.773C65.5021 269.387 65.8288 269.84 66.2555 270.133C66.6955 270.413 67.2355 270.553 67.8755 270.553C68.3421 270.553 68.7555 270.487 69.1155 270.353C69.4888 270.22 69.8088 270.047 70.0755 269.833C70.3555 269.62 70.5755 269.393 70.7355 269.153C70.8288 269.193 70.9155 269.273 70.9955 269.393C71.0755 269.513 71.1155 269.66 71.1155 269.833C71.1155 270.1 70.9888 270.387 70.7355 270.693C70.4821 271 70.0955 271.267 69.5755 271.493C69.0555 271.707 68.3955 271.813 67.5955 271.813ZM69.5355 265.313C69.5355 264.607 69.4621 263.987 69.3155 263.453C69.1821 262.92 68.9555 262.507 68.6355 262.213C68.3155 261.92 67.8888 261.773 67.3555 261.773C66.8621 261.773 66.4421 261.913 66.0955 262.193C65.7621 262.46 65.4955 262.853 65.2955 263.373C65.1088 263.893 64.9888 264.54 64.9355 265.313H69.5355Z" fill="url(#paint5_linear_1150_1344)"/>
<path d="M3 271.613V270.773H3.46C3.75333 270.773 4.02 270.747 4.26 270.693C4.51333 270.627 4.71333 270.5 4.86 270.313C5.02 270.113 5.1 269.82 5.1 269.433V258.333H3.18C2.79333 258.333 2.48667 258.413 2.26 258.573C2.03333 258.72 1.86667 258.92 1.76 259.173C1.65333 259.413 1.58 259.68 1.54 259.973L1.44 260.833H0.4L0.5 257.333H11.76L11.86 260.833H10.82L10.72 259.973C10.6933 259.68 10.62 259.413 10.5 259.173C10.3933 258.92 10.2267 258.72 10 258.573C9.77333 258.413 9.46 258.333 9.06 258.333H7.12V269.333C7.12 269.747 7.19333 270.06 7.34 270.273C7.48667 270.473 7.68667 270.607 7.94 270.673C8.19333 270.74 8.46667 270.773 8.76 270.773H9.22V271.613H3ZM12.4256 271.613V270.773H12.4856C12.7256 270.773 12.939 270.733 13.1256 270.653C13.3123 270.573 13.4856 270.447 13.6456 270.273C13.8056 270.087 13.9656 269.853 14.1256 269.573L15.8856 266.533C15.4856 266.453 15.079 266.3 14.6656 266.073C14.2656 265.847 13.9323 265.54 13.6656 265.153C13.399 264.767 13.2656 264.293 13.2656 263.733C13.2656 263.133 13.4056 262.627 13.6856 262.213C13.979 261.787 14.419 261.46 15.0056 261.233C15.6056 261.007 16.3723 260.893 17.3056 260.893H22.9256V261.733H22.8656C22.5723 261.733 22.299 261.767 22.0456 261.833C21.8056 261.887 21.6056 262.013 21.4456 262.213C21.299 262.4 21.2256 262.693 21.2256 263.093V269.433C21.2256 269.82 21.299 270.113 21.4456 270.313C21.6056 270.5 21.8056 270.627 22.0456 270.693C22.299 270.747 22.5723 270.773 22.8656 270.773H23.1256V271.613H17.4456V270.773H17.7056C17.999 270.773 18.2656 270.747 18.5056 270.693C18.759 270.627 18.959 270.5 19.1056 270.313C19.2656 270.113 19.3456 269.82 19.3456 269.433V266.893H17.6856L16.0256 269.993C15.839 270.353 15.619 270.653 15.3656 270.893C15.1256 271.133 14.779 271.313 14.3256 271.433C13.8723 271.553 13.239 271.613 12.4256 271.613ZM17.4056 265.933H19.3456V261.813H17.4056C16.859 261.813 16.4256 261.907 16.1056 262.093C15.7856 262.28 15.5523 262.527 15.4056 262.833C15.2723 263.14 15.2056 263.467 15.2056 263.813C15.2056 264.187 15.2723 264.54 15.4056 264.873C15.5523 265.193 15.7856 265.453 16.1056 265.653C16.439 265.84 16.8723 265.933 17.4056 265.933ZM23.8389 271.613V270.773H24.0989C24.3922 270.773 24.6589 270.747 24.8989 270.693C25.1522 270.627 25.3522 270.5 25.4989 270.313C25.6589 270.113 25.7389 269.82 25.7389 269.433V263.093C25.7389 262.693 25.6589 262.4 25.4989 262.213C25.3522 262.013 25.1522 261.887 24.8989 261.833C24.6589 261.767 24.3922 261.733 24.0989 261.733H23.8389V260.893H29.3189V261.733H29.2589C28.9656 261.733 28.6922 261.767 28.4389 261.833C28.1989 261.887 27.9989 262.007 27.8389 262.193C27.6922 262.38 27.6189 262.673 27.6189 263.073V265.653H32.8989V263.093C32.8989 262.693 32.8189 262.4 32.6589 262.213C32.5122 262.013 32.3122 261.887 32.0589 261.833C31.8189 261.767 31.5522 261.733 31.2589 261.733H31.1989V260.893H36.6789V261.733H36.4189C36.1256 261.733 35.8522 261.767 35.5989 261.833C35.3589 261.887 35.1589 262.007 34.9989 262.193C34.8522 262.38 34.7789 262.673 34.7789 263.073V269.433C34.7789 269.82 34.8522 270.113 34.9989 270.313C35.1589 270.5 35.3589 270.627 35.5989 270.693C35.8522 270.747 36.1256 270.773 36.4189 270.773H36.6789V271.613H31.1989V270.773H31.2589C31.5522 270.773 31.8189 270.747 32.0589 270.693C32.3122 270.627 32.5122 270.5 32.6589 270.313C32.8189 270.113 32.8989 269.82 32.8989 269.433V266.573H27.6189V269.433C27.6189 269.82 27.6922 270.113 27.8389 270.313C27.9989 270.5 28.1989 270.627 28.4389 270.693C28.6922 270.747 28.9656 270.773 29.2589 270.773H29.3189V271.613H23.8389ZM37.6084 271.613V270.773H37.8684C38.1618 270.773 38.4284 270.747 38.6684 270.693C38.9218 270.627 39.1218 270.5 39.2684 270.313C39.4284 270.113 39.5084 269.82 39.5084 269.433V263.093C39.5084 262.693 39.4284 262.4 39.2684 262.213C39.1218 262.013 38.9218 261.887 38.6684 261.833C38.4284 261.767 38.1618 261.733 37.8684 261.733H37.6084V260.893H43.2884V261.733H43.0284C42.7351 261.733 42.4618 261.767 42.2084 261.833C41.9684 261.887 41.7684 262.007 41.6084 262.193C41.4618 262.38 41.3884 262.673 41.3884 263.073V268.073L46.6684 263.153V263.093C46.6684 262.693 46.5884 262.4 46.4284 262.213C46.2818 262.013 46.0818 261.887 45.8284 261.833C45.5884 261.767 45.3218 261.733 45.0284 261.733H44.9684V260.893H50.4484V261.733H50.1884C49.8951 261.733 49.6218 261.767 49.3684 261.833C49.1284 261.887 48.9284 262.007 48.7684 262.193C48.6218 262.38 48.5484 262.673 48.5484 263.073V269.433C48.5484 269.82 48.6218 270.113 48.7684 270.313C48.9284 270.5 49.1284 270.627 49.3684 270.693C49.6218 270.747 49.8951 270.773 50.1884 270.773H50.4484V271.613H44.7684V270.773H45.0284C45.3218 270.773 45.5884 270.747 45.8284 270.693C46.0818 270.627 46.2818 270.5 46.4284 270.313C46.5884 270.113 46.6684 269.82 46.6684 269.433V264.453L41.3884 269.333V269.433C41.3884 269.82 41.4618 270.113 41.6084 270.313C41.7684 270.5 41.9684 270.627 42.2084 270.693C42.4618 270.747 42.7351 270.773 43.0284 270.773H43.2884V271.613H37.6084ZM53.558 271.613V270.773H53.818C54.1113 270.773 54.378 270.747 54.618 270.693C54.8713 270.627 55.0713 270.5 55.218 270.313C55.378 270.113 55.458 269.82 55.458 269.433V261.813H53.798C53.4913 261.813 53.2446 261.86 53.058 261.953C52.8846 262.047 52.7446 262.213 52.638 262.453C52.5446 262.68 52.4646 263.007 52.398 263.433L52.298 264.093H51.318L51.438 260.893H61.338L61.458 264.093H60.478L60.378 263.433C60.3113 263.007 60.2246 262.68 60.118 262.453C60.0246 262.213 59.8846 262.047 59.698 261.953C59.5246 261.86 59.2846 261.813 58.978 261.813H57.338V269.433C57.338 269.82 57.4113 270.113 57.558 270.313C57.718 270.5 57.918 270.627 58.158 270.693C58.4113 270.747 58.6846 270.773 58.978 270.773H59.438V271.613H53.558ZM67.5955 271.813C66.1421 271.813 65.0021 271.333 64.1755 270.373C63.3621 269.413 62.9555 268.067 62.9555 266.333C62.9555 264.467 63.3421 263.06 64.1155 262.113C64.8888 261.167 65.9821 260.693 67.3955 260.693C68.6888 260.693 69.7021 261.093 70.4355 261.893C71.1821 262.693 71.5555 263.887 71.5555 265.473V266.393H64.8955C64.9221 267.367 65.0488 268.16 65.2755 268.773C65.5021 269.387 65.8288 269.84 66.2555 270.133C66.6955 270.413 67.2355 270.553 67.8755 270.553C68.3421 270.553 68.7555 270.487 69.1155 270.353C69.4888 270.22 69.8088 270.047 70.0755 269.833C70.3555 269.62 70.5755 269.393 70.7355 269.153C70.8288 269.193 70.9155 269.273 70.9955 269.393C71.0755 269.513 71.1155 269.66 71.1155 269.833C71.1155 270.1 70.9888 270.387 70.7355 270.693C70.4821 271 70.0955 271.267 69.5755 271.493C69.0555 271.707 68.3955 271.813 67.5955 271.813ZM69.5355 265.313C69.5355 264.607 69.4621 263.987 69.3155 263.453C69.1821 262.92 68.9555 262.507 68.6355 262.213C68.3155 261.92 67.8888 261.773 67.3555 261.773C66.8621 261.773 66.4421 261.913 66.0955 262.193C65.7621 262.46 65.4955 262.853 65.2955 263.373C65.1088 263.893 64.9888 264.54 64.9355 265.313H69.5355Z" fill="white" fill-opacity="0.3"/>
<defs>
<linearGradient id="paint0_linear_1150_1344" x1="68.6785" y1="183.462" x2="23.4129" y2="37.0887" gradientUnits="userSpaceOnUse">
<stop stop-color="#C7AA7F"/>
<stop offset="0.211538" stop-color="#785C32"/>
<stop offset="0.514423" stop-color="#D9AF72"/>
<stop offset="0.75" stop-color="#9C8460"/>
<stop offset="0.870192" stop-color="#F8F4EE"/>
</linearGradient>
<linearGradient id="paint1_linear_1150_1344" x1="4.96884" y1="64.1752" x2="56.5497" y2="210.884" gradientUnits="userSpaceOnUse">
<stop stop-color="#C7AA7F"/>
<stop offset="0.211538" stop-color="#785C32"/>
<stop offset="0.514423" stop-color="#D9AF72"/>
<stop offset="0.75" stop-color="#9C8460"/>
<stop offset="0.870192" stop-color="#F8F4EE"/>
</linearGradient>
<linearGradient id="paint2_linear_1150_1344" x1="69.654" y1="186.54" x2="20.5418" y2="39.3626" gradientUnits="userSpaceOnUse">
<stop stop-color="#C7AA7F"/>
<stop offset="0.211538" stop-color="#785C32"/>
<stop offset="0.514423" stop-color="#D9AF72"/>
<stop offset="0.75" stop-color="#9C8460"/>
<stop offset="0.870192" stop-color="#F8F4EE"/>
</linearGradient>
<linearGradient id="paint3_linear_1150_1344" x1="3.15386" y1="63.1478" x2="53.5389" y2="210.798" gradientUnits="userSpaceOnUse">
<stop stop-color="#C7AA7F"/>
<stop offset="0.211538" stop-color="#785C32"/>
<stop offset="0.514423" stop-color="#D9AF72"/>
<stop offset="0.75" stop-color="#9C8460"/>
<stop offset="0.870192" stop-color="#F8F4EE"/>
</linearGradient>
<linearGradient id="paint4_linear_1150_1344" x1="63.3403" y1="249.557" x2="-76.6684" y2="30.3974" gradientUnits="userSpaceOnUse">
<stop stop-color="#C7AA7F"/>
<stop offset="0.211538" stop-color="#785C32"/>
<stop offset="0.514423" stop-color="#D9AF72"/>
<stop offset="0.75" stop-color="#9C8460"/>
<stop offset="0.870192" stop-color="#F8F4EE"/>
</linearGradient>
<linearGradient id="paint5_linear_1150_1344" x1="70.7904" y1="239.691" x2="-23.1486" y2="260.614" gradientUnits="userSpaceOnUse">
<stop stop-color="#C7AA7F"/>
<stop offset="0.211538" stop-color="#785C32"/>
<stop offset="0.514423" stop-color="#D9AF72"/>
<stop offset="0.75" stop-color="#9C8460"/>
<stop offset="0.870192" stop-color="#F8F4EE"/>
</linearGradient>
</defs>
</svg>
`;
    
    // Полоса для заполнения
    const fillRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    fillRect.classList.add('naym-fill');
    fillRect.setAttribute('x', '0');
    fillRect.setAttribute('y', '0');
    fillRect.setAttribute('width', '73');
    fillRect.setAttribute('height', '0');
    fillRect.setAttribute('fill', '#515866');
    fillRect.setAttribute('clip-path', 'url(#hexagonClipVertical)');
    fillRect.style.transition = 'height 0.05s linear';
    
    // Добавляем clip-path
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clipPath.setAttribute('id', 'hexagonClipVertical');
    clipPath.innerHTML = '<path d="M53.8262 22.7199L53.8262 229.543L36.3326 250.125L18.839 229.543L18.839 22.7199L36.3326 1.61328L53.8262 22.7199Z"/>';
    defs.appendChild(clipPath);
    scaleSvg.appendChild(defs);
    scaleSvg.appendChild(fillRect);
    
    scaleContainer.appendChild(scaleSvg);
    container.appendChild(scaleContainer);
    
    // ========== ПАРАМЕТРЫ ШКАЛЫ ==========
    const minHandleY = 32;      // минимальное положение кружка (верх)
    const maxHandleY = 220;     // максимальное положение кружка (низ)
    const handleHeight = 35;
    const handleRadius = handleHeight / 2; // 17.5
    
    // ========== КРУГ ДЛЯ ПЕРЕТАСКИВАНИЯ ==========
    const handle = document.createElement('div');
    handle.className = 'naym-handle';
    handle.style.touchAction = 'none';
    scaleContainer.appendChild(handle);

    // ========== ОБРАБОТЧИКИ ДЛЯ ТЕЛЕФОНА ==========
handle.addEventListener('touchstart', (e) => {
    if (isLightningPlaying) return;
    e.preventDefault();
    e.stopPropagation();
    
    isDragging = true;
    handle.style.cursor = 'grabbing';
    
    const currentTop = parseFloat(handle.style.top);
    startY = e.touches[0].clientY;
    startTop = isNaN(currentTop) ? 0 : currentTop;
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging || isLightningPlaying) return;
    e.preventDefault();
    
    const deltaY = e.touches[0].clientY - startY;
    let newTop = startTop + deltaY;
    
    const containerHeight = scaleContainer.clientHeight;
    const scale = containerHeight / 278;
    const minTop = (minHandleY - handleRadius) * scale;
    const maxTop = (maxHandleY - handleRadius) * scale;
    
    if (newTop < minTop) newTop = minTop;
    newTop = Math.max(minTop, Math.min(newTop, maxTop));
    
    updateProgressFromTop(newTop);
}, { passive: false });

document.addEventListener('touchend', () => {
    isDragging = false;
    handle.style.cursor = 'grab';
});
    
    // ========== ЛОГИКА ПЕРЕТАСКИВАНИЯ ==========
    let isDragging = false;
    let currentProgress = 0;
    let isLightningPlaying = false;
    let startY = 0;
    let startTop = 0;
    
    // Получаем прогресс из позиции кружка
    function getProgressFromTop(top) {
        const containerHeight = scaleContainer.clientHeight;
        const scale = containerHeight / 278;
        
        const hexY = (top / scale) + handleRadius;
        let progress = ((hexY - minHandleY) / (maxHandleY - minHandleY)) * 100;
        progress = Math.max(0, Math.min(100, progress));
        return progress;
    }
    
    function updateProgressFromTop(top) {
        const containerHeight = scaleContainer.clientHeight;
        const scale = containerHeight / 278;
        
        // Ограничиваем top в допустимых пределах
        const minTop = (minHandleY - handleRadius) * scale;
        const maxTop = (maxHandleY - handleRadius) * scale;
        let newTop = Math.max(minTop, Math.min(top, maxTop));
        
        // Если пытаемся двигать вверх от начальной позиции - блокируем
        const initialTop = (minHandleY - handleRadius) * scale;
        if (newTop < initialTop) {
            newTop = initialTop;
        }
        
        handle.style.top = `${newTop}px`;
        
        // Вычисляем прогресс
        const hexY = (newTop / scale) + handleRadius;
        let progress = ((hexY - minHandleY) / (maxHandleY - minHandleY)) * 100;
        progress = Math.max(0, Math.min(100, progress));
        currentProgress = progress;
        
        // Обновляем заливку шкалы
        const fillHeightPx = (progress / 100) * (maxHandleY - minHandleY);
        const fillHeight = (fillHeightPx / 200) * containerHeight;
        fillRect.setAttribute('height', `${fillHeight}px`);
        
        // Если достигли нижней точки
        if (currentProgress >= 99 && !isLightningPlaying && spineCharacter) {
            triggerLightning();
        }
    }
    
    function triggerLightning() {
        if (!spineCharacter) return;
        
        isLightningPlaying = true;
        fillRect.setAttribute('fill', '#8F9CAE');
        handle.classList.add('disabled');  // ← добавляем класс
        handle.style.cursor = 'not-allowed';
        
        spineCharacter.state.setAnimation(0, "lighthing", false);
    }
    
    function resetProgress() {
        currentProgress = 0;
        const containerHeight = scaleContainer.clientHeight;
        const scale = containerHeight / 278;
        const startTop = (minHandleY - handleRadius) * scale;
        handle.style.top = `${startTop}px`;
        handle.style.cursor = 'grab';
        handle.classList.remove('disabled');  // ← убираем класс
        handle.style.borderColor = 'var(--lipa)';
        fillRect.setAttribute('fill', '#515866');
        fillRect.setAttribute('height', '0');
    }
    
    // Обработчики мыши - только при зажатой кнопке
    function onMouseMove(e) {
        if (!isDragging || isLightningPlaying) return;
        
        const deltaY = e.clientY - startY;
        let newTop = startTop + deltaY;
        
        const containerHeight = scaleContainer.clientHeight;
        const scale = containerHeight / 278;
        const minTop = (minHandleY - handleRadius) * scale;
        const maxTop = (maxHandleY - handleRadius) * scale;
        
        // Ограничиваем движение только вниз от начальной позиции
        if (newTop < minTop) {
            newTop = minTop;
        }
        newTop = Math.max(minTop, Math.min(newTop, maxTop));
        
        updateProgressFromTop(newTop);
    }
    
    function onMouseUp() {
        isDragging = false;
        handle.style.cursor = 'grab';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
    
    handle.addEventListener('mousedown', (e) => {
        if (isLightningPlaying) return;
        e.preventDefault();
        e.stopPropagation();
        
        isDragging = true;
        handle.style.cursor = 'grabbing';
        
        // Сохраняем начальную позицию
        const currentTop = parseFloat(handle.style.top);
        startY = e.clientY;
        startTop = isNaN(currentTop) ? 0 : currentTop;
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
    
    // Устанавливаем начальное положение (вверху)
    setTimeout(() => {
        const containerHeight = scaleContainer.clientHeight;
        const scale = containerHeight / 278;
        const startTop = (minHandleY - handleRadius) * scale;
        handle.style.top = `${startTop}px`;
    }, 100);
    
    // ========== SPINE АНИМАЦИЯ ==========
    function initApp() {
        const containerWidth = container.clientWidth;
        const containerHeight = 300;
        
        app = new PIXI.Application({
            width: containerWidth,
            height: containerHeight,
            backgroundAlpha: 0,
            antialias: false,        // ОТКЛЮЧИ сглаживание (самое важное!)
            resolution: window.devicePixelRatio || 1,           // Не используй retina-разрешение
            autoDensity: true,      // Отключи авто-плотность
            powerPreference: "high-performance"  // Запрос высокой производительности
        });
        
        container.appendChild(app.view);
        
        const canvas = app.view;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.display = 'block';
        canvas.style.pointerEvents = 'none';
        canvas.style.touchAction = 'all'; // ← ДОБАВЬ ЭТУ СТРОКУ - разрешаем скролл
        canvas.style.cursor = 'default';    // ← меняем курсор
        canvas.style.userSelect = 'none';   // ← запрещаем выделение
    }
    
    function updateSizeAndPosition() {
        if (!spineCharacter || !originalBounds) return;
        
        const containerWidth = container.clientWidth;
        const scale = containerWidth / originalBounds.width;
        const scaledHeight = originalBounds.height * scale;
        
        const newHeight = Math.max(scaledHeight + 40, 500);
        container.style.minHeight = `${newHeight}px`;
        
        app.renderer.resize(containerWidth, newHeight);
        
        spineCharacter.scale.set(scale);
        
        const scaledWidth = originalBounds.width * scale;
        spineCharacter.x = (app.screen.width - scaledWidth) / 2 - originalBounds.x * scale;
        spineCharacter.y = (app.screen.height - scaledHeight) / 2 - originalBounds.y * scale;
        
        // Обновляем позицию кружка
        const containerHeight = scaleContainer.clientHeight;
        const scaleFactor = containerHeight / 278;
        const startTop = (minHandleY - handleRadius) * scaleFactor;
        handle.style.top = `${startTop}px`;
        
        if (currentProgress > 0) {
            const fillHeightPx = (currentProgress / 100) * (maxHandleY - minHandleY);
            const fillHeight = (fillHeightPx / 278) * containerHeight;
            fillRect.setAttribute('height', `${fillHeight}px`);
        }
    }
    
    function resize() {
        updateSizeAndPosition();
    }
    
    window.addEventListener('resize', resize);
    initApp();
    
    app.loader
        .add("spine", "assets/animations/nayn/sceleton.json")
        .load((loader, resources) => {
            spineCharacter = new PIXI.spine.Spine(resources.spine.spineData);
            window.naymSpine = spineCharacter;
            
            setTimeout(() => {
                const bounds = spineCharacter.getBounds();
                originalBounds = {
                    width: bounds.width,
                    height: bounds.height,
                    x: bounds.x,
                    y: bounds.y
                };
                
                console.log('Naym animation bounds:', originalBounds);
                
                updateSizeAndPosition();
                app.stage.addChild(spineCharacter);
                
                spineCharacter.state.data.setMix("idle", "lighthing", 0.3);
                spineCharacter.state.data.setMix("lighthing", "idle", 0.3);
                
                spineCharacter.state.addListener({
                    complete: (entry) => {
                        if (entry.animation.name === "lighthing" && isLightningPlaying) {
                            isLightningPlaying = false;
                            spineCharacter.state.setAnimation(0, "idle", true);
                            resetProgress();
                        }
                    }
                });
                
                spineCharacter.state.setAnimation(0, "idle", true);
            }, 100);
        });
    
    return { app, container };
}

export function removeNaymAnimation() {
    const container = document.querySelector('.animation_nayn');
    if (container) {
        container.innerHTML = '';
        container.style.minHeight = '';
    }
    window.naymSpine = null;
}