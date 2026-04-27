import { useEffect, useRef } from "react";
import { Howl } from "howler";

export const useSoundFX = (soundSrc: string, volume?: number) => {
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: [soundSrc],
      volume: volume ?? 0.5,
    });

    return () => {
      soundRef.current?.unload();
    };
  }, [soundSrc]);

  const playSound = () => {
    soundRef.current?.play();
  };

  return { playSound };
};