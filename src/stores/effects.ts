import { createSignal } from "solid-js";
import { type EffectType, effects as sources } from "../data/audio.data";
import { createEffect, createRoot } from "solid-js";
import { makeAudio } from "@solid-primitives/audio";

type EffectsVolumeStore = Record<EffectType, number>;

const effects = createRoot(() => {
  const [volume, setVolume] = createSignal<EffectsVolumeStore>({
    birds: 0,
    city: 0,
    fan: 0,
    forest: 0,
    rain_forest: 0,
    rain_street: 0,
    river: 0,
    storm: 0,
    waves: 0,
    people: 0,
    brown_noise: 0,
    pink_noise: 0,
    white_noise: 0,
    thunders: 0,
    keyboard: 0,
    space: 0,
    underwater: 0,
    fireplace: 0,
    ocean: 0,
    wind: 0,
    plane: 0,
    train_noise: 0,
    window_rain: 0,
    snow: 0,
    fire: 0
  });

  const audios = new Map<EffectType, HTMLAudioElement>();
  const pendingPlay = new Set<EffectType>();

  // Resume any effects that failed to play due to autoplay policy
  const resumePending = () => {
    if (pendingPlay.size === 0) return;
    for (const effect of pendingPlay) {
      const audioElement = audios.get(effect);
      if (audioElement && audioElement.volume > 0) {
        audioElement.play().then(() => {
          pendingPlay.delete(effect);
        }).catch(() => {});
      }
    }
    if (pendingPlay.size === 0) {
      document.removeEventListener("pointerdown", resumePending);
      document.removeEventListener("keydown", resumePending);
    }
  };

  createEffect(() => {
    const volumes = volume();
    for (const effect of Object.keys(volumes) as EffectType[]) {
      if (volumes[effect] > 0) {
        let audioElement: HTMLAudioElement;

        if (!audios.has(effect)) {
          const source = sources.find((source) => source.type === effect);
          if (!source) {
            console.error("Could not find source for effect", effect);
            continue;
          }

          audioElement = makeAudio(source.url);
          audios.set(effect, audioElement);
        }
        else {
          audioElement = audios.get(effect)!;
        }

        audioElement.volume = volumes[effect];
        audioElement.loop = true;
        audioElement.play().catch(() => {
          // Autoplay blocked — queue for resume on user interaction
          pendingPlay.add(effect);
          document.addEventListener("pointerdown", resumePending, { once: false });
          document.addEventListener("keydown", resumePending, { once: false });
        });
      }
      else if (volumes[effect] === 0) {
        const audioElement = audios.get(effect);

        if (audioElement) {
          audioElement.pause();
          audioElement.volume = 0;
        }
        pendingPlay.delete(effect);
      }
    }
  })

  const defaultVolumes: EffectsVolumeStore = {
    birds: 0, city: 0, fan: 0, forest: 0, rain_forest: 0, rain_street: 0,
    river: 0, storm: 0, waves: 0, people: 0, brown_noise: 0, pink_noise: 0,
    white_noise: 0, thunders: 0, keyboard: 0, space: 0, underwater: 0,
    fireplace: 0, ocean: 0, wind: 0, plane: 0, train_noise: 0,
    window_rain: 0, snow: 0, fire: 0
  };

  const resetAll = () => setVolume({ ...defaultVolumes });

  return {
    volume,
    setVolume,
    resetAll
  };
});

export default effects;
