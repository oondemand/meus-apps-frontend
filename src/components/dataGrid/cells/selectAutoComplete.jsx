import { useEffect, useState } from "react";
import { SelectAutocomplete } from "../../../components/selectAutocomplete";

export const SelectAutoCompleteCell = ({
  getValue,
  row,
  column,
  table,
  options,
  ...rest
}) => {
  const initialValue = getValue();

  const [value, setValue] = useState("");

  const onBlur = async () => {
    if (value && value !== options.find((e) => e?.value === initialValue)) {
      try {
        await table.options.meta?.updateData({
          id: row.original._id,
          data: { [column.columnDef.accessorKey]: value.value },
        });
      } catch (error) {
        console.log(error);
        setValue(initialValue);
      }
    }
  };

  const inicializarValue = () => {
    const value = options.find(
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
  }, [initialValue]);
  return (
    <SelectAutocomplete
      onKeyDown={handleKeyDown}
      disabled={rest?.disabled}
      placeholder={value}
      onBlur={onBlur}
      value={value}
      setValue={setValue}
      options={options}
    />
  );
};
