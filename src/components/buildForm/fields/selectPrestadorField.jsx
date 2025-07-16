import { Box, Text } from "@chakra-ui/react";
import { useRef } from "react";
import { api } from "../../../config/api";
import { Controller } from "react-hook-form";
import { AsyncSelect } from "chakra-react-select";
import { createChakraStyles } from "./chakraStyles";
import { useConfirmation } from "../../../hooks/useConfirmation";

export const SelectPrestadorField = ({ ...props }) => {
  const timeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  const fetchPrestadores = async (inputValue) => {
    try {
      const { data } = await api.get(`/pessoas?searchTerm=${inputValue}`, {
        signal: abortControllerRef.current.signal,
      });

      return data?.results || [];
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Erro na requisição:", error);
      }
      return [];
    }
  };

  const createPrestadorOption = (prestador) => ({
    label: `${prestador.nome} - ${prestador.documento}`,
    value: prestador._id,
  });

  const debounceRequest = (callback, delay) => {
    return new Promise((resolve) => {
      timeoutRef.current = setTimeout(async () => {
        resolve(await callback());
      }, delay);
    });
  };

  const loadOptions = async (inputValue) => {
    clearTimeout(timeoutRef.current);
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    const options = await debounceRequest(async () => {
      const prestadores = await fetchPrestadores(inputValue);
      return prestadores.map(createPrestadorOption);
    }, 1000);

    return options;
  };

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
        <Text fontSize="sm">Cliente ou prestador</Text>
        <Controller
          name={props.field.name}
          control={props.methods.control}
          render={({ field }) => {
            return (
              <AsyncSelect
                onKeyDown={handleKeyDown}
                fontSize="sm"
                size="sm"
                disabled={props?.disabled}
                key={field.name}
                value={field.value}
                name={field.name}
                onBlur={field.onBlur}
                onChange={(e) => {
                  field.onChange(e);
                }}
                cacheOptions
                isClearable
                loadOptions={loadOptions}
                defaultOptions
                variant="subtle"
                chakraStyles={createChakraStyles()}
              />
            );
          }}
        />
      </Box>
      <Text fontSize="xs" color="red.400">
        {props.error}
      </Text>
    </Box>
  );
};
