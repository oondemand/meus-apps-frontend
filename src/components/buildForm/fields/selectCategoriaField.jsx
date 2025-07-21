import { Select } from "chakra-react-select";
import { useQuery } from "@tanstack/react-query";
import { Box, Text } from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import { useMemo } from "react";
import { createChakraStyles } from "./chakraStyles";
import { ListaOmieService } from "../../../service/lista-omie";
import { useConfirmation } from "../../../hooks/useConfirmation";

export const SelectCategoriaField = ({ ...props }) => {
  const { data } = useQuery({
    queryKey: ["listar-categorias"],
    queryFn: async () =>
      ListaOmieService.getListByCode({ cod: "listar-categorias" }),
    staleTime: Infinity,
  });

  const options = useMemo(
    () =>
      data?.lista?.map((e) => ({
        value: e?.codigo,
        label: `${e?.descricao} ${e?.codigo}`,
      })),
    [data]
  );

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
        <Text color="gray.700" fontSize="sm">
          {props.label}
        </Text>
        <Controller
          name={props.field.name}
          control={props.methods.control}
          render={({ field }) => (
            <Select
              onKeyDown={handleKeyDown}
              fontSize="sm"
              size="sm"
              disabled={props?.disabled}
              value={options?.find((item) => item?.value == field?.value) ?? ""}
              name={field.name}
              onBlur={onBlur}
              onChange={(e) => field.onChange(e?.value ?? "")}
              cacheOptions
              isClearable
              options={options}
              chakraStyles={createChakraStyles({
                control: (base) => ({
                  display: "flex",
                  border: "none",
                  outline: "none !important",
                  padding: 0,
                  height: "36px",
                  borderRadius: "0px",
                  borderBottom: "1px solid",
                  borderBottomColor: "#E2E8F0",
                  w: "300px",
                }),
              })}
            />
          )}
        />
      </Box>
      <Text pt="3" fontSize="xs" color="red.400">
        {props.error}
      </Text>
    </Box>
  );
};
