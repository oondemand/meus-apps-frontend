import { useEffect, useState } from "react";
import { Input } from "@chakra-ui/react";
import { withMask } from "use-mask-input";
import { parse, format } from "date-fns";
import { formatDateToDDMMYYYY } from "../../../utils/formatting";
import { useConfirmation } from "../../../hooks/useConfirmation";

export const DateCell = ({ getValue, row, column, table, ...rest }) => {
  const initialValue = formatDateToDDMMYYYY(getValue());
  const [value, setValue] = useState("");
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

      const newDate = format(
        parse(value, "dd/MM/yyyy", new Date()),
        "yyyy/MM/dd"
      );

      try {
        await table.options.meta?.updateData({
          id: row.original._id,
          data: {
            [column.columnDef.accessorKey]: newDate,
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
      ref={withMask("99/99/9999")}
      onKeyDown={handleKeyDown}
      {...rest}
    />
  );
};
