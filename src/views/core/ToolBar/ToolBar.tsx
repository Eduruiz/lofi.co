import { type Component, Show, type VoidComponent, type JSX, createSignal } from "solid-js";
import { AudioState } from "@solid-primitives/audio";
import { createDateNow } from "@solid-primitives/date";
import { Tooltip } from "@kobalte/core/tooltip";
import { Slider } from "@kobalte/core/slider";

import DarkModeToggle from "../../../components/DarkModeToggle";
import { setShowAudioMixer, setShowPomodoro, setShowSceneSelector, setShowTemplates, musicSource, youtubeControls, youtubeIsPlaying } from "../../../stores/app";
import { playlistsLofiGirl, playlistsChillhop } from "../../../data/audio.data";
import player from "../../../stores/player";
import { currentScene, night, setNight, pixelated, setPixelated } from "../../../stores/scene";
import { hasSupportFor } from "../../../utils/set";

import SkipPreviousIcon from "../../../assets/icons/skip-previous.svg?component-solid";
import SkipNextIcon from "../../../assets/icons/skip-next.svg?component-solid";
import PlayIcon from "../../../assets/icons/play.svg?component-solid";
import SettingsIcon from "../../../assets/icons/settings.svg?component-solid";
import VolumeIcon from "../../../assets/icons/volume.svg?component-solid";
import VolumeMuteIcon from "../../../assets/icons/volume-mute.svg?component-solid";
import MixerIcon from "../../../assets/icons/mixer.svg?component-solid";
import ScenesIcon from "../../../assets/icons/scenes.svg?component-solid";
import { RiSystemTimerLine } from "solid-icons/ri";
import TemplatesIcon from "../../../assets/icons/templates.svg?component-solid";
import PipIcon from "../../../assets/icons/pip.svg?component-solid";
import FullscreenIcon from "../../../assets/icons/fullscreen.svg?component-solid";
import PauseIcon from "../../../assets/icons/pause.svg?component-solid";

const Divider = () => (
  <div class="bg-[#fff2] rounded-[2px] h-[1px] my-[20px] w-[20px] rotate-90" />
);

