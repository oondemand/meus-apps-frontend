import React from "react";
import { CpfCnpjCell } from "../../components/dataGrid/cells/cpfCnpjCell";
import { SelectAutoCompleteCell } from "../../components/dataGrid/cells/selectAutoComplete";
import { DefaultEditableCell } from "../../components/dataGrid/cells/defaultEditable";
import { SelectListaCell } from "../../components/dataGrid/cells/selectLista";
import { DateCell } from "../../components/dataGrid/cells/dateCell";
import { TableActionsCell } from "../../components/dataGrid/cells/tableActionsCell";
import { PessoasDialog } from "./dialog";
import {
  REGIME_TRIBUTARIO_OPTIONS,
  STATUS_PESSOA_OPTIONS,
  TIPO_PESSOA_OPTIONS,
} from "../../constants";
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
    {
      accessorKey: "pessoaFisica.rg",
      header: "RG",
      cell: (props) => (
        <DefaultEditableCell
          {...props}
          disabled={props.row.original?.tipo === "pj"}
        />
      ),
      enableColumnFilter: true,
      meta: { filterKey: "pessoaFisica.rg" },
    },
    {
      accessorKey: "pessoaFisica.dataNascimento",
      header: "Data de nascimento",
      cell: (props) => (
        <DateCell {...props} disabled={props.row.original?.tipo === "pj"} />
      ),
      enableColumnFilter: true,
      meta: { filterKey: "pessoaFisica.dataNascimento" },
    },
    {
      accessorKey: "pessoaFisica.apelido",
      header: "Apelido",
      cell: (props) => (
        <DefaultEditableCell
          {...props}
          disabled={props.row.original?.tipo === "pj"}
        />
      ),
      enableColumnFilter: true,
      meta: { filterKey: "pessoaFisica.dataNascimento" },
    },
    {
      accessorKey: "pessoaJuridica.nomeFantasia",
      header: "Nome da fantasia",
      cell: (props) => (
        <DefaultEditableCell
          {...props}
          disabled={props.row.original?.tipo === "pf"}
        />
      ),
      enableColumnFilter: true,
      meta: { filterKey: "pessoaJuridica.nomeFantasia" },
    },
    {
      accessorKey: "pessoaJuridica.regimeTributario",
      header: "Regime tributário",
      enableColumnFilter: true,
      meta: { filterKey: "pessoaJuridica.regimeTributario" },
      cell: (props) => (
        <SelectAutoCompleteCell
          {...props}
          disabled={props.row.original?.tipo === "pf"}
          options={REGIME_TRIBUTARIO_OPTIONS}
        />
      ),
    },
  ];
};
