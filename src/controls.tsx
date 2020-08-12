import { init } from "./react-handoff";

const { createControls, ControlsProvider } = init({
  Box: {
    card: {
      rounded: true
    }
  }
});

export { createControls, ControlsProvider };
