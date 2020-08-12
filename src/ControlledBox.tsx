import { Box, BoxProps } from "@chakra-ui/core";
import React, { FC } from "react";
import { createControls } from "./controls";
import { select } from "./fields";
import "./styles.css";

const useControls = createControls({
  key: "Box",
  definitions: {
    bg: select(["gray.100", "gray.200", "gray.300"])
  }
});

interface ControlledBoxProps extends BoxProps {
  controlsKey: string;
}

const ControlledBox: FC<ControlledBoxProps> = ({
  controlsKey,
  ...otherProps
}) => {
  const { attach, values } = useControls({
    subkey: controlsKey
  });

  return <Box {...otherProps} ref={attach} bg={otherProps.bg || values.bg} />;
};

export default ControlledBox;
