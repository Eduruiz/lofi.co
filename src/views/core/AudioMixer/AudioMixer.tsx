import { Component, For, Show, ParentProps } from "solid-js";

import { Slider } from "@kobalte/core/slider";
import {
  BiSolidMoon, BiSolidCoffee, BiSolidVolume, BiSolidVolumeFull,
  BiRegularShuffle, BiSolidMusic, BiLogosSpotify, BiLogosYoutube
} from "solid-icons/bi"

import FloatingWindow from "../../../components/FloatingWindow";
import SaxIcon from "../../../assets/icons/sax.svg?component-solid"
import player from "../../../stores/player";
import { SoundEffect, SoundTrackMood, effects, playlistsSpotify, playlistsYouTube } from "../../../data/audio.data";
import effectsStore from "../../../stores/effects";
import { currentScene } from "../../../stores/scene";
import { effectIcon } from "../../../data/effect-icons";
import { showAudioMixer, setShowAudioMixer, musicSource, setMusicSource, setYoutubeIframe, setYoutubeIsPlaying } from "../../../stores/app";


const AudioMixer: Component = () => {

  // const effects = ["Forest Rain", "Bird Chirping", "Keyboard"]
  const sceneEffectNames = () => currentScene().actions.flatMap(a => a.type === "sound" ? [a.effect] : []);

  const sceneEffects = () => effects.filter(e => sceneEffectNames().includes(e.type))

  const otherEffects = () => effects.filter(e => !sceneEffectNames().includes(e.type))

  return <FloatingWindow id="mixer" width={420} height={540} visible={showAudioMixer()} closeWindow={() => setShowAudioMixer(false)}>
    <div class="grid grid-cols-12 gap-4 text-white/90">
      {/* Music header */}
      <div class="col-span-12">
        <Panel padding={16}>
          <div class="flex flex-col items-center gap-5">
            {/* Title */}
            <p class="uppercase text-xs tracking-widest text-white/40">Now Playing</p>
            {/* Mood buttons */}
            <div class="flex flex-row gap-6 justify-center">
              <PlaylistButton title="Sleepy" mood="sleepy" >
                <BiSolidMoon class={"m-auto text-2xl group-hover:fill-white " + (player.mood() === "sleepy" ? "fill-primary" : "fill-white/50")} />
              </PlaylistButton>
              <PlaylistButton title="Jazzy" mood="jazzy" >
                <SaxIcon class={"m-auto w-6 group-hover:fill-white " + (player.mood() === "jazzy" ? "fill-primary" : "fill-white/50")} />
              </PlaylistButton>
              <PlaylistButton title="Chill" mood="chill" >
                <BiSolidCoffee class={"m-auto text-2xl group-hover:fill-white " + (player.mood() === "chill" ? "fill-primary" : "fill-white/50")} />
              </PlaylistButton>
            </div>
            {/* Source selector pill */}
            <div class="flex flex-row items-center gap-2 bg-white/5 rounded-full px-3 py-1.5">
              <span class="text-xs text-white/40 uppercase tracking-widest">Via</span>
              <SourceButton source="lofi" active={musicSource() === "lofi"} onClick={() => { setMusicSource("lofi"); player.controls.play(); }}>
                <BiSolidMusic class={"text-lg " + (musicSource() === "lofi" ? "fill-primary" : "fill-white/50")} />
              </SourceButton>
              <SourceButton source="spotify" active={musicSource() === "spotify"} onClick={() => { setMusicSource("spotify"); player.controls.pause(); }}>
                <BiLogosSpotify class={"text-lg " + (musicSource() === "spotify" ? "fill-[#1DB954]" : "fill-white/50")} />
              </SourceButton>
              <SourceButton source="youtube" active={musicSource() === "youtube"} onClick={() => { setMusicSource("youtube"); player.controls.pause(); }}>
                <BiLogosYoutube class={"text-lg " + (musicSource() === "youtube" ? "fill-[#FF0000]" : "fill-white/50")} />
              </SourceButton>
            </div>
          </div>
        </Panel>
      </div>
      {/* Music volume (lofi.co) or embeds */}
      <Show when={musicSource() === "lofi"}>
        <div class="col-span-12">
          <Panel padding={12}>
            <p class="uppercase mb-3">Music volume</p>
            <VolumeSlider />
          </Panel>
        </div>
      </Show>
      <Show when={musicSource() === "spotify"}>
        <div class="col-span-12">
          <Panel padding={0}>
            <iframe
              src={playlistsSpotify[player.mood() as keyof typeof playlistsSpotify].url + "&theme=0"}
              width="100%"
              height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ "border-radius": "12px", border: "none" }}
            />
          </Panel>
        </div>
      </Show>
      <Show when={musicSource() === "youtube"}>
        <div class="col-span-12">
          <Panel padding={0}>
            <iframe
              ref={(el) => { setYoutubeIframe(el); setYoutubeIsPlaying(false); }}
              src={playlistsYouTube[player.mood() as keyof typeof playlistsYouTube].url + "?enablejsapi=1&origin=" + window.location.origin}
              width="100%"
              height="280"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              loading="lazy"
              style={{ "border-radius": "12px", border: "none" }}
            />
          </Panel>
        </div>
      </Show>
      {/* Scene sounds */}
      <div class="col-span-12">
        <Panel padding={14}>
          <div class="flex flex-row justify-between mb-2">
            <p class="uppercase">Sounds from <span class="text-primary">scene</span></p>
            <BiRegularShuffle class="text-2xl fill-white/50" />
          </div>

          <For each={sceneEffects()}>
            {e => <EffectSlider effect={e} />}
          </For>
        </Panel>
      </div>
      {/* All sounds */}
      <div class="col-span-12">
        <Panel padding={14}>
          <div class="flex flex-row justify-between mb-2">
            <p class="uppercase">All sounds</p>
            <BiRegularShuffle class="text-2xl fill-white/50" />
          </div>

          <For each={otherEffects()}>
            {e => <EffectSlider effect={e} />}
          </For>
        </Panel>
      </div>
    </div>
  </FloatingWindow>
};

