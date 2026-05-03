import { initCover } from './index.js';
import { initMap } from './map.js';

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  if (page === 'index') {
    initCover();
  }
  
  if (page === 'map') {
    initMap();
  }
});