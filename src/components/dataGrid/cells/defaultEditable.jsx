import { useEffect, useState } from "react";
import { Input } from "@chakra-ui/react";
import { useConfirmation } from "../../../hooks/useConfirmation";

export const DefaultEditableCell = ({
  getValue,
  row,
  column,
  table,
  ...rest
}) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue || "");
  const { requestConfirmation } = useConfirmation();

  const onBlur = async () => {
    if (column.columnDef?.confirmAction) {
      const { action } = await requestConfirmation({
        title: column.columnDef?.confirmAction?.title,
        description: column.columnDef?.confirmAction?.description,
      });

      if (action === "canceled") {
        return setValue(initialValue);
      }
    }

    if (value !== initialValue) {
      try {
        await table.options.meta?.updateData({
          id: row.original._id,
          data: { [column.columnDef.accessorKey]: value },
        });
      } catch (error) {
        console.log(error);
        setValue(initialValue);
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
    setValue(initialValue ? initialValue : "");
  }, [initialValue]);

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
      onKeyDown={handleKeyDown}
      {...rest}
    />
  );
};
