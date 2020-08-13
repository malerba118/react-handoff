import { init } from "./react-handoff";

const { createControls, ControlsProvider } = init({
  Box: {
    card: {
      bg: "gray.200"
    }
  }
});

export { createControls, ControlsProvider };
