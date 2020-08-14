import React, { ComponentType, FC, useRef, useEffect } from "react";
import {
  Heading,
  Stack,
  Box,
  FormLabel,
  Flex,
  Checkbox,
  IconButton
} from "@chakra-ui/core";
import {
  atom,
  atomFamily,
  RecoilRoot,
  useRecoilValue,
  useRecoilState,
  useSetRecoilState,
  RecoilState,
  useRecoilTransactionObserver_UNSTABLE,
  Snapshot
} from "recoil";
import { onDimensions } from "./dimensions";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";

const MotionBox = motion.custom(Box);

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

interface InitOptions {
  allowEditing?: boolean;
}

export const init = (
  defaults?: Defaults,
  { allowEditing = true }: InitOptions = {}
) => {
  const keyInfo: Record<string, Set<string>> = {};
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
  const editModeAtom = atom({
    key: "edit-mode",
    default: false
  });
  const nullAtom = atom({
    key: "null",
    default: null
  });

  const createControls = <Controls extends {}>(
    options: CreateControlsOptions<Controls>
  ) => {
    type Overrides = {
      [K in keyof Controls]: boolean;
    };
    const key = options.key;
    if (!keyInfo[key]) {
      keyInfo[key] = new Set<string>();
    }
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
      keyInfo[key].add(options.subkey);
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
          selected.subkey === options.subkey &&
          allowEditing
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
      }, [selected.key, selected.subkey, allowEditing]);

      const attach = (el: HTMLElement) => {
        if (!allowEditing) {
          return null;
        }
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
        values: values as Controls
      };
    };

    return useControls;
  };

  const Exporter = () => {
    const snapshotRef = useRef<Snapshot>();
    useRecoilTransactionObserver_UNSTABLE(({ snapshot }) => {
      snapshotRef.current = snapshot;
    });

    const handleClick = () => {
      if (snapshotRef.current) {
        const obj: any = {};
        Object.keys(keyInfo).forEach(key => {
          obj[key] = {};
          keyInfo[key].forEach(subkey => {
            obj[key][subkey] = {
              values: (snapshotRef.current as Snapshot).getLoadable(
                families[key](subkey)
              ).contents,
              overrides: (snapshotRef.current as Snapshot).getLoadable(
                overridesFamilies[key](subkey)
              ).contents
            };
          });
        });
        const blob = new Blob([JSON.stringify(obj)], {
          type: "application/json;charset=utf-8"
        });
        saveAs(blob, "controls.json");
      }
    };

    return (
      <IconButton
        onClick={handleClick}
        aria-label="Download"
        size="md"
        icon="download"
        variant="ghost"
      />
    );
  };

  const ToggleEditMode = () => {
    const [editMode, setEditMode] = useRecoilState(editModeAtom);

    if (!allowEditing) {
      return null;
    }

    return (
      <Box position="fixed" bottom="16px" right="16px">
        {editMode && (
          <IconButton
            variantColor="teal"
            onClick={() => setEditMode(false)}
            aria-label="OK"
            size="md"
            icon={"check"}
          />
        )}
        {!editMode && (
          <IconButton
            variantColor="teal"
            onClick={() => setEditMode(true)}
            aria-label="Edit"
            size="md"
            icon={"edit"}
          />
        )}
      </Box>
    );
  };

  const ControlsPanel: FC = () => {
    const { key, subkey } = useRecoilValue(selectedAtom);
    const editMode = useRecoilValue(editModeAtom);
    const valuesAtom = !key && !subkey ? nullAtom : families[key](subkey);
    const overridesAtom =
      !key && !subkey ? nullAtom : overridesFamilies[key](subkey);
    const [values, setValues] = useRecoilState(valuesAtom);
    const [overrides, setOverrides] = useRecoilState(overridesAtom);

    const definitions = definitionsMap[key] || {};

    if (!allowEditing) {
      return null;
    }

    return (
      <MotionBox
        animate={{
          right: editMode ? 0 : -300
        }}
        position="fixed"
        top={0}
        bottom={0}
        width={300}
        bg="white"
        p={4}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <Flex justify="space-between">
          <Stack spacing="2">
            <Heading size="lg">Controls</Heading>
            <Heading size="xs" color="gray.500">
              {!!key && !!subkey ? `${key} > ${subkey}` : ""}
            </Heading>
          </Stack>
          <Exporter />
        </Flex>
        <Stack spacing={2} py={4}>
          {!Object.keys(definitions).length && <Box>No selection.</Box>}
          {Object.keys(definitions).map(fieldName => {
            const Field = definitionsMap[key][fieldName];
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
      </MotionBox>
    );
  };

  const Clickaway = () => {
    const setSelected = useSetRecoilState(selectedAtom);

    useEffect(() => {
      if (allowEditing) {
        const fn = (e: any) => {
          setSelected({ key: "", subkey: "" });
        };
        window.addEventListener("click", fn);
        return () => window.removeEventListener("click", fn);
      }
    }, []);

    return null;
  };

  const SelectedIndicator = () => {
    const [dimensions, setDimensions] = useRecoilState(dimensionsAtom);
    const { key, subkey } = useRecoilValue(selectedAtom);
    const editMode = useRecoilValue(editModeAtom);

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

    if (!families[key] || !editMode) {
      return null;
    }

    return (
      <MotionBox
        initial={{ opacity: -10, scale: 0 }}
        animate={{
          height: dimensions.height,
          width: dimensions.width,
          top: dimensions.top,
          left: dimensions.left,
          opacity: 1,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 800,
            damping: 70
          }
        }}
        position="fixed"
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

  const ControlsProvider: FC = ({ children }) => {
    return (
      <RecoilRoot>
        {children}
        <SelectedIndicator />
        <ControlsPanel />
        <ToggleEditMode />
        <Clickaway />
      </RecoilRoot>
    );
  };

  return {
    createControls,
    ControlsProvider
  };
};
