import { Box, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { NumericFormat } from "react-number-format";
import { useConfirmation } from "../../../hooks/useConfirmation";

export const CurrencyField = ({ ...props }) => {
  useEffect(() => {}, [props?.initialValue]);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event?.preventDefault();
      props?.setValue(props?.accessorKey, props.initialValue);
    }
  };

  const { requestConfirmation } = useConfirmation();

  const onBlur = async (ev) => {
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

    props.field.onBlur(ev);
  };
  return (
    <Box>
      <Box borderBottom="1px solid" borderBottomColor="gray.200">
        <Text fontSize="sm" color="gray.700">
          {props.label}
        </Text>
        <NumericFormat
          disabled={props?.disabled}
          value={props?.initialValue}
          name={props.field.name}
          onBlur={onBlur}
          onChange={props.field.onChange}
          getInputRef={props.field.ref}
          onKeyDown={handleKeyDown}
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={2}
          fixedDecimalScale
          allowNegative
          prefix="R$ "
          placeholder="R$ 0,00"
          style={{
            outline: "none",
            padding: "7px",
            backgroundColor: "transparent",
            cursor: props.disabled ? "not-allowed" : "inherit",
          }}
        />
      </Box>
      <Text mt="0.5" fontSize="xs" color="red.400">
        {props.error}
      </Text>
    </Box>
  );
};
