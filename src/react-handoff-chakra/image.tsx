import {
  Image as ChakraImage,
  ImageProps as ChakraImageProps
} from "@chakra-ui/core";
import React, { FC } from "react";
import { select } from "../react-handoff/fields";
import { CreateControls } from "../react-handoff";

interface ImageControls {
  objectFit: ChakraImageProps["objectFit"];
}

export const createImage = (createControls: CreateControls) => {
  const useControls = createControls<ImageControls>({
    key: "Image",
    definitions: {
      objectFit: select(["fill", "contain", "cover"])
    }
  });

  interface ImageProps extends ChakraImageProps {
    controlsKey?: string;
  }

  interface ControlledImageProps extends ChakraImageProps {
    controlsKey: string;
  }

  const ControlledImage: FC<ControlledImageProps> = ({
    controlsKey,
    objectFit,
    ...otherProps
  }) => {
    const { attach, values } = useControls({
      subkey: controlsKey,
      passthrough: {
        objectFit
      }
    });

    return (
      <ChakraImage {...otherProps} ref={attach} objectFit={values.objectFit} />
    );
  };

  const Image: FC<ImageProps> = props => {
    if (props.controlsKey) {
      return <ControlledImage {...(props as ControlledImageProps)} />;
    }
    return <ChakraImage {...props} />;
  };

  return Image;
};
