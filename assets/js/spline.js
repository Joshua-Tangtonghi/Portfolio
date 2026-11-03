import { Application } from '@splinetool/runtime';

const canvas = document.getElementById('canvas3d');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmallScreen = window.matchMedia('(max-width: 767px)').matches;

if (canvas && !reducedMotion && !isSmallScreen) {
  const app = new Application(canvas);
  app.load('https://prod.spline.design/UNiM9nOdJcPlcO2S/scene.splinecode');
}
