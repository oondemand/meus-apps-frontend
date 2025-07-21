import {
  Input,
  Box,
  Text,
  Flex,
  Clipboard,
  IconButton,
} from "@chakra-ui/react";
import { useConfirmation } from "../../../hooks/useConfirmation";
import { nanoid } from "nanoid";
import { RefreshCcw } from "lucide-react";

const generateAppKey = () => `oon_${nanoid(10)}`;

export const AppKeyGeneratorField = ({ inputStyle, ...props }) => {
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
      <Flex gap="2.5" alignItems="end">
        <Input
          {...props.field}
          defaultValue={generateAppKey()}
          onBlur={onBlur}
          disabled={props?.disabled}
          size="sm"
          fontSize="sm"
          variant="flushed"
          onKeyDown={handleKeyDown}
          mr="3"
        />
        <Clipboard.Root value={props.watch(props?.accessorKey)}>
          <Clipboard.Trigger asChild>
            <IconButton size="sm" variant="subtle" rounded="md">
              <Clipboard.Indicator />
            </IconButton>
          </Clipboard.Trigger>
        </Clipboard.Root>
        <IconButton
          size="sm"
          variant="subtle"
          rounded="md"
          onClick={() => props.setValue(props?.accessorKey, generateAppKey())}
        >
          <RefreshCcw />
        </IconButton>
      </Flex>
      <Text mt="0.5" fontSize="xs" color="red.400">
        {props.error}
      </Text>
    </Box>
  );
};
