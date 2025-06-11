import React from "react";
import { CpfCnpjCell } from "../../components/dataGrid/cells/cpfCnpjCell";
import { SelectAutoCompleteCell } from "../../components/dataGrid/cells/selectAutoComplete";
import { DefaultEditableCell } from "../../components/dataGrid/cells/defaultEditable";
import { SelectListaCell } from "../../components/dataGrid/cells/selectLista";
import { TableActionsCell } from "../../components/dataGrid/cells/tableActionsCell";
import { PessoasDialog } from "./dialog";
import { STATUS_PESSOA_OPTIONS, TIPO_PESSOA_OPTIONS } from "../../constants";
import { DeletePessoaAction } from "../../components/dataGrid/actions/deletePessoaButton";

export const makeDynamicColumns = () => {
  return [
    {
      accessorKey: "acoes",
      header: "Ações",
      enableSorting: false,
      cell: (props) => (
        <TableActionsCell>
          <DeletePessoaAction id={props.row.original?._id} />
          <PessoasDialog label="Pessoa" defaultValues={props.row.original} />
        </TableActionsCell>
      ),
    },
    {
      accessorKey: "grupo",
      header: "Grupo",
      cell: (props) => <SelectListaCell {...props} cod="grupo" />,
      enableColumnFilter: true,
      meta: { filterKey: "grupo" },
    },
    {
      accessorKey: "nome",
      header: "Nome Completo",
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      enableSorting: false,
      meta: { filterKey: "nome" },
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: (props) => (
        <SelectAutoCompleteCell {...props} options={TIPO_PESSOA_OPTIONS} />
      ),
      enableColumnFilter: true,
      meta: {
        filterKey: "tipo",
        filterVariant: "select",
        filterOptions: TIPO_PESSOA_OPTIONS,
      },
    },
    {
      accessorKey: "documento",
      header: "Documento",
      cell: (props) => <CpfCnpjCell {...props} />,
      enableColumnFilter: true,
      meta: { filterKey: "documento" },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (props) => (
        <SelectAutoCompleteCell {...props} options={STATUS_PESSOA_OPTIONS} />
      ),
      enableColumnFilter: true,
      meta: {
        filterKey: "status",
        filterVariant: "select",
        filterOptions: STATUS_PESSOA_OPTIONS,
      },
    },
  ];
};
