import { createEffect, createRoot, untrack } from "solid-js";
import { scenes } from "../data/scene.data";
import { EffectType } from "../data/audio.data";
import { currentScene, setCurrentScene, night, setNight, pixelated, setPixelated } from "./scene";
import {
  musicSource, setMusicSource, type MusicSource,
  showAudioMixer, setShowAudioMixer,
  showPomodoro, setShowPomodoro,
  showTemplates, setShowTemplates,
  windowPositions, setWindowPositions, type WindowPosition,
} from "./app";
import player from "./player";
import effects from "./effects";

const STORAGE_KEY = "lofi-session";

interface SessionSnapshot {
  sceneKey: string;
  night: boolean;
  pixelated: boolean;
  musicSource: MusicSource;
  mood: string;
  volume: number;
  effects: Record<string, number>;
  widgets: {
    mixer: boolean;
    pomodoro: boolean;
    templates: boolean;
  };
  windowPositions: Record<string, WindowPosition>;
}

const findSceneKey = (scene: typeof scenes[string]): string => {
  for (const [key, value] of Object.entries(scenes)) {
    if (value === scene) return key;
  }
  return "cozyStudio";
};

const captureSnapshot = (): SessionSnapshot => ({
  sceneKey: findSceneKey(currentScene()),
  night: night(),
  pixelated: pixelated(),
  musicSource: musicSource(),
  mood: player.mood(),
  volume: player.audio.volume,
  effects: { ...effects.volume() },
  widgets: {
    mixer: showAudioMixer(),
    pomodoro: showPomodoro(),
    templates: showTemplates(),
  },
  windowPositions: { ...windowPositions },
});

const restoreSnapshot = (snapshot: SessionSnapshot) => {
  // Scene
  if (snapshot.sceneKey && scenes[snapshot.sceneKey]) {
    setCurrentScene(scenes[snapshot.sceneKey]);
  }

  // Visual
  setNight(snapshot.night ?? false);
  setPixelated(snapshot.pixelated ?? false);

  // Music source & mood
  if (snapshot.musicSource) setMusicSource(snapshot.musicSource);
  if (snapshot.mood) {
    if (snapshot.musicSource === "lofi") {
      player.controls.setMood(snapshot.mood as "chill" | "jazzy" | "sleepy");
    } else {
      player.controls.setMoodSilent(snapshot.mood as "chill" | "jazzy" | "sleepy");
    }
  }

  // Volume
  if (snapshot.volume !== undefined) {
    player.controls.setVolume(snapshot.volume);
  }

  // Effects — reset all first, then apply snapshot values
  effects.resetAll();
  if (snapshot.effects) {
    effects.setVolume(snapshot.effects as Record<EffectType, number>);
  }

  // Widgets
  if (snapshot.widgets) {
    setShowAudioMixer(snapshot.widgets.mixer ?? false);
    setShowPomodoro(snapshot.widgets.pomodoro ?? false);
    setShowTemplates(snapshot.widgets.templates ?? false);
  }

  // Window positions
  if (snapshot.windowPositions) {
    for (const [id, pos] of Object.entries(snapshot.windowPositions)) {
      setWindowPositions(id, pos);
    }
  }
};

createRoot(() => {
  // Restore on boot
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      restoreSnapshot(JSON.parse(stored));
    }
  } catch (e) {
    console.warn("Failed to restore session:", e);
  }

  // Auto-save: track specific signals, then untrack the actual save
  createEffect(() => {
    // Touch reactive sources to subscribe
    currentScene();
    night();
    pixelated();
    musicSource();
    player.mood();
    player.audio.volume;
    effects.volume();
    showAudioMixer();
    showPomodoro();
    showTemplates();

    // Capture and save without creating further subscriptions
    untrack(() => {
      const snapshot = captureSnapshot();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    });
  });

  // Save window positions separately (debounced to avoid tight loops)
  let posTimer: number | null = null;
  createEffect(() => {
    // Track the store
    void ({ ...windowPositions });
    if (posTimer) clearTimeout(posTimer);
    posTimer = window.setTimeout(() => {
      untrack(() => {
        const snapshot = captureSnapshot();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      });
    }, 500);
  });
});

export { captureSnapshot, restoreSnapshot, type SessionSnapshot };
