import React, { FC } from "react";
import { Switch, Select } from "@chakra-ui/core";
import { optionalCallExpression } from "@babel/types";

export interface BooleanFieldProps {
  value: boolean;
  onUpdate: (value: boolean) => void;
}

export const BooleanField: FC<BooleanFieldProps> = props => {
  return (
    <Switch
      color="teal"
      size="lg"
      onChange={(e: any) => props.onUpdate(e.target.checked)}
      isChecked={props.value}
    />
  );
};

export interface SelectFieldProps {
  value: string;
  onUpdate: (value: string) => void;
}

export const select = (options: string[]) => {
  const SelectField: FC<SelectFieldProps> = props => {
    return (
      <Select
        placeholder="None"
        value={props.value}
        onChange={e => {
          props.onUpdate(e.target.value);
        }}
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    );
  };
  return SelectField;
};
