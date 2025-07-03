import { useEffect, useState } from "react";
import { Input } from "@chakra-ui/react";
import { withMask } from "use-mask-input";
import { useConfirmation } from "../../../hooks/useConfirmation";

export const PisPasepCell = ({ getValue, row, column, table, ...rest }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const { requestConfirmation } = useConfirmation();

  const onBlur = async () => {
    if (value !== initialValue) {
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
        await table.options.meta?.updateData({
          id: row.original._id,
          data: {
            [column.columnDef.accessorKey]: value.replace(/[./-]/g, ""),
          },
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
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      truncate
      variant="subtle"
      display="flex"
      fontSize="sm"
      size="2xs"
      bg="transparent"
      focusRingColor="brand.500"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      placeholder=""
      ref={withMask("999.99999.99-9")}
      onKeyDown={handleKeyDown}
    />
  );
};
