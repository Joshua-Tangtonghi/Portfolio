import { Application } from '@splinetool/runtime';

const canvas = document.getElementById('canvas3d');
const sceneUrl = 'https://prod.spline.design/UNiM9nOdJcPlcO2S/scene.splinecode';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmallScreen = window.matchMedia('(max-width: 767px)').matches;
let app = null;
let loadPromise = null;

const setPixelRatio = () => {
  const ratio = Math.min(window.devicePixelRatio || 1, isSmallScreen ? 1.5 : 2);
  if (app?.renderer?.setPixelRatio) app.renderer.setPixelRatio(ratio);
};

const loadScene = () => {
  if (!canvas) return Promise.reject(new Error('Canvas Spline introuvable.'));
  if (loadPromise) return loadPromise;

  app = new Application(canvas);
  loadPromise = app.load(sceneUrl).then(() => {
    setPixelRatio();
    window.dispatchEvent(new CustomEvent('spline-ready'));
    return app;
  }).catch((error) => {
    loadPromise = null;
    window.dispatchEvent(new CustomEvent('spline-error', { detail: error }));
    throw error;
  });
  return loadPromise;
};

const pauseScene = () => {
  if (typeof app?.pause === 'function') app.pause();
};

const resumeScene = () => {
  if (typeof app?.resume === 'function') app.resume();
};

const resetScene = () => {
  if (typeof app?.stop === 'function') app.stop();
  app = null;
  loadPromise = null;
  return loadScene();
};

window.portfolioSpline = { loadScene, pauseScene, resumeScene, resetScene };

if (canvas && !reducedMotion && !isSmallScreen) loadScene();
