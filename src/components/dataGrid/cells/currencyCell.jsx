import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { parseBRLCurrencyToNumber } from "../../../utils/currency";
import { Input } from "@chakra-ui/react";

export const CurrencyCell = ({ getValue, row, column, table, ...props }) => {
  const initialValue = getValue();
  const [value, setValue] = useState("");

  const onBlur = async () => {
    if (parseBRLCurrencyToNumber(value) !== initialValue) {
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
            [column.columnDef.accessorKey]: parseBRLCurrencyToNumber(value),
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
    <NumericFormat
      width="100%"
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      fixedDecimalScale
      allowNegative
      prefix="R$ "
      placeholder="R$ 0,00"
      style={{
        backgroundColor: "transparent",
        height: "32px",
        paddingInline: "8px",
        outlineColor: "#0474AF",
        fontSize: "14px",
        width: "100%",
      }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
    />
  );
};
