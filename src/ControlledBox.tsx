import { Box, BoxProps } from "@chakra-ui/core";
import React, { FC } from "react";
import { createControls } from "./controls";
import { select } from "./react-handoff/fields";
import { colorValues, spaceValues, sizeValues } from "./constants";
import "./styles.css";

interface BoxControls {
  bg: BoxProps["bg"];
  p: BoxProps["p"];
  fontSize: BoxProps["fontSize"];
}

const useControls = createControls<BoxControls>({
  key: "Box",
  definitions: {
    bg: select(colorValues),
    p: select(spaceValues),
    fontSize: select(sizeValues)
  }
});

interface ControlledBoxProps extends BoxProps {
  controlsKey: string;
}

const ControlledBox: FC<ControlledBoxProps> = ({
  controlsKey,
  bg,
  p,
  fontSize,
  ...otherProps
}) => {
  const { attach, values } = useControls({
    subkey: controlsKey,
    passthrough: {
      bg,
      p,
      fontSize
    }
  });

  return (
    <Box
      {...otherProps}
      ref={attach}
      bg={values.bg}
      p={values.p}
      fontSize={values.fontSize}
    />
  );
};

export default ControlledBox;
