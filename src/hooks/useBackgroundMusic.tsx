import { useEffect, useRef, useState, useCallback } from "react";
import { Howl } from "howler";

/**
 * useBackgroundMusic
 *
 * Plays a looping background track. Call mute/unmute to silence it.
 *
 * @param {string|string[]} src - Audio file URL(s).
 * @param {number} [volume=0.5] - Playback volume (0.0 – 1.0).
 *
 * @returns {{ mute: () => void, unmute: () => void, isMuted: boolean }}
 */
export function useBackgroundMusic(src, volume = 0.5) {
  const howlRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const sound = new Howl({
      src: Array.isArray(src) ? src : [src],
      loop: true,
      volume,
      autoplay: true,
    });

    howlRef.current = sound;

    return () => {
      sound.unload();
    };
  }, [Array.isArray(src) ? src.join(",") : src]); // eslint-disable-line react-hooks/exhaustive-deps

  const mute = useCallback(() => {
    howlRef.current?.mute(true);
    setIsMuted(true);
  }, []);

  const unmute = useCallback(() => {
    howlRef.current?.mute(false);
    setIsMuted(false);
  }, []);

  return { mute, unmute, isMuted };
}