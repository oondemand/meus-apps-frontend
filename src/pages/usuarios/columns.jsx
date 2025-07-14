import { SelectAutoCompleteCell } from "../../components/dataGrid/cells/selectAutoComplete";
import { DefaultEditableCell } from "../../components/dataGrid/cells/defaultEditable";
import { UsuariosDialog } from "./dialog";
import { TableActionsCell } from "../../components/dataGrid/cells/tableActionsCell";
import { DeleteUsuarioAction } from "../../components/dataGrid/actions/deleteUsuarioButton";
// import { RecuperarSenhaUsuarioAction } from "../../components/dataGrid/actions/recuperarSenhaUsuario";
import { TIPOS_USUARIO } from "../../constants/maps";
import { PhoneCell } from "../../components/dataGrid/cells/phoneCell";

export const makeUsuarioDynamicColumns = () => {
  const tiposDeUsuario = Object.entries(TIPOS_USUARIO).map(([key, value]) => ({
    label: value.label,
    value: key,
  }));

  const status = [
    { label: "Ativo", value: "ativo" },
    { label: "Inativo", value: "inativo" },
    { label: "Pendente", value: "pendente" },
  ];

  return [
    {
      accessorKey: "acoes",
      header: "Ações",
      cell: (props) => (
        <TableActionsCell>
          <DeleteUsuarioAction id={props.row.original?._id} />
          <UsuariosDialog
            label="Usuario"
            defaultValues={{
              ...props.row.original,
            }}
          />
          {/* <RecuperarSenhaUsuarioAction usuario={props.row.original} /> */}
        </TableActionsCell>
      ),
    },
    {
      accessorKey: "nome",
      header: "Nome Completo",
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      meta: { filterKey: "nome" },
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: (props) => (
        <SelectAutoCompleteCell {...props} options={tiposDeUsuario} />
      ),
      enableColumnFilter: true,
      meta: {
        filterKey: "tipo",
        filterVariant: "select",
        filterOptions: tiposDeUsuario,
      },
    },
    {
      accessorKey: "email",
      header: "E-mail",
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      meta: { filterKey: "email" },
    },
    {
      accessorKey: "telefone",
      header: "Telefone",
      cell: PhoneCell,
      enableColumnFilter: true,
      meta: { filterKey: "telefone" },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (props) => <SelectAutoCompleteCell {...props} options={status} />,
      enableColumnFilter: true,
      meta: {
        filterKey: "status",
        filterVariant: "select",
        filterOptions: status,
      },
    },
  ];
};
