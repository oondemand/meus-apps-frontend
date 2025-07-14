import { DefaultCell } from "../../components/dataGrid/cells/default";

export const columns = () => {
  return [
    {
      accessorKey: "usuario.nome",
      header: "Nome",
      cell: DefaultCell,
    },
    {
      accessorKey: "usuario.tipo",
      header: "Tipo",
      cell: DefaultCell,
    },
    {
      accessorKey: "usuario.email",
      header: "Email",
      cell: DefaultCell,
    },
    {
      accessorKey: "usuario.telefone",
      header: "Telefone",
      cell: DefaultCell,
    },
    {
      accessorKey: "usuario.status",
      header: "Status",
      cell: DefaultCell,
    },
  ];
};
