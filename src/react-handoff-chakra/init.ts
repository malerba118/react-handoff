import { init as baseInit } from "../react-handoff";
import { createBadge } from "./badge";
import { createBox } from "./box";
import { createImage } from "./image";

type BaseInitParams = Parameters<typeof baseInit>;
type BaseInitReturn = ReturnType<typeof baseInit>;

export const init = (...args: BaseInitParams) => {
  const { createControls, ControlsProvider } = baseInit(...args);

  return {
    createControls,
    ControlsProvider,
    components: {
      Badge: createBadge(createControls),
      Box: createBox(createControls),
      Image: createImage(createControls)
    }
  };
};
