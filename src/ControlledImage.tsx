import { Image, ImageProps } from "@chakra-ui/core";
import React, { FC } from "react";
import { createControls } from "./controls";
import { select } from "./react-handoff/fields";

interface ImageControls {
  objectFit: ImageProps["objectFit"];
}

const useControls = createControls<ImageControls>({
  key: "Image",
  definitions: {
    objectFit: select(["fill", "contain", "cover"])
  }
});

interface ControlledImageProps extends ImageProps {
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

  return <Image {...otherProps} ref={attach} objectFit={values.objectFit} />;
};

export default ControlledImage;
