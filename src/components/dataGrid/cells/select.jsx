import { useEffect, useState } from "react";
import { NativeSelectField, NativeSelectRoot } from "../../ui/native-select";
import { useConfirmation } from "../../../hooks/useConfirmation";

export const SelectCell = ({ getValue, row, column, table, ...rest }) => {
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
    setValue(initialValue);
  }, [initialValue]);

  return (
    <NativeSelectRoot
      onBlur={onBlur}
      size="sm"
      border="none"
      focusRingColor="brand.500"
      onKeyDown={handleKeyDown}
    >
      <NativeSelectField
        focusRingColor="brand.500"
        border="none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        {column.columnDef.meta.filterOptions?.map((item, i) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </NativeSelectField>
    </NativeSelectRoot>
  );
};
