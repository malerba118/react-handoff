import { init } from "./react-handoff-chakra";
import defaults from "./controls.json";

const { createControls, ControlsProvider, components } = init(defaults, {
  allowEditing: process.env.NODE_ENV === "development"
});

export { createControls, ControlsProvider, components };
