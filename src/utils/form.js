export const parseFieldSchemaToVisibilityControlObj = (fields) => {
  if (!fields) return [];

  return fields.flatMap((field) => {
    if ("group" in field && Array.isArray(field.group)) {
      return field.group.map((groupField) => ({
        accessorKey: groupField.accessorKey,
        label: groupField.label,
      }));
    }

    return field.accessorKey
      ? [
          {
            accessorKey: field.accessorKey,
            label: field.label,
          },
        ]
      : [];
  });
};
