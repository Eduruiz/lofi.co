import { createSignal, For, Show, Component } from 'solid-js';
import { scenes } from '../data/scene.data';
import { EffectType } from '../data/audio.data';
import { effectIcon } from '../data/effect-icons';
import { showTemplates, setShowTemplates } from '../stores/app';
import { captureSnapshot, restoreSnapshot, type SessionSnapshot } from '../stores/session';
import FloatingWindow from './FloatingWindow';

interface Template {
  name: string;
  snapshot: SessionSnapshot;
  builtIn?: boolean;
}

const STORAGE_KEY = "lofi-templates";

const builtInTemplates: Template[] = [
  {
    name: "Deep Focus",
    builtIn: true,
    snapshot: {
      sceneKey: "library",
      night: false,
      pixelated: false,
      musicSource: "lofi",
      mood: "jazzy",
      volume: 0.7,
      effects: { keyboard: 0.3, rain_forest: 0 } as Record<string, number>,
      widgets: { mixer: false, pomodoro: true, templates: false },
      windowPositions: {},
    },
  },
  {
    name: "Night Time",
    builtIn: true,
    snapshot: {
      sceneKey: "forestInside",
      night: true,
      pixelated: false,
      musicSource: "lofi",
      mood: "sleepy",
      volume: 0.5,
      effects: { rain_forest: 0.4, fire: 0.3 } as Record<string, number>,
      widgets: { mixer: false, pomodoro: false, templates: false },
      windowPositions: {},
    },
  },
  {
    name: "Afternoon Chill",
    builtIn: true,
    snapshot: {
      sceneKey: "cafeInside",
      night: false,
      pixelated: false,
      musicSource: "lofi",
      mood: "chill",
      volume: 0.6,
      effects: { people: 0.2, city: 0.15 } as Record<string, number>,
      widgets: { mixer: false, pomodoro: false, templates: false },
      windowPositions: {},
    },
  },
  {
    name: "Rainy Day",
    builtIn: true,
    snapshot: {
      sceneKey: "cozyStudio",
      night: false,
      pixelated: false,
      musicSource: "lofi",
      mood: "chill",
      volume: 0.6,
      effects: { window_rain: 0.5, thunders: 0.2 } as Record<string, number>,
      widgets: { mixer: false, pomodoro: false, templates: false },
      windowPositions: {},
    },
  },
];

const loadUserTemplates = (): Template[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveUserTemplates = (templates: Template[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
};

const activeEffects = (snapshot: SessionSnapshot): EffectType[] => {
  if (!snapshot.effects) return [];
  return (Object.entries(snapshot.effects) as [EffectType, number][])
    .filter(([, v]) => v > 0)
    .map(([k]) => k);
};

const moodColors: Record<string, string> = {
  chill: "bg-primary/20 text-primary",
  jazzy: "bg-purple-500/20 text-purple-400",
  sleepy: "bg-blue-500/20 text-blue-400",
};

const TemplatesPanel: Component = () => {
  const [userTemplates, setUserTemplates] = createSignal<Template[]>(loadUserTemplates());
  const [newName, setNewName] = createSignal("");
  const [showSaveForm, setShowSaveForm] = createSignal(false);

  const allTemplates = () => [...builtInTemplates, ...userTemplates()];

  const applyTemplate = (template: Template) => {
    restoreSnapshot(template.snapshot);
  };

  const saveCurrentAsTemplate = () => {
    const name = newName().trim();
    if (!name) return;

    const template: Template = {
      name,
      snapshot: captureSnapshot(),
    };

    const updated = [...userTemplates(), template];
    setUserTemplates(updated);
    saveUserTemplates(updated);
    setNewName("");
    setShowSaveForm(false);
  };

  const deleteTemplate = (index: number) => {
    const updated = userTemplates().filter((_, i) => i !== index);
    setUserTemplates(updated);
    saveUserTemplates(updated);
  };

  const sceneName = (sceneKey: string): string => {
    if (!scenes[sceneKey]) return sceneKey;
    // Convert camelCase to spaced words
    return sceneKey.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();
  };

  return (
    <FloatingWindow id="templates" width={360} height={520} visible={showTemplates()} closeWindow={() => setShowTemplates(false)}>
      <div class="flex flex-col gap-3 text-white/90">
        {/* Header */}
        <div class="flex items-center justify-between">
          <p class="uppercase text-xs tracking-widest text-white/40">Templates</p>
          <button
            class="text-xs px-3 py-1.5 rounded-lg bg-primary/15 text-primary hover:bg-primary/25 transition"
            onClick={() => setShowSaveForm(prev => !prev)}
          >
            {showSaveForm() ? 'Cancel' : '+ Save current'}
          </button>
        </div>

        {/* Save form */}
        <Show when={showSaveForm()}>
          <div class="flex gap-2">
            <input
              type="text"
              placeholder="Template name..."
              class="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 outline-none placeholder:text-white/25"
              value={newName()}
              onInput={(e) => setNewName(e.currentTarget.value)}
              onKeyDown={(e) => e.key === "Enter" && saveCurrentAsTemplate()}
            />
            <button
              class="px-4 py-2 bg-primary text-black text-sm font-medium rounded-lg hover:brightness-110 transition"
              onClick={saveCurrentAsTemplate}
            >
              Save
            </button>
          </div>
        </Show>

        {/* Template list */}
        <div class="flex flex-col gap-2">
          <For each={allTemplates()}>
            {(template, index) => (
              <button
                class="w-full text-left bg-white/3 border border-white/8 rounded-xl px-4 py-3 hover:bg-white/6 transition group"
                onClick={() => applyTemplate(template)}
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium">{template.name}</span>
                  <div class="flex items-center gap-2">
                    <span class={"text-xs px-2 py-0.5 rounded-lg capitalize " + (moodColors[template.snapshot.mood] || "bg-white/10 text-white/50")}>
                      {template.snapshot.mood}
                    </span>
                    <Show when={!template.builtIn}>
                      <span
                        class="text-xs text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTemplate(index() - builtInTemplates.length);
                        }}
                      >
                        ✕
                      </span>
                    </Show>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-xs text-white/30">{sceneName(template.snapshot.sceneKey)}</span>
                  <Show when={template.snapshot.night}>
                    <span class="text-xs text-white/30">🌙</span>
                  </Show>
                  <div class="flex gap-1">
                    <For each={activeEffects(template.snapshot)}>
                      {(effectType) => {
                        const Icon = effectIcon[effectType];
                        return <Icon class="text-sm text-white/30" />;
                      }}
                    </For>
                  </div>
                </div>
              </button>
            )}
          </For>
        </div>
      </div>
    </FloatingWindow>
  );
};

export default TemplatesPanel;
