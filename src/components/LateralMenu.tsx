import { type Component, Show, type VoidComponent, type JSX, createSignal } from "solid-js";
import { AudioState } from "@solid-primitives/audio";
import { Tooltip } from "@kobalte/core/tooltip";

import { currentScene, night, pixelated, setNight, setPixelated } from "../stores/scene";
import { hasSupportFor } from "../utils/set";
import { setShowSceneSelector } from "../stores/app";
import player from "../stores/player";

import SkipPreviousIcon from "../assets/icons/skip-previous.svg?component-solid";
import SkipNextIcon from "../assets/icons/skip-next.svg?component-solid";
import PlayIcon from "../assets/icons/play.svg?component-solid";
import SettingsIcon from "../assets/icons/settings.svg?component-solid";
import VolumeIcon from "../assets/icons/volume.svg?component-solid";
import VolumeMuteIcon from "../assets/icons/volume-mute.svg?component-solid";
import MixerIcon from "../assets/icons/mixer.svg?component-solid";
import ScenesIcon from "../assets/icons/scenes.svg?component-solid";
import ToolsIcon from "../assets/icons/tools.svg?component-solid";
import PipIcon from "../assets/icons/pip.svg?component-solid";
import FullscreenIcon from "../assets/icons/fullscreen.svg?component-solid";
import PauseIcon from "../assets/icons/pause.svg?component-solid";

const Divider = () => (
  <div class="bg-[#fff2] rounded-[2px] h-[1px] my-[20px] w-[20px] rotate-90" />
);

const LateralMenu: Component = () => {
  const supportForNight = () => hasSupportFor(currentScene(), "night");
  const supportForPixel = () => hasSupportFor(currentScene(), "pixel");

  const Button: VoidComponent<{
    active?: boolean
    name: string
    icon: JSX.Element,
    onClick: () => void
  }> = (props) => (
    <Tooltip>
      <Tooltip.Trigger
        type="button"
        class="p-2 hover:(bg-[#fff]/20 scale-110) rounded-lg transition"
        classList={{ "bg-[#fff]/15": props.active }}
        onClick={() => props.onClick()}
      >
        {props.icon}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content class="z-50 bg-bgd-100 rounded-[10px] px-3 py-2 mb-3 border border-white/20 backdrop-blur-[30px]">
          <p>{props.name}</p>
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip>
  );

  const [showVolumeSlider, setShowVolumeSlider] = createSignal(false);
  const VolumeSlider: VoidComponent = () => (
    <div class="absolute bottom-[60px] left-[50%] transform translate-x-[-50%] bg-bgd-100 rounded-[10px] h-[52px] border border-white/20 backdrop-blur-[30px] flex justify-between items-center px-4">
      <input
        type="range"
        min="0"
        max="100"
        value={player.audio.volume * 100}
        onInput={(e) => player.controls.setVolume(e.currentTarget.valueAsNumber / 100)}
      />
    </div>
  );

  return (
    <div class="z-20 fixed bottom-[22px] inset-x-[17px] bg-bgd-100 rounded-[10px] h-[52px] border border-white/20 backdrop-blur-[30px] flex justify-between items-center px-4">
      {/* <p class="mr-auto">03:23 PM</p> */}

      <Show when={supportForNight()}>
        <input
          type="checkbox"
          checked={night()}
          onChange={() => {
            setNight(prev => !prev);
          }}
        />
      </Show>

      <Show when={supportForPixel()}>
        <input
          type="checkbox"
          checked={pixelated()}
          onChange={() => {
            setPixelated(prev => !prev);
          }}
        />
      </Show>

      <div class="flex items-center gap-1.5">
        <Button
          name="Previous track"
          icon={<SkipPreviousIcon />}
          onClick={() => player.previousTrack()}
        />

        <Button
          name={player.audio.state === AudioState.PLAYING ? "Pause" : "Play"}
          icon={player.audio.state === AudioState.PLAYING ? <PauseIcon /> : <PlayIcon />}
          onClick={() => player.audio.state === AudioState.PLAYING ? player.controls.pause() : player.controls.play()}
        />

        <Button
          name="Next track"
          icon={<SkipNextIcon />}
          onClick={() => player.nextTrack()}
        />

        <div class="relative">
          <Button
            name="Volume"
            icon={<VolumeIcon />}
            onClick={() => setShowVolumeSlider(prev => !prev)}
          />
          <Show when={showVolumeSlider()}>
            <VolumeSlider />
          </Show>
        </div>

        <Button
          active={player.audio.muted}
          name="Mute"
          icon={<VolumeMuteIcon />}
          onClick={() => player.controls.setMuted(!player.audio.muted)}
        />
        
        <Divider />

        <Button
          name="Mixer"
          icon={<MixerIcon />}
          onClick={() => void 0}
        />
        {/* <Button
          name="Templates"
          icon={<TemplatesIcon />}
          onClick={() => void 0}
        /> */}
        <Button
          name="Scenes"
          icon={<ScenesIcon />}
          onClick={() => setShowSceneSelector(prev => !prev)}
        />
        <Button
          name="Tools"
          icon={<ToolsIcon />}
          onClick={() => void 0}
        />
        <Divider />
        <Button
          name="Picture-in-picture"
          icon={<PipIcon />}
          onClick={() => void 0}
        />
        <Button
          name="Fullscreen"
          icon={<FullscreenIcon />}
          onClick={() => void 0}
        />
      </div>

      <div>
        <SettingsIcon />
      </div>
    </div>
  );
};

export default LateralMenu;