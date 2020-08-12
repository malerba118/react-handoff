import { init } from "./react-handoff";

const { createControls, ControlsProvider } = init({
  Box: {
    fooo: {
      bgg: "gray.100"
    }
  }
});

export { createControls, ControlsProvider };