const Panel = (props: { padding: number } & ParentProps) => {
  return <div class="rounded-xl bg-bgd-300 backdrop-blur-xl border border-white/20 h-full" style={{
    padding: props.padding + "px"
  }}>
    {props.children}
  </div>
}


const SourceButton = (props: { source: string, active: boolean, onClick: () => void } & ParentProps) => {
  return <button
    class="rounded-lg w-8 h-8 flex items-center justify-center transition"
    classList={{
      'bg-white/10': props.active,
      'bg-white/3 opacity-40 hover:opacity-70': !props.active,
    }}
    onClick={() => props.onClick()}
  >
    {props.children}
  </button>
}

const PlaylistButton = (props: { title: string, mood: SoundTrackMood } & ParentProps) => {
  const handleClick = () => {
    if (musicSource() === "lofi") {
      player.controls.setMood(props.mood);
    } else {
      player.controls.setMoodSilent(props.mood);
    }
  };

  const isActive = () => player.mood() === props.mood;

  return <label class="group flex flex-col items-center gap-2 transition-all" onClick={handleClick}>
    <button
      class="relative rounded-full flex items-center justify-center transition-all"
      classList={{
        'w-14 h-14 bg-primary/20 border-2 border-primary/40': isActive(),
        'w-11 h-11 bg-white/8': !isActive(),
      }}
    >
      <input type="radio" name="playlistMood" value={props.mood} class="absolute opacity-0" />
      {props.children}
    </button>
    <p class="text-xs" classList={{
      'text-primary font-medium': isActive(),
      'text-white/50': !isActive(),
    }}>{props.title}</p>
  </label>
}

const VolumeSlider = () => {

  const volume = () => [player.audio.volume]
  const changeVolume = (v: number[]) => player.controls.setVolume(v[0])

  return <div class="flex flex-row items-center">
    <BiSolidVolume class="text-2xl fill-primary" />

    <Slider class="flex-auto px-4" value={volume()} onChange={changeVolume} minValue={0} maxValue={1} step={0.05}>
      <Slider.Track class="h-2 bg-[#fff2] relative rounded-2xl">
        <Slider.Fill class="bg-primary h-full absolute rounded-2xl" />
        <Slider.Thumb class="bg-primary w-5 h-5 rounded-full top-[-6px]">
          <Slider.Input />
        </Slider.Thumb>
      </Slider.Track>
    </Slider>

    <BiSolidVolumeFull class="text-2xl fill-primary" />
  </div>
}

const EffectSlider = (props: { effect: SoundEffect }) => {

  const Icon = effectIcon[props.effect.type]

  const effectVolume = () => [effectsStore.volume()[props.effect.type]]
  const setEffectVolume = (v: number[]) => effectsStore.setVolume(s => ({ ...s, [props.effect.type]: v[0] }))

  const thumbLeft = () => `${effectVolume()[0] * 100}%`;

  return <div class="flex flex-row items-center py-2">
    <p class="w-[40%] text-sm">{props.effect.name}</p>

    {/* Add curved parts before and after the slider */}
    <div class="h-8 w-4 bg-primary rounded-l-full flex-shrink-0" />
    <div class="flex-auto relative">
      <Slider class="w-full" value={effectVolume()} onChange={setEffectVolume} minValue={0} maxValue={1} step={0.05}>
        <Slider.Track class="h-8 bg-[#fff2] relative">
          <Slider.Fill class="bg-primary h-full absolute rounded-r-none" />
          <Slider.Thumb class="w-8 h-8 opacity-0">
            <Slider.Input />
          </Slider.Thumb>
        </Slider.Track>
      </Slider>
      {/* Visual thumb — bypasses Kobalte's DOM collection timing bug */}
      <div
        class="absolute top-0 w-8 h-8 bg-primary rounded-full flex justify-center items-center pointer-events-none"
        style={{ left: thumbLeft(), transform: "translateX(-50%)" }}
      >
        <Icon class="text-2xl text-black" />
      </div>
    </div>
    <div class="h-8 w-4 bg-[#fff2] rounded-r-full flex-shrink-0" />

  </div>
}

export default AudioMixer;