const LateralMenu: Component = () => {
  const supportForNight = () => hasSupportFor(currentScene(), "night");
  const supportForPixel = () => hasSupportFor(currentScene(), "pixel");

  const [currentTime] = createDateNow(1000)

  const Button: VoidComponent<{
    active?: boolean
    disabled?: boolean
    name: string
    icon: JSX.Element,
    onClick: () => void
  }> = (props) => (
    <Tooltip>
      <Tooltip.Trigger
        type="button"
        class="p-2 rounded-lg transition"
        classList={{
          "bg-[#fff]/15": props.active,
          "opacity-25 cursor-not-allowed": props.disabled,
          "hover:(bg-[#fff]/20 scale-110)": !props.disabled,
        }}
        onClick={() => !props.disabled && props.onClick()}
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
  const volume = () => [player.audio.volume];
  const changeVolume = (v: number[]) => {
    player.controls.setVolume(v[0]);
    if (musicSource() !== "lofi") youtubeControls.setVolume(v[0]);
  };

  const VolumeSlider: VoidComponent = () => (
    <div class="absolute bottom-[60px] left-[50%] transform translate-x-[-50%] bg-bgd-100 rounded-[10px] h-[52px] w-[180px] border border-white/20 backdrop-blur-[30px] flex items-center px-4">
      <Slider class="flex-auto" value={volume()} onChange={changeVolume} minValue={0} maxValue={1} step={0.05}>
        <Slider.Track class="h-2 bg-[#fff2] relative rounded-2xl">
          <Slider.Fill class="bg-primary h-full absolute rounded-2xl" />
          <Slider.Thumb class="bg-primary w-5 h-5 rounded-full top-[-6px]">
            <Slider.Input />
          </Slider.Thumb>
        </Slider.Track>
      </Slider>
    </div>
  );

  const handleFullScreen = () => {
    // If the document is not in fullscreen mode, request fullscreen on the <html> element
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .catch((err) =>
          console.error("Error attempting to enable full-screen mode:", err)
        );
    } else {
      // Otherwise, exit fullscreen mode
      document.exitFullscreen().catch((err) =>
        console.error("Error attempting to exit full-screen mode:", err)
      );
    }
  };

  return (
    <div class="z-20 fixed bottom-[22px] inset-x-[17px] bg-bgd-100 rounded-[10px] h-[48px] border border-white/20 backdrop-blur-[30px] grid grid-cols-5 items-center px-4">

      <div class="col-span-1 flex flex-row gap-3 items-center">

        <p class="text-sm font-medium">{currentTime().toLocaleTimeString("en-US", { hour12: true, hour: "numeric", minute: "numeric" })}</p>

        <Show when={musicSource() === "lofi"}>
          <div class="h-4 w-[1px] bg-white/20" />
          <p class="text-xs text-white/40 capitalize">{player.mood()} #{player.trackIndex() + 1}</p>
        </Show>
        <Show when={musicSource() === "lofigirl"}>
          <div class="h-4 w-[1px] bg-white/20" />
          <p class="text-xs text-white/40 truncate max-w-[200px]">{playlistsLofiGirl[player.mood() as keyof typeof playlistsLofiGirl].title}</p>
        </Show>
        <Show when={musicSource() === "chillhop"}>
          <div class="h-4 w-[1px] bg-white/20" />
          <p class="text-xs text-white/40 truncate max-w-[200px]">{playlistsChillhop[player.mood() as keyof typeof playlistsChillhop].title}</p>
        </Show>

        <Show when={supportForNight()}>
          <DarkModeToggle dark={night} setDark={setNight} />
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

      </div>

      <div class="col-span-3 flex flex-row justify-center items-center gap-1">
        <Button
          name="Previous track"
          icon={<SkipPreviousIcon />}
          disabled={musicSource() !== "lofi"}
          onClick={() => player.previousTrack()}
        />

        <Button
          name={(musicSource() === "lofigirl" || musicSource() === "chillhop")
            ? (youtubeIsPlaying() ? "Pause" : "Play")
            : (player.audio.state === AudioState.PLAYING ? "Pause" : "Play")}
          icon={(musicSource() === "lofigirl" || musicSource() === "chillhop")
            ? (youtubeIsPlaying() ? <PauseIcon /> : <PlayIcon />)
            : (player.audio.state === AudioState.PLAYING ? <PauseIcon /> : <PlayIcon />)}
          onClick={() => {
            if (musicSource() === "lofigirl" || musicSource() === "chillhop") {
              youtubeControls.toggle();
            } else {
              player.audio.state === AudioState.PLAYING ? player.controls.pause() : player.controls.play();
            }
          }}
        />

        <Button
          name="Next track"
          icon={<SkipNextIcon />}
          disabled={musicSource() !== "lofi"}
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
          onClick={() => {
            const newMuted = !player.audio.muted;
            player.controls.setMuted(newMuted);
            if (musicSource() !== "lofi") newMuted ? youtubeControls.mute() : youtubeControls.unmute();
          }}
        />

        <Divider />

        <Button
          name="Mixer"
          icon={<MixerIcon />}
          onClick={() => setShowAudioMixer(prev => !prev)}
        />
        <Button
          name="Templates"
          icon={<TemplatesIcon />}
          onClick={() => setShowTemplates(prev => !prev)}
        />
        <Button
          name="Scenes"
          icon={<ScenesIcon />}
          onClick={() => setShowSceneSelector(prev => !prev)}
        />
        <Button
          name="Pomodoro"
          icon={<RiSystemTimerLine class="text-xl" />}
          onClick={() => setShowPomodoro(prev => !prev)}
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
          onClick={handleFullScreen}
        />
      </div>

      <div class="col-span-1 flex flex-row justify-end items-center">
        <SettingsIcon />
      </div>
    </div>
  );
};

export default LateralMenu;
