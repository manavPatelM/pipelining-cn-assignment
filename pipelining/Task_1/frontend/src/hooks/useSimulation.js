import { useState, useRef, useEffect } from 'react';
import { SIMULATION_PHASES } from '../config/constants';

export const useSimulation = () => {
  const [phase, setPhase] = useState(SIMULATION_PHASES.IDLE);
  const [currentLayer, setCurrentLayer] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [startTime, setStartTime] = useState(null);
  
  const isPausedRef = useRef(false);
  const speedRef = useRef(1);
  
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);
  
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const wait = async (duration) => {
    let elapsed = 0;
    const interval = 50;
    
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!isPausedRef.current) {
          elapsed += interval;
          const adjustedDuration = duration / speedRef.current;
          if (elapsed >= adjustedDuration) {
            clearInterval(checkInterval);
            resolve();
          }
        }
      }, interval);
    });
  };

  const reset = () => {
    setPhase(SIMULATION_PHASES.IDLE);
    setCurrentLayer(null);
    setIsPaused(false);
    setSpeed(1);
    setStartTime(null);
  };

  return {
    phase,
    setPhase,
    currentLayer,
    setCurrentLayer,
    isPaused,
    setIsPaused,
    speed,
    setSpeed,
    startTime,
    setStartTime,
    wait,
    reset
  };
};
