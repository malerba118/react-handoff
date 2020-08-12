import { Box } from "@chakra-ui/core";
import * as React from "react";
import { createControls } from "./controls";
import { BooleanField } from "./react-handoff";
import "./styles.css";

const useControls = createControls({
  key: "Box",
  definitions: {
    rounded: BooleanField
  }
});

function App() {
  const { attach, values } = useControls({
    subkey: "card"
  });

  return (
    <Box
      ref={attach}
      rounded={values.rounded ? 8 : 0}
      h={200}
      w={200}
      bg="tomato"
    >
      Test
    </Box>
  );
}

export default App;
