import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SelectAutocomplete } from "../../selectAutocomplete";
import { AssistantService } from "../../../service/assistant";

export const SelectAssistantCell = ({
  getValue,
  row,
  column,
  table,
  ...rest
}) => {
  const { data } = useQuery({
    queryKey: ["listar-assistentes"],
    queryFn: AssistantService.listAssistant,
    staleTime: 1000 * 60 * 10,
  });

  const options = useMemo(
    () =>
      data?.map((e) => {
        return { value: e?._id, label: e?.nome };
      }),
    [data]
  );

  const initialValue = getValue();
  const [value, setValue] = useState("");

  const onBlur = async () => {
    if (value && value !== options.find((e) => e?.value === initialValue)) {
      if (column.columnDef?.confirmAction) {
        const { action } = await requestConfirmation({
          title: column.columnDef?.confirmAction?.title,
          description: column.columnDef?.confirmAction?.description,
        });

        if (action === "canceled") {
          return inicializarValue();
        }
      }

      try {
        await table.options.meta?.updateData({
          id: row.original._id,
          data: { [column.columnDef.accessorKey]: value.value },
        });
      } catch (error) {
        console.log(error);
        const value = options?.find(
          (e) => e?.value?.toString() === initialValue?.toString()
        );

        setValue(value);
      }
    }
  };

  const inicializarValue = () => {
    const value = options?.find(
      (e) => e?.value?.toString() === initialValue?.toString()
    );

    setValue(value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      inicializarValue();
    }
  };

  useEffect(() => {
    inicializarValue();
  }, [initialValue, data]);
  return (
    <SelectAutocomplete
      onKeyDown={handleKeyDown}
      placeholder={value}
      onBlur={onBlur}
      value={value}
      setValue={setValue}
      options={options}
    />
  );
};
