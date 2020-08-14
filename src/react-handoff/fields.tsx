import React, { FC } from "react";
import { Switch, Select } from "@chakra-ui/core";

export interface SwitchFieldProps {
  value: boolean;
  onUpdate: (value: boolean) => void;
}

// wanted to name this switch but it's a reserved word
export const switchable = () => {
  const SwitchField: FC<SwitchFieldProps> = props => {
    return (
      <Switch
        color="teal"
        size="lg"
        onChange={(e: any) => props.onUpdate(e.target.checked)}
        isChecked={props.value}
      />
    );
  };
  return SwitchField;
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
