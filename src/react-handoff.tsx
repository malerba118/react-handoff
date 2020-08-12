import React, { ComponentType, FC, useRef } from "react";
import { Switch, Heading, Stack, Box, FormLabel } from "@chakra-ui/core";
import {
  atom,
  atomFamily,
  RecoilRoot,
  useRecoilValue,
  useRecoilState,
  useSetRecoilState,
  RecoilState
} from "recoil";

type AtomFamily = (subkey: string) => RecoilState<any>;

export interface FieldProps<T> {
  value: T;
  onUpdate: (val: T) => void;
}

export type Field<T> = ComponentType<FieldProps<T>>;

export type ControlDefinitions<Controls> = {
  [K in keyof Controls]: Field<Controls[K]>;
};

export interface CreateControlsOptions<Controls> {
  key: string;
  definitions: ControlDefinitions<Controls>;
}

export interface UseControlsOptions {
  subkey: string;
}

export const init = (defaults?: Record<string, Record<string, any>>) => {
  const families: Record<string, AtomFamily> = {};
  const definitionsMap: Record<string, ControlDefinitions<any>> = {};
  const selectedAtom = atom({
    key: "selected",
    default: {
      key: "",
      subkey: ""
    }
  });

  const createControls = <Controls extends {}>(
    options: CreateControlsOptions<Controls>
  ) => {
    const key = options.key;
    const family = atomFamily<Controls, string>({
      key,
      default: subkey => {
        if (!defaults) {
          return {};
        } else {
          return defaults[key][subkey];
        }
      }
    });

    families[key] = family;
    definitionsMap[key] = options.definitions;

    const useControls = (options: UseControlsOptions) => {
      const ref = useRef<HTMLElement | null>();
      const setSelected = useSetRecoilState(selectedAtom);
      const values = useRecoilValue(family(options.subkey));
      const select = () => setSelected({ key, subkey: options.subkey });

      const attach = (el: HTMLElement) => {
        ref.current = el;
        if (el) {
          el.addEventListener("click", (e: any) => {
            if (!e._reactHandoffStopPropagation) {
              setSelected({ key, subkey: options.subkey });
              e._reactHandoffStopPropagation = true;
            }
          });
        }
      };

      return {
        attach,
        select,
        values
      };
    };

    return useControls;
  };

  interface PanelProps {
    keys: {
      key: string;
      subkey: string;
    };
  }

  const Panel: FC<PanelProps> = ({ keys }) => {
    const valuesAtom = families[keys.key](keys.subkey);
    const [values, setValues] = useRecoilState(valuesAtom);

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "300px",
          borderLeft: "1px solid #ccc",
          padding: 16
        }}
      >
        <Heading size="lg">Controls</Heading>
        <Heading size="sm">
          {keys.key} > {keys.subkey}
        </Heading>
        <Stack spacing={2} py={2}>
          {Object.keys(values).map(fieldName => {
            const Field = definitionsMap[keys.key][fieldName];
            const value = values[fieldName];
            return (
              <Stack>
                <FormLabel htmlFor="email">Email address</FormLabel>
                <Field
                  key={fieldName}
                  value={value}
                  onUpdate={val =>
                    setValues((prev: any) => ({
                      ...prev,
                      [fieldName]: val
                    }))
                  }
                />
              </Stack>
            );
          })}
        </Stack>
      </div>
    );
  };

  const ControlsPanel = () => {
    const { key, subkey } = useRecoilValue(selectedAtom);
    if (!families[key]) {
      return null;
    }
    return <Panel keys={{ key, subkey }} />;
  };

  const ControlsProvider: FC = ({ children }) => {
    return (
      <RecoilRoot>
        {children}
        <ControlsPanel />
      </RecoilRoot>
    );
  };

  return {
    createControls,
    ControlsProvider
  };
};

interface BooleanFieldProps {
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
