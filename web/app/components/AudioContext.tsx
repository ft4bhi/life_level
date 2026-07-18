"use client";

import React, { 
  createContext, 
  useContext, 
  useState, 
  useRef, 
  useEffect, 
  useCallback,
  ReactNode 
} from 'react';

// Define the shape of the context's value
interface AudioContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  fadeToMute: (duration: number) => void;
  fadeToVolume: (targetVolume: number, duration: number) => void;
}

// Create the context
const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Props for the provider component
interface AudioProviderProps {
  children: ReactNode;
  audioSrc: string;
}

/**
 * Manages and provides global audio playback controls.
 */
export const AudioProvider: React.FC<AudioProviderProps> = ({ children, audioSrc }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Function to initialize and play audio, designed to be called after user interaction
  const initializeAndPlay = useCallback(() => {
    if (audioRef.current && !isInitialized) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsInitialized(true);
        // Remove the event listeners once audio has started successfully
        document.removeEventListener('click', initializeAndPlay);
        document.removeEventListener('keydown', initializeAndPlay);
      }).catch(error => {
        // Autoplay was prevented. The user needs to interact with the page first.
        console.warn("Autoplay was prevented by the browser. Please click or interact with the page.");
      });
    }
  }, [isInitialized]);

  useEffect(() => {
    // Create a single Audio instance
    if (!audioRef.current) {
      audioRef.current = new Audio(audioSrc);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5; // Start at a reasonable volume
    }

    // Add event listeners to handle autoplay restrictions
    document.addEventListener('click', initializeAndPlay);
    document.addEventListener('keydown', initializeAndPlay);

    const audio = audioRef.current;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Cleanup function
    return () => {
      // Clear any active fade interval
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      
      // Pause audio and remove listeners
      audio.pause();
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      document.removeEventListener('click', initializeAndPlay);
      document.removeEventListener('keydown', initializeAndPlay);

      // In a real SPA you might want to nullify the ref, but in Next.js App Router,
      // the layout unmounts less predictably. We rely on the single instance nature.
    };
  }, [audioSrc, initializeAndPlay]);
  
  const clearFadeInterval = () => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
         console.warn("Playback failed. User may need to interact with the document first.");
      });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      clearFadeInterval();
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  const fadeToVolume = useCallback((targetVolume: number, duration: number) => {
    if (!audioRef.current) return;
    clearFadeInterval();

    const audio = audioRef.current;
    const startVolume = audio.volume;
    const volumeChange = targetVolume - startVolume;
    if (volumeChange === 0) return;

    const stepTime = 50; // ms per step
    const steps = duration / stepTime;
    const stepSize = volumeChange / steps;

    fadeIntervalRef.current = setInterval(() => {
      const newVolume = audio.volume + stepSize;
      if ((stepSize > 0 && newVolume >= targetVolume) || (stepSize < 0 && newVolume <= targetVolume)) {
        audio.volume = targetVolume;
        if (targetVolume === 0) {
          audio.pause();
        }
        clearFadeInterval();
      } else {
        audio.volume = newVolume;
      }
    }, stepTime);
  }, []);
  
  const fadeToMute = useCallback((duration: number) => {
    fadeToVolume(0, duration);
  }, [fadeToVolume]);

  const value: AudioContextType = {
    isPlaying,
    togglePlay,
    setVolume,
    fadeToMute,
    fadeToVolume
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

/**
 * Custom hook to use the AudioContext.
 */
export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
