import { Box as ChakraBox, BoxProps as ChakraBoxProps } from "@chakra-ui/core";
import React, { FC } from "react";
import { CreateControls } from "../react-handoff";
import { select } from "../react-handoff/fields";
import { colorValues, spaceValues, sizeValues } from "./constants";

interface BoxControls {
  bg: ChakraBoxProps["bg"];
  padding: ChakraBoxProps["padding"];
  margin: ChakraBoxProps["margin"];
  fontSize: ChakraBoxProps["fontSize"];
  color: ChakraBoxProps["color"];
}

export const createBox = (createControls: CreateControls) => {
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

  interface BoxProps extends ChakraBoxProps {
    controlsKey?: string;
  }

  interface ControlledBoxProps extends ChakraBoxProps {
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
      <ChakraBox
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

  const Box: FC<BoxProps> = props => {
    if (props.controlsKey) {
      return <ControlledBox {...(props as ControlledBoxProps)} />;
    }
    return <ChakraBox {...props} />;
  };

  return Box;
};
