import { Show, type Component, onMount, onCleanup } from "solid-js";
import { AudioState } from "@solid-primitives/audio";

import {
  showSceneSelector, setShowSceneSelector,
  showAudioMixer, setShowAudioMixer,
  showPomodoro, setShowPomodoro,
  showTemplates, setShowTemplates,
} from "./stores/app";
import "./stores/session";
import player from "./stores/player";
// import AudioPlayer from "./views/core/AudioMixer/AudioPlayer";
// import EffectPlayer from "./views/core/AudioMixer/EffectPlayer";
import ActiveScene from "./views/core/ActiveScene/ActiveScene";
import ScenePicker from "./views/core/ScenePicker/ScenePicker";
import ToolBar from "./views/core/ToolBar/ToolBar";
import AudioMixer from "./views/core/AudioMixer/AudioMixer";
import Pomodoro from "./components/Pomodoro";
import Templates from "./components/Templates";

/**
 * Main entry point for the application.
 */
const App: Component = () => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Ignore when typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    switch (e.key) {
      case " ":
        e.preventDefault();
        player.audio.state === AudioState.PLAYING ? player.controls.pause() : player.controls.play();
        break;
      case "ArrowLeft":
        player.previousTrack();
        break;
      case "ArrowRight":
        player.nextTrack();
        break;
      case "ArrowUp":
        e.preventDefault();
        player.controls.setVolume(Math.min(1, player.audio.volume + 0.05));
        break;
      case "ArrowDown":
        e.preventDefault();
        player.controls.setVolume(Math.max(0, player.audio.volume - 0.05));
        break;
      case "m":
      case "M":
        player.controls.setMuted(!player.audio.muted);
        break;
      case "1":
        setShowAudioMixer(!showAudioMixer());
        break;
      case "2":
        setShowTemplates(!showTemplates());
        break;
      case "3":
        setShowSceneSelector(!showSceneSelector());
        break;
      case "4":
      case "p":
      case "P":
        setShowPomodoro(!showPomodoro());
        break;
    }
  };

  onMount(() => window.addEventListener("keydown", handleKeyDown));
  onCleanup(() => window.removeEventListener("keydown", handleKeyDown));

  return (
    <div onContextMenu={(e) => e.preventDefault()}>
      <Show when={showSceneSelector()}>
        <ScenePicker />
      </Show>

      <ActiveScene />
      <ToolBar />

      {/* Tools — always mounted, animated via FloatingWindow */}
      <AudioMixer />
      <Pomodoro />
      <Templates />

      {/* Remove later */}
      {/* <AudioPlayer />
      <EffectPlayer /> */}
    </div>
  );
};

export default App;
