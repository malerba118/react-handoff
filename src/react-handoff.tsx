import React, { ComponentType, FC, useRef, useEffect } from "react";
import {
  Heading,
  Stack,
  Box,
  FormLabel,
  Flex,
  Checkbox
} from "@chakra-ui/core";
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
  [K in keyof Controls]: Field<any>;
};

export interface CreateControlsOptions<Controls> {
  key: string;
  definitions: ControlDefinitions<Controls>;
}

type Defaults = Record<string, Record<string, { values: any; overrides: any }>>;

export const init = (defaults?: Defaults) => {
  const families: Record<string, AtomFamily> = {};
  const overridesFamilies: Record<string, AtomFamily> = {};
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
    type Overrides = {
      [K in keyof Controls]: boolean;
    };
    const key = options.key;
    const definitions = options.definitions;
    const family = atomFamily<Controls, string>({
      key: `${key}-values`,
      default: subkey => {
        if (
          !defaults ||
          !defaults[key] ||
          !defaults[key][subkey] ||
          !defaults[key][subkey].values
        ) {
          return {};
        } else {
          return defaults[key][subkey].values;
        }
      }
    });

    const overridesFamily = atomFamily<Overrides, string>({
      key: `${key}-overrides`,
      default: subkey => {
        if (
          !defaults ||
          !defaults[key] ||
          !defaults[key][subkey] ||
          !defaults[key][subkey].overrides
        ) {
          return {};
        } else {
          return defaults[key][subkey].overrides;
        }
      }
    });

    families[key] = family;
    overridesFamilies[key] = overridesFamily;
    definitionsMap[key] = definitions;

    interface UseControlsOptions {
      subkey: string;
      passthrough?: Partial<Controls>;
    }

    const useControls = (options: UseControlsOptions) => {
      const ref = useRef<HTMLElement>();
      const [selected, setSelected] = useRecoilState(selectedAtom);
      const setDimensions = useSetRecoilState(dimensionsAtom);
      let values: any = useRecoilValue(family(options.subkey));
      const overrides: any = useRecoilValue(overridesFamily(options.subkey));
      const select = () => setSelected({ key, subkey: options.subkey });
      const passthrough: any = options.passthrough || {};

      values = { ...values };

      Object.keys(definitions).forEach(key => {
        if (!overrides[key]) {
          values[key] =
            passthrough[key] !== undefined ? passthrough[key] : values[key];
        } else {
          values[key] = values[key];
        }
      });

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
        values: values as Controls
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
    const overridesAtom = overridesFamilies[keys.key](keys.subkey);
    const [values, setValues] = useRecoilState(valuesAtom);
    const [overrides, setOverrides] = useRecoilState(overridesAtom);

    console.log("values", values);
    console.log("overrides", overrides);

    return (
      <Box
        position="fixed"
        top={0}
        right={0}
        bottom={0}
        width={300}
        bg="gray.100"
        p={4}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <Stack spacing="2">
          <Heading size="lg">Controls</Heading>
          <Heading size="xs" color="gray.500">
            {keys.key} > {keys.subkey}
          </Heading>
        </Stack>
        <Stack spacing={2} py={4}>
          {Object.keys(definitionsMap[keys.key]).map(fieldName => {
            const Field = definitionsMap[keys.key][fieldName];
            const value = values[fieldName];
            return (
              <Stack key={fieldName}>
                <Flex justify="space-between">
                  <FormLabel htmlFor={fieldName}>{fieldName}</FormLabel>
                  <Checkbox
                    placeholder="Override"
                    isChecked={!!overrides[fieldName]}
                    onChange={e => {
                      setOverrides((prev: any) => ({
                        ...prev,
                        [fieldName]: e.target.checked
                      }));
                    }}
                  >
                    Important
                  </Checkbox>
                </Flex>
                <Field
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
        <SelectedIndicator />
        <ControlsPanel />
        <Listeners />
      </RecoilRoot>
    );
  };

  return {
    createControls,
    ControlsProvider
  };
};
