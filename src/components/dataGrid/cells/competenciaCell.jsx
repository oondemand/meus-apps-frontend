import { useEffect, useState } from "react";
import { Input } from "@chakra-ui/react";
import { withMask } from "use-mask-input";
import { useConfirmation } from "../../../hooks/useConfirmation";

export const CompetenciaCell = ({ getValue, row, column, table, ...rest }) => {
  const initialValue = getValue();

  const formatValue =
    initialValue?.mes?.toString().padStart(2, "0") +
    initialValue?.ano?.toString();

  const [value, setValue] = useState("");
  const { requestConfirmation } = useConfirmation();

  const onBlur = async () => {
    if (value.replace("/", "") !== formatValue) {
      if (column.columnDef?.confirmAction) {
        const { action } = await requestConfirmation({
          title: column.columnDef?.confirmAction?.title,
          description: column.columnDef?.confirmAction?.description,
        });

        if (action === "canceled") {
          return setValue(initialValue);
        }
      }

      try {
        const competencia = value.split("/");
        await table.options.meta?.updateData({
          id: row.original._id,
          data: {
            [column.columnDef.accessorKey + ".mes"]: competencia[0],
            [column.columnDef.accessorKey + ".ano"]: competencia[1],
          },
        });
      } catch (error) {
        console.log(error);
        setValue(formatValue);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setValue(initialValue);
    }
  };

  useEffect(() => {
    setValue(formatValue ? formatValue : "");
  }, [formatValue]);

  return (
    <Input
      truncate
      variant="subtle"
      display="flex"
      fontSize="sm"
      size="xs"
      bg="transparent"
      focusRingColor="brand.500"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      ref={withMask("99/9999")}
      onKeyDown={handleKeyDown}
    />
  );
};
