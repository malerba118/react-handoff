import {
  Badge as ChakraBadge,
  BadgeProps as ChakraBadgeProps
} from "@chakra-ui/core";
import React, { FC } from "react";
import { CreateControls } from "../react-handoff";
import { select } from "../react-handoff/fields";
import { spaceValues, sizeValues, colorCategoryValues } from "./constants";

interface BadgeControls {
  variantColor: ChakraBadgeProps["variantColor"];
  padding: ChakraBadgeProps["padding"];
  margin: ChakraBadgeProps["margin"];
  fontSize: ChakraBadgeProps["fontSize"];
}

export const createBadge = (createControls: CreateControls) => {
  const useControls = createControls<BadgeControls>({
    key: "Badge",
    definitions: {
      variantColor: select(colorCategoryValues),
      padding: select(spaceValues),
      margin: select(spaceValues),
      fontSize: select(sizeValues)
    }
  });

  interface BadgeProps extends ChakraBadgeProps {
    controlsKey?: string;
  }

  interface ControlledBadgeProps extends ChakraBadgeProps {
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

    return (
      <ChakraBadge
        {...otherProps}
        ref={attach}
        variantColor={values.variantColor}
        padding={values.padding}
        margin={values.margin}
        fontSize={values.fontSize}
      />
    );
  };

  const Badge: FC<BadgeProps> = props => {
    if (props.controlsKey) {
      return <ControlledBadge {...(props as ControlledBadgeProps)} />;
    }
    return <ChakraBadge {...props} />;
  };

  return Badge;
};
