import React, { ComponentType, FC, useRef, useEffect } from "react";
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
import { onDimensions } from "./dimensions";

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
  const dimensionsAtom = atom({
    key: "dimensions",
    default: {
      top: 0,
      left: 0,
      height: 0,
      width: 0
    }
  });

  const createControls = <Controls extends {}>(
    options: CreateControlsOptions<Controls>
  ) => {
    const key = options.key;
    const family = atomFamily<Controls, string>({
      key,
      default: subkey => {
        if (!defaults || !defaults[key] || !defaults[key][subkey]) {
          return {};
        } else {
          return defaults[key][subkey];
        }
      }
    });

    families[key] = family;
    definitionsMap[key] = options.definitions;

    const useControls = (options: UseControlsOptions) => {
      const ref = useRef<HTMLElement>();
      const [selected, setSelected] = useRecoilState(selectedAtom);
      const setDimensions = useSetRecoilState(dimensionsAtom);
      const values = useRecoilValue(family(options.subkey));
      const select = () => setSelected({ key, subkey: options.subkey });

      useEffect(() => {
        if (
          ref.current &&
          selected.key === key &&
          selected.subkey === options.subkey
        ) {
          let unsubscribeDimensionsListener = onDimensions(
            ref.current,
            setDimensions
          );
          const handleWindowResize = () => {
            if (ref.current) {
              setDimensions(ref.current.getBoundingClientRect());
            }
          };
          window.addEventListener("resize", handleWindowResize);
          const unsubscribeWindowResizeListener = () => {
            window.removeEventListener("resize", handleWindowResize);
          };
          return () => {
            unsubscribeDimensionsListener();
            unsubscribeWindowResizeListener();
          };
        }
      }, [selected.key, selected.subkey]);

      const attach = (el: HTMLElement) => {
        const handler = (e: MouseEvent) => {
          setSelected({ key, subkey: options.subkey });
          e.stopPropagation();
          e.preventDefault();
        };
        if (el && el !== ref.current) {
          if (ref.current) {
            ref.current.removeEventListener("click", handler);
          }
          el.addEventListener("click", handler);
          ref.current = el;
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
      <Box
        position="fixed"
        top={0}
        right={0}
        bottom={0}
        width={300}
        bg="gray.200"
        p={4}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <Heading size="lg">Controls</Heading>
        <Heading size="sm">
          {keys.key} > {keys.subkey}
        </Heading>
        <Stack spacing={2} py={2}>
          {Object.keys(definitionsMap[keys.key]).map(fieldName => {
            const Field = definitionsMap[keys.key][fieldName];
            const value = values[fieldName];
            return (
              <Stack>
                <FormLabel htmlFor={fieldName}>{fieldName}</FormLabel>
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
      </Box>
    );
  };

  const Listeners = () => {
    const setSelected = useSetRecoilState(selectedAtom);

    useEffect(() => {
      const fn = (e: any) => {
        setSelected({ key: "", subkey: "" });
      };
      window.addEventListener("click", fn);
      return () => window.removeEventListener("click", fn);
    }, []);

    return null;
  };

  const SelectedIndicator = () => {
    const [dimensions, setDimensions] = useRecoilState(dimensionsAtom);
    const { key, subkey } = useRecoilValue(selectedAtom);

    useEffect(() => {
      if (!key && !subkey) {
        setDimensions({
          top: 0,
          left: 0,
          width: 0,
          height: 0
        });
      }
    }, [key, subkey]);

    if (!families[key]) {
      return null;
    }
    return (
      <Box
        position="fixed"
        w={dimensions.width}
        h={dimensions.height}
        top={dimensions.top}
        left={dimensions.left}
        border="4px"
        borderStyle="dashed"
        borderColor="teal.400"
        onClick={e => {
          e.stopPropagation();
        }}
        pointerEvents="none"
      />
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
        <SelectedIndicator />
        <Listeners />
      </RecoilRoot>
    );
  };

  return {
    createControls,
    ControlsProvider
  };
};
