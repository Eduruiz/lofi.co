import { Show, type Component } from "solid-js";

import { showSceneSelector } from "./stores/app";
import "./stores/session";
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
