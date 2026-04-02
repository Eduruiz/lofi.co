import { Component, createSignal, createEffect, ParentProps, onCleanup } from "solid-js";
import { HiOutlineMinus } from "solid-icons/hi";
import { windowPositions, setWindowPositions } from "../stores/app";

type Props = {
  id: string;
  width: number;
  height: number;
  visible?: boolean;
  closeWindow: () => void;
} & ParentProps;

const FloatingWindow: Component<Props> = (props) => {
  const saved = windowPositions[props.id];
  const [x, setX] = createSignal(saved?.x ?? 20);
  const [y, setY] = createSignal(saved?.y ?? 100);

  // Sync position back to store on change
  createEffect(() => {
    setWindowPositions(props.id, { x: x(), y: y() });
  });

  let startX = 0;
  let startY = 0;
  let initialX = 0;
  let initialY = 0;
  let dragging = false;

  const onDragStart = (e: MouseEvent) => {
    if (e.button !== 0) return;
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialX = x();
    initialY = y();
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);
  };

  const onDragMove = (e: MouseEvent) => {
    if (!dragging) return;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    setX(initialX + deltaX);
    setY(initialY + deltaY);
  };

  const onDragEnd = () => {
    dragging = false;
    window.removeEventListener("mousemove", onDragMove);
    window.removeEventListener("mouseup", onDragEnd);
  };

  onCleanup(() => {
    window.removeEventListener("mousemove", onDragMove);
    window.removeEventListener("mouseup", onDragEnd);
  });

  return (
    <div
      class="z-20 fixed bg-bgd-100 border border-white/20 backdrop-blur-[30px] rounded-2xl overflow-y-auto"
      style={{
        width: `${props.width}px`,
        height: `${props.height}px`,
        top: `${y()}px`,
        left: `${x()}px`,
        transition: "transform 0.25s ease, opacity 0.25s ease",
        transform: props.visible === false ? "scale(0.9)" : "scale(1)",
        opacity: props.visible === false ? "0" : "1",
        "pointer-events": props.visible === false ? "none" : "auto",
      }}
    >
      <div
        class="cursor-move h-8 w-full absolute top-0 left-0 rounded-t-2xl"
        onMouseDown={onDragStart}
      />

      <HiOutlineMinus
        class="absolute top-1 right-3 text-2xl text-white/20 hover:text-white/50 z-30"
        onClick={(e) => {
          e.stopPropagation();
          props.closeWindow();
        }}
      />

      <div class="pt-10 px-4 pb-4">
        {props.children}
      </div>
    </div>
  );
};

export default FloatingWindow;
