import { Show, type Component } from "solid-js";

import { showAudioMixer, showSceneSelector } from "./stores/app";
// import AudioPlayer from "./views/core/AudioMixer/AudioPlayer";
// import EffectPlayer from "./views/core/AudioMixer/EffectPlayer";
import ActiveScene from "./views/core/ActiveScene/ActiveScene";
import ScenePicker from "./views/core/ScenePicker/ScenePicker";
import ToolBar from "./views/core/ToolBar/ToolBar";
import AudioMixer from "./views/core/AudioMixer/AudioMixer";
import Pomodoro from "./components/Pomodoro";

/**
 * Main entry point for the application.
 */
const App: Component = () => {
  return (
    <div onContextMenu={(e) => e.preventDefault()}>
      <Show when={showSceneSelector()}>
        <ScenePicker />
      </Show>

      <Pomodoro />
      <ActiveScene />
      <ToolBar />

      {/* Tools */}
      <Show when={showAudioMixer()}><AudioMixer /></Show>

      {/* Remove later */}
      {/* <AudioPlayer />
      <EffectPlayer /> */}
    </div>
  );
};

export default App;
