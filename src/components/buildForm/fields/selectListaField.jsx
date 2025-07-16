import { Select } from "chakra-react-select";
import { useQuery } from "@tanstack/react-query";
import { ListaService } from "../../../service/listas";
import { Box, Text } from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import { createChakraStyles } from "./chakraStyles";
import { useConfirmation } from "../../../hooks/useConfirmation";

export const SelectListaField = ({ cod, ...props }) => {
  const { data } = useQuery({
    queryFn: async () => ListaService.getListByCode({ cod }),
    queryKey: [`list-${cod}`],
    staleTime: 1000 * 60 * 10, //10 minutos
  });

  const options = data?.lista?.data?.map((e) => ({
    label: e?.valor,
    value: e?.valor,
  }));

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
      <Box>
        <Text fontSize="sm">{props.label}</Text>
        <Controller
          name={props.field.name}
          control={props.methods.control}
          render={({ field }) => {
            return (
              <Select
                onKeyDown={handleKeyDown}
                fontSize="sm"
                size="sm"
                disabled={props?.disabled}
                value={
                  options?.find(
                    (item) =>
                      item?.value?.toLowerCase() == field?.value?.toLowerCase()
                  ) ?? ""
                }
                name={field.name}
                onBlur={onBlur}
                onChange={(e) => {
                  field.onChange(e?.value ?? "");
                }}
                cacheOptions
                isClearable
                options={options}
                chakraStyles={createChakraStyles()}
              />
            );
          }}
        />
      </Box>
      <Text pt="3" fontSize="xs" color="red.400">
        {props.error}
      </Text>
    </Box>
  );
};
