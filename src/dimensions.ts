import ResizeObserver from "resize-observer-polyfill";

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type DimensionsCallback = (contentRect: Rect) => void;

export const onDimensions = (el: HTMLElement, callback: DimensionsCallback) => {
  const observer = new ResizeObserver(entries => {
    if (entries[0]) {
      callback(entries[0].contentRect);
    }
  });
  observer.observe(el);
};
