import { Badge, BadgeProps } from "@chakra-ui/core";
import React, { FC } from "react";
import { createControls } from "./controls";
import { select } from "./react-handoff/fields";
import {
  colorValues,
  spaceValues,
  sizeValues,
  colorCategoryValues
} from "./constants";

interface BadgeControls {
  variantColor: BadgeProps["variantColor"];
  padding: BadgeProps["padding"];
  margin: BadgeProps["margin"];
  fontSize: BadgeProps["fontSize"];
}

const useControls = createControls<BadgeControls>({
  key: "Badge",
  definitions: {
    variantColor: select(colorCategoryValues),
    padding: select(spaceValues),
    margin: select(spaceValues),
    fontSize: select(sizeValues)
  }
});

interface ControlledBadgeProps extends BadgeProps {
  controlsKey: string;
}

const ControlledBadge: FC<ControlledBadgeProps> = ({
  controlsKey,
  variantColor,
  padding,
  margin,
  fontSize,
  ...otherProps
}) => {
  const { attach, values } = useControls({
    subkey: controlsKey,
    passthrough: {
      variantColor,
      padding,
      margin,
      fontSize
    }
  });

  console.log(values);

  return (
    <Badge
      {...otherProps}
      ref={attach}
      variantColor={values.variantColor}
      padding={values.padding}
      margin={values.margin}
      fontSize={values.fontSize}
    />
  );
};

export default ControlledBadge;
