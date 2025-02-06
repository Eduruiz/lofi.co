import { createSignal, onCleanup } from 'solid-js';
import { Component, ParentProps } from "solid-js";
import { alarms } from '../data/audio.data';
import FloatingWindow from './FloatingWindow';

const PomodoroTimer: Component = () => {
  // Define durations (in seconds)
  const focusDuration = 25 * 60;
  const shortBreakDuration = 5 * 60;
  const longBreakDuration = 25 * 60; // For now, long break equals focus duration

  // Signals for current mode's duration, remaining time, and timer state
  const [currentDuration, setCurrentDuration] = createSignal<number>(focusDuration);
  const [timeLeft, setTimeLeft] = createSignal<number>(focusDuration);
  const [isRunning, setIsRunning] = createSignal<boolean>(false);
  let timerId: number | null = null;

  // Start (or resume) the timer
  const startTimer = () => {
    if (isRunning()) return;
    setIsRunning(true);
    timerId = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer is finished, play the Piano alarm (index 2)
          new Audio(alarms[2]).play();
          clearInterval(timerId!);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Pause the timer
  const pauseTimer = () => {
    if (timerId !== null) {
      clearInterval(timerId);
      setIsRunning(false);
      timerId = null;
    }
  };

  // Reset the timer to the current mode's duration
  const resetTimer = () => {
    pauseTimer();
    setTimeLeft(currentDuration());
  };

  // Change mode and reset timer accordingly
  const setMode = (duration: number) => {
    pauseTimer();
    setCurrentDuration(duration);
    setTimeLeft(duration);
  };

  // Clean up the interval when the component is unmounted
  onCleanup(() => {
    if (timerId !== null) {
      clearInterval(timerId);
    }
  });

  // Format seconds into mm:ss
  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <FloatingWindow width={400} height={350}>
      <Panel padding={12}>
        <div class="flex flex-col items-center space-y-6 text-white/90">
          {/* Header */}
          <p class="uppercase text-xs tracking-widest">Pomodoro Timer</p>

          {/* Timer Display */}
          <div class="text-6xl font-mono">
            {formatTime(timeLeft())}
          </div>

          {/* Mode Selector */}
          <div class="flex space-x-4">
            <button
              onClick={() => setMode(focusDuration)}
              class="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded focus:outline-none"
            >
              Focus
            </button>
            <button
              onClick={() => setMode(shortBreakDuration)}
              class="px-3 py-1 bg-green-600 hover:bg-green-700 rounded focus:outline-none"
            >
              Short Break
            </button>
            <button
              onClick={() => setMode(longBreakDuration)}
              class="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded focus:outline-none"
            >
              Long Break
            </button>
          </div>

          {/* Timer Controls */}
          <div class="flex space-x-4">
            {!isRunning() ? (
              <button
                onClick={startTimer}
                class="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded focus:outline-none"
              >
                {(timeLeft() === 0 || timeLeft() === currentDuration()) ? 'Start' : 'Resume'}
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                class="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded focus:outline-none"
              >
                Pause
              </button>
            )}
            <button
              onClick={resetTimer}
              class="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded focus:outline-none"
            >
              Reset
            </button>
          </div>
        </div>
      </Panel>
    </FloatingWindow>
  );
};

const Panel = (props: { padding: number } & ParentProps) => {
  return <div class="rounded-xl bg-bgd-300 backdrop-blur-xl border border-white/20 h-full" style={{
    padding: props.padding + "px"
  }}>
    {props.children}
  </div>
}

export default PomodoroTimer;
