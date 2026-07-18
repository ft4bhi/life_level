"use client";

import { useEffect } from 'react';
import { useAudio } from '../components/AudioContext';
import { Play, Pause, VolumeX, Volume2, Music } from 'lucide-react';

/**
 * An example page that fades out background music upon entry.
 */
export default function VideoPage() {
  const { isPlaying, togglePlay, fadeToMute, fadeToVolume } = useAudio();

  // On entering this page, fade the music out over 1.5 seconds.
  // On leaving, fade it back in.
  useEffect(() => {
    console.log("Video page mounted. Fading music out.");
    fadeToMute(1500);

    return () => {
      console.log("Leaving video page. Fading music back in.");
      // NOTE: You might want to restore to a user-defined volume later
      fadeToVolume(0.5, 1500); 
    };
  }, [fadeToMute, fadeToVolume]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center text-center p-4">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-amber-300">
          A Quiet Zone
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          The background music has been faded out on this page. When you navigate away,
          it will automatically fade back in.
        </p>

        <div className="mt-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
          <h2 className="text-lg font-semibold text-white flex items-center justify-center gap-2">
            <Music size={20} />
            Manual Audio Controls
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            You can still control the audio from here.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={togglePlay}
              className="px-4 py-2 flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition-colors"
              aria-label={isPlaying ? "Pause audio" : "Play audio"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={() => fadeToMute(500)}
              className="px-4 py-2 flex items-center gap-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors"
              aria-label="Mute audio"
            >
              <VolumeX size={18} /> Mute
            </button>
            <button
              onClick={() => fadeToVolume(0.5, 500)}
              className="px-4 py-2 flex items-center gap-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors"
               aria-label="Set volume to 50%"
            >
              <Volume2 size={18} /> Set to 50%
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
