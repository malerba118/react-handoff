import { init } from "./react-handoff";
import defaults from "./controls.json";

const { createControls, ControlsProvider } = init(defaults, {
  allowEditing: process.env.NODE_ENV === "development"
});

export { createControls, ControlsProvider };
