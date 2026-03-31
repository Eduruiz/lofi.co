import { For, type Component, createMemo, Show, createSignal, createEffect } from "solid-js";
import clsx from 'clsx';
import { HoverCard } from "@kobalte/core/hover-card";
import { Slider } from "@kobalte/core/slider";

import "../../../assets/styles/ActiveScene.css";
import { Action } from "../../../data/scene.data";
import { EffectType } from "../../../data/audio.data";
import { currentScene, night, pixelated } from "../../../stores/scene";
import { hasSupportFor } from "../../../utils/set";
import effects from "../../../stores/effects";

const ActiveScene: Component = () => {
  /**
   * Variants are built like this:
   * - day with no effect   -> default
   * - day with effect      -> {effect}
   * - night with no effect -> default_night
   * - night with effect    -> {effect}_night
   * - pixel with no effect  -> default_pixel
   * ...and so on !
   */
  const currentVariant = createMemo(() => {
    let variant = "default";

    const sceneVariants = Object.keys(currentScene().variants);
    const effectsVolume = effects.volume();
    const enabledEffects = Object.keys(effectsVolume).filter(effect => effectsVolume[effect as EffectType] > 0);

    // check in enabled variants
    for (const lookupVariantName of sceneVariants) {
      for (const effectName of enabledEffects) {
        if (lookupVariantName === effectName) {
          variant = lookupVariantName;
          break;
        }
      }

      // We found a variant, no need to keep looking.
      if (variant !== "default") break;
    }

    // Add suffixes.
    if (night() && hasSupportFor(currentScene(), "night")) variant += "_night";
    if (pixelated() && hasSupportFor(currentScene(), "pixel")) variant += "_pixel";
    return variant;
  });

  return (
    <div class="background-video-scroll relative flex overflow-hidden h-screen w-screen">
      <For each={Object.keys(currentScene().variants)}>
        {(variant) => {
          let videoRef: HTMLVideoElement | undefined;
          const isActive = () => variant === currentVariant();
          const [visible, setVisible] = createSignal(isActive());

          createEffect(() => {
            if (!videoRef) return;
            if (isActive()) {
              videoRef.play().catch(() => {});
              setVisible(true);
            } else {
              setVisible(false);
              // Pause after fade-out completes so the frame stays visible during transition
              setTimeout(() => { if (!isActive()) videoRef?.pause(); }, 800);
            }
          });

          return (
            <div class="background-video">
              <video ref={videoRef} src={currentScene().variants[variant]} preload="auto" loop muted playsinline
                class={clsx(
                  "w-full h-full transition-opacity duration-700",
                  visible() ? "opacity-100" : "opacity-0"
                )}
              ></video>
            </div>
          );
        }}
      </For>
      <div class="background-cta z-10">
        <For each={currentScene().actions}>
          {action => <EffectPoint action={action} />}
        </For>
      </div>
    </div>
  )
};

type EffectPointProps = {
  action: Action;
}

const EffectPoint = (props: EffectPointProps) => {

  const action = props.action;

  const [hoverCardOpen, setHoverCardOpen] = createSignal(false);

  const isEffectOn = (effect_name: EffectType) => {
    return effects.volume()[effect_name] !== 0;
  }

  const setEffectVolume = (effect_name: EffectType, volume: number) => {
    effects.setVolume(prev => ({ ...prev, [effect_name]: volume }))
  }

  return <div class="absolute flex flex-col items-center" style={{
    // 200px is the width of the action button on the original app.
    // Anyway, since button position depends on that width, it should
    // change when screen width is large, using 11.8% seems to be a good tradeoff.
    width: "11.8%",
    top: action.position[1] + "%",
    left: action.position[0] + "%"
  }}>
    <HoverCard open={hoverCardOpen()} onOpenChange={setHoverCardOpen}>

      <HoverCard.Trigger class="border-[3px] border-white rounded-[50%] h-[32px] w-[32px] group flex items-center justify-center cursor-pointer"
        onClick={() => {
          if (action.type !== "sound") return;
          // We start the volume at 20% to avoid the sound being too loud by default.
          setEffectVolume(action.effect, isEffectOn(action.effect) ? 0 : 0.2)
          setHoverCardOpen(isEffectOn(action.effect))
        }}
      >
        <div class={clsx(
          "group-hover:opacity-100 bg-primary transition h-[18px] w-[18px] rounded-[50%]",
          action.type === "sound" && effects.volume()[action.effect] > 0 ? "opacity-100" : "opacity-0"
        )} />
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content class="absolute top-[20px] left-[50%] transform translate-x-[-50%] bg-bgd-100 rounded-[10px] border border-white/20 backdrop-blur-[30px] flex flex-col justify-between items-center px-4 py-2 z-20 gap-2">
          <p>{action.title}</p>

          {action.type === "sound" &&
            <Show when={isEffectOn(action.effect)}>
              <Slider class="w-[120px]" value={[effects.volume()[action.effect]]} onChange={(v) => setEffectVolume(action.effect, v[0])} minValue={0} maxValue={1} step={0.05}>
                <Slider.Track class="h-2 bg-[#fff2] relative rounded-2xl">
                  <Slider.Fill class="bg-primary h-full absolute rounded-2xl" />
                  <Slider.Thumb class="bg-primary w-5 h-5 rounded-full top-[-6px]">
                    <Slider.Input />
                  </Slider.Thumb>
                </Slider.Track>
              </Slider>
            </Show>}
        </HoverCard.Content>
      </HoverCard.Portal>

    </HoverCard>
  </div>
}

export default ActiveScene;
