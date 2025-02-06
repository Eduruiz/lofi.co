import { Component, createSignal, ParentProps, onCleanup } from "solid-js";
import { HiOutlineMinus } from "solid-icons/hi";

type Props = {
  width: number;
  height: number;
  closeWindow: () => void;
} & ParentProps;

const FloatingWindow: Component<Props> = (props) => {
  // Starting position of the window
  const [x, setX] = createSignal(20);
  const [y, setY] = createSignal(100);

  // Variables to store the initial mouse position and window position when drag starts.
  let startX = 0;
  let startY = 0;
  let initialX = 20;
  let initialY = 100;
  let dragging = false;

  // When the user presses the mouse button on the header, begin dragging.
  const onDragStart = (e: MouseEvent) => {
    // Only left-click initiates dragging
    if (e.button !== 0) return;
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialX = x();
    initialY = y();
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);
  };

  // When the mouse moves, update the window position based on the difference.
  const onDragMove = (e: MouseEvent) => {
    if (!dragging) return;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    setX(initialX + deltaX);
    setY(initialY + deltaY);
  };

  // When the mouse is released, end dragging.
  const onDragEnd = () => {
    dragging = false;
    window.removeEventListener("mousemove", onDragMove);
    window.removeEventListener("mouseup", onDragEnd);
  };

  // Cleanup event listeners if the component is unmounted mid-drag.
  onCleanup(() => {
    window.removeEventListener("mousemove", onDragMove);
    window.removeEventListener("mouseup", onDragEnd);
  });

  return (
    <div
      class="z-20 fixed bg-bgd-100 border border-white/20 backdrop-blur-[30px] rounded-2xl overflow-y-scroll"
      style={{
        width: `${props.width}px`,
        height: `${props.height}px`,
        top: `${y()}px`,
        left: `${x()}px`,
      }}
    >
      {/* Drag Handle: an invisible header area to grab and drag the window */}
      <div
        class="cursor-move h-8 w-full absolute top-0 left-0 rounded-t-2xl"
        onMouseDown={onDragStart}
      />

      {/* Close Button */}
      <HiOutlineMinus
        class="absolute top-1 right-3 text-2xl text-white/20 hover:text-white/50 z-30"
        onClick={(e) => {
          // Stop the drag from starting when clicking on the close icon.
          e.stopPropagation();
          props.closeWindow();
        }}
      />

      {/* Content */}
      <div class="pt-10 px-4 pb-4">
        {props.children}
      </div>
    </div>
  );
};

export default FloatingWindow;
