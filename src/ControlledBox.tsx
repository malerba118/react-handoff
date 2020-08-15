import { Box, BoxProps } from "@chakra-ui/core";
import React, { FC } from "react";
import { createControls } from "./controls";
import { select } from "./react-handoff/fields";
import { colorValues, spaceValues, sizeValues } from "./constants";

interface BoxControls {
  bg: BoxProps["bg"];
  padding: BoxProps["padding"];
  margin: BoxProps["margin"];
  fontSize: BoxProps["fontSize"];
  color: BoxProps["color"];
}

const useControls = createControls<BoxControls>({
  key: "Box",
  definitions: {
    bg: select(colorValues),
    padding: select(spaceValues),
    margin: select(spaceValues),
    fontSize: select(sizeValues),
    color: select(colorValues)
  }
});

interface ControlledBoxProps extends BoxProps {
  controlsKey: string;
}

const ControlledBox: FC<ControlledBoxProps> = ({
  controlsKey,
  bg,
  padding,
  margin,
  fontSize,
  color,
  ...otherProps
}) => {
  const { attach, values } = useControls({
    subkey: controlsKey,
    passthrough: {
      bg,
      padding,
      margin,
      fontSize,
      color
    }
  });

  return (
    <Box
      {...otherProps}
      ref={attach}
      bg={values.bg}
      padding={values.padding}
      margin={values.margin}
      fontSize={values.fontSize}
      color={values.color}
    />
  );
};

export default ControlledBox;
