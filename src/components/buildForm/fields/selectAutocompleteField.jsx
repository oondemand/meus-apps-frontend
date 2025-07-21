import { Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";

import React from "react";
import { Select } from "chakra-react-select";
import { autoCompleteSelectInputStyles } from "../../../styles/autoCompleteSelectInputStyles";
import { useConfirmation } from "../../../hooks/useConfirmation";

export const SelectAutoCompleteField = ({
  w,
  containerStyles,
  selectStyles,
  options,
  ...props
}) => {
  const [value, setValue] = useState("");
  const { requestConfirmation } = useConfirmation();

  const onblur = async (ev) => {
    if (value !== "" && value !== props?.data?.[props.accessorKey]) {
      if (props?.confirmAction) {
        props.confirmationRefFn.current = async () => {
          const { action } = await requestConfirmation({
            title: props.confirmAction?.title,
            description: props?.confirmAction?.description,
          });

          action === "canceled" &&
            props?.setValue(props?.accessorKey, props.initialValue);

          return action;
        };
      }

      await props.onBlurFn({ body: { [props.accessorKey]: value.value } });
      props.data && (props.data[props.accessorKey] = value.value);
      return;
    }
  };

  const inicializarValue = () => {
    const value = options?.find((e) => e?.value === props?.initialValue);
    setValue(value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event?.preventDefault();
      inicializarValue();
    }
  };

  useEffect(() => {
    inicializarValue();
  }, [props?.initialValue]);

  return (
    <Box w={w}>
      <Select
        onKeyDown={handleKeyDown}
        defaultInputValue={value}
        variant="subtle"
        placeholder={`Selecione um ${props.label?.toLowerCase()}`}
        options={options}
        onBlur={onblur}
        value={value}
        onChange={setValue}
        chakraStyles={autoCompleteSelectInputStyles}
        disabled={props.disabled ?? !props.data}
      />
    </Box>
  );
};
