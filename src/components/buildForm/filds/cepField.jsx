import { Input, Box, Text } from "@chakra-ui/react";
import { useHookFormMask } from "use-mask-input";
import { useConfirmation } from "../../../hooks/useConfirmation";

export const CepField = ({ ...props }) => {
  const registerWithMask = useHookFormMask(props.methods.register);

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
      <Text fontSize="sm" color="gray.700">
        {props.label}
      </Text>
      <Input
        disabled={props.disabled}
        fontSize="sm"
        size="sm"
        variant="flushed"
        {...registerWithMask(props.accessorKey, "99999-999")}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
      />
      <Text mt="0.5" fontSize="xs" color="red.400">
        {props.error}
      </Text>
    </Box>
  );
};
