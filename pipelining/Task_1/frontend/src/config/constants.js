export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'OSI Layer Simulator';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '2.0.0';

export const ANIMATION_SPEEDS = {
  SLOW: 0.5,
  NORMAL: 1,
  FAST: 1.5,
  ULTRA: 2
};

export const SIMULATION_PHASES = {
  IDLE: 'idle',
  ENCAPSULATION: 'encapsulation',
  TRANSMISSION: 'transmission',
  DECAPSULATION: 'decapsulation',
  COMPLETE: 'complete',
  ERROR: 'error'
};

export const LAYER_COLORS = {
  7: '#ef4444',
  6: '#f97316',
  5: '#eab308',
  4: '#22c55e',
  3: '#3b82f6',
  2: '#8b5cf6',
  1: '#ec4899'
};
