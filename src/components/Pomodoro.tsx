import { createSignal, onCleanup, For, Component } from 'solid-js';
import { alarms } from '../data/audio.data';
import player from '../stores/player';
import { showPomodoro, setShowPomodoro } from '../stores/app';
import FloatingWindow from './FloatingWindow';

type PomodoroMode = 'focus' | 'short' | 'long';

const durations: Record<PomodoroMode, number> = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

const modeLabels: Record<PomodoroMode, string> = {
  focus: 'Focus',
  short: 'Short Break',
  long: 'Long Break',
};

const modeIcons: Record<PomodoroMode, string> = {
  focus: '⚡',
  short: '☕',
  long: '🌙',
};

const alarmNames = ['Digital', 'Easy Tone', 'Piano', 'Ringtone', 'Soft'];

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const formatDuration = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  return `${minutes}:00`;
};

const PomodoroTimer: Component = () => {
  const [mode, setMode] = createSignal<PomodoroMode>('focus');
  const [timeLeft, setTimeLeft] = createSignal(durations.focus);
  const [isRunning, setIsRunning] = createSignal(false);
  const [completedCount, setCompletedCount] = createSignal(0);
  const [selectedAlarm, setSelectedAlarm] = createSignal(2);
  const [sessionGoal] = createSignal(8);
  let timerId: number | null = null;

  const progress = () => 1 - timeLeft() / durations[mode()];
  const dashOffset = () => CIRCUMFERENCE * (1 - progress());

  const startTimer = () => {
    if (isRunning()) return;
    if (timeLeft() === 0) setTimeLeft(durations[mode()]);
    setIsRunning(true);
    timerId = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId!);
          timerId = null;
          setIsRunning(false);
          player.controls.pause();
          new Audio(alarms[selectedAlarm()]).play();
          if (mode() === 'focus') setCompletedCount((c) => c + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
      setIsRunning(false);
    }
  };

  const resetTimer = () => {
    pauseTimer();
    setTimeLeft(durations[mode()]);
  };

  const switchMode = (m: PomodoroMode) => {
    pauseTimer();
    setMode(m);
    setTimeLeft(durations[m]);
  };

  onCleanup(() => {
    if (timerId !== null) clearInterval(timerId);
  });

  const goalProgress = () => Math.round((completedCount() / sessionGoal()) * 100);

  return (
    <FloatingWindow id="pomodoro" width={320} height={670} visible={showPomodoro()} closeWindow={() => setShowPomodoro(false)}>
      <div class="flex flex-col gap-3 text-white/90">

        {/* Mode selector rows */}
        <div class="flex flex-col gap-2">
          <For each={(['focus', 'short', 'long'] as PomodoroMode[])}>
            {(m) => (
              <button
                onClick={() => switchMode(m)}
                class="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all"
                classList={{
                  'bg-white/8 border border-white/15': mode() === m,
                  'bg-white/3 border border-transparent hover:bg-white/5': mode() !== m,
                }}
              >
                <span
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  classList={{
                    'bg-primary/20': mode() === m,
                    'bg-white/5': mode() !== m,
                  }}
                >
                  {modeIcons[m]}
                </span>
                <span
                  class="text-sm font-medium flex-1 text-left"
                  classList={{
                    'text-white/90': mode() === m,
                    'text-white/50': mode() !== m,
                  }}
                >
                  {modeLabels[m]}
                </span>
                <span
                  class="text-xs font-mono tabular-nums"
                  classList={{
                    'text-primary bg-primary/15 px-2.5 py-1 rounded-lg': mode() === m,
                    'text-white/30': mode() !== m,
                  }}
                >
                  {formatDuration(durations[m])}
                </span>
              </button>
            )}
          </For>
        </div>

        {/* Timer circle with controls inside */}
        <div class="flex justify-center py-2">
          <div class="relative">
            <svg class="w-60 h-60" viewBox="0 0 220 220">
              {/* Outer glow */}
              <circle
                cx="110" cy="110" r="105"
                fill="rgba(255,255,255,0.02)"
                stroke="none"
              />
              {/* Background track */}
              <circle
                cx="110" cy="110" r={RADIUS}
                fill="rgba(0,0,0,0.3)"
                stroke="rgba(255,255,255,0.06)"
                stroke-width="4"
              />
              {/* Progress arc */}
              <circle
                cx="110" cy="110" r={RADIUS}
                fill="none"
                stroke="#f3a952"
                stroke-width="4"
                stroke-linecap="round"
                stroke-dasharray={String(CIRCUMFERENCE)}
                stroke-dashoffset={String(dashOffset())}
                transform="rotate(-90 110 110)"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            {/* Timer + controls centered over SVG */}
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-4xl font-mono text-white/90 tabular-nums tracking-tight">
                {formatTime(timeLeft())}
              </span>
              {/* Start/Pause + Reset buttons */}
              <div class="flex gap-2 items-center mt-4">
                <button
                  onClick={() => isRunning() ? pauseTimer() : startTimer()}
                  class="px-5 py-1.5 bg-primary text-black font-medium rounded-full hover:brightness-110 transition text-xs uppercase tracking-wider"
                >
                  {isRunning() ? 'Pause' : (timeLeft() === 0 || timeLeft() === durations[mode()] ? 'Start' : 'Resume')}
                </button>
                <button
                  onClick={resetTimer}
                  class="px-3 py-1.5 bg-white/8 text-white/50 hover:text-white/80 rounded-full transition text-xs"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Session Goal card */}
        <div class="bg-white/3 border border-white/8 rounded-xl px-4 py-3">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-white/40 uppercase tracking-widest">Session Goal</span>
            <span class="text-xs text-white/30">{goalProgress()}%</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">
              {completedCount()} of {sessionGoal()} Cycles
            </span>
            {/* Mini progress bar */}
            <div class="w-16 h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div
                class="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min(goalProgress(), 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Alarm selector card */}
        <div class="bg-white/3 border border-white/8 rounded-xl px-4 py-3">
          <div class="flex items-center justify-between">
            <span class="text-xs text-white/40 uppercase tracking-widest">Alarm Sound</span>
            <select
              class="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white/70 outline-none cursor-pointer"
              value={selectedAlarm()}
              onChange={(e) => setSelectedAlarm(Number(e.currentTarget.value))}
            >
              <For each={alarmNames}>
                {(name, i) => <option value={i()} class="bg-[#1a1a1a]">{name}</option>}
              </For>
            </select>
          </div>
        </div>

      </div>
    </FloatingWindow>
  );
};

export default PomodoroTimer;
