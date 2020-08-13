import { init } from "./react-handoff";
import defaults from "./controls.json";

const { createControls, ControlsProvider } = init(defaults);

export { createControls, ControlsProvider };
