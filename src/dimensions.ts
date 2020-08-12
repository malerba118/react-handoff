import ResizeObserver from "resize-observer-polyfill";

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type DimensionsCallback = (contentRect: Rect) => void;

export const onDimensions = (el: HTMLElement, callback: DimensionsCallback) => {
  const observer = new ResizeObserver(entries => {
    if (entries[0]) {
      callback(entries[0].target.getBoundingClientRect());
    }
  });
  observer.observe(el);
};
