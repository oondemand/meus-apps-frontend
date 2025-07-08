import { DefaultCell } from "../../components/dataGrid/cells/default";

export const columns = () => {
  return [
    {
      accessorKey: "nome",
      header: "Nome",
      cell: DefaultCell,
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: DefaultCell,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: DefaultCell,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: DefaultCell,
    },
  ];
};
