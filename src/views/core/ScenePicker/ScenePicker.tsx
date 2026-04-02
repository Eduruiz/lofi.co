import { For, Show, createSignal, type Component } from "solid-js";
import { type SceneSet, sceneSets } from "../../../data/scene.data";
import { setCurrentScene } from "../../../stores/scene";
import effects from "../../../stores/effects";

const SceneSelector: Component = () => {
  const [sceneSelected, setSceneSelected] = createSignal<SceneSet | null>(null);
  let scrollRef: HTMLDivElement | undefined;
  let velocity = 0;
  let rafId: number | null = null;

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    velocity += e.deltaY * 0.3;
    if (rafId) return;
    const animate = () => {
      if (!scrollRef || Math.abs(velocity) < 0.5) { rafId = null; return; }
      scrollRef.scrollLeft += velocity;
      velocity *= 0.85;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
  };

  return (
    <div
      ref={scrollRef}
      class="z-20 fixed inset-x-[17px] bottom-[80px] bg-bgd-100 rounded-[10px] border border-white/20 backdrop-blur-[30px] flex gap-4 px-4 py-3 max-w-screen overflow-auto"
      onWheel={onWheel}
    >
      <Show when={sceneSelected()}
        fallback={
          <For each={sceneSets}>
            {set => (
              <button type="button" class="flex-shrink-0" onClick={
                () => setSceneSelected(set)
              }>
                <img src={set.thumbnail} alt={set.name} class="w-[360px]" />
              </button>
            )}
          </For>
        }
      >
        {selected => (
          <div class="flex-shrink-0">
            <button type="button" onClick={() => setSceneSelected(null)}>
              Go back to sets
            </button>
            <For each={selected().scenes}>
              {scene => (
                <button type="button" class="flex-shrink-0" onClick={
                  () => { effects.resetAll(); setCurrentScene(scene); }
                }>
                  <img src={scene.thumbnail} alt={selected().name} class="w-[360px]" />
                </button>
              )}
            </For>
          </div>
        )}
      </Show>
    </div>
  );
};

export default SceneSelector;
