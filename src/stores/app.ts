import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";

export const [showSceneSelector, setShowSceneSelector] = createSignal(false);
export const [showAudioMixer, setShowAudioMixer] = createSignal(false);
export const [showPomodoro, setShowPomodoro] = createSignal(false);
export const [showTemplates, setShowTemplates] = createSignal(false);

// Window positions store
export interface WindowPosition { x: number; y: number }
export const [windowPositions, setWindowPositions] = createStore<Record<string, WindowPosition>>({});

export type MusicSource = "lofi" | "lofigirl" | "chillhop";
export const [musicSource, setMusicSource] = createSignal<MusicSource>("lofi");

// YouTube iframe reference for external play/pause control
export const [youtubeIframe, setYoutubeIframe] = createSignal<HTMLIFrameElement | null>(null);
export const [youtubeIsPlaying, setYoutubeIsPlaying] = createSignal(false);

export const youtubeControls = {
  play: () => {
    const iframe = youtubeIframe();
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      setYoutubeIsPlaying(true);
    }
  },
  pause: () => {
    const iframe = youtubeIframe();
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      setYoutubeIsPlaying(false);
    }
  },
  toggle: () => {
    youtubeIsPlaying() ? youtubeControls.pause() : youtubeControls.play();
  }
};
