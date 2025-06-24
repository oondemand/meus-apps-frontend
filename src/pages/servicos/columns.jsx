import React from "react";
import { DefaultEditableCell } from "../../components/dataGrid/cells/defaultEditable";
import { SelectListaCell } from "../../components/dataGrid/cells/selectLista";
import { TableActionsCell } from "../../components/dataGrid/cells/tableActionsCell";
import { CurrencyCell } from "../../components/dataGrid/cells/currencyCell";
import { DateCell } from "../../components/dataGrid/cells/dateCell";

import { ServicosDialog } from "./dialog";
import { DeleteServicoAction } from "../../components/dataGrid/actions/deleteServicoButton";
import { formatDateToDDMMYYYY } from "../../utils/formatting";
import { SelectPrestadorCell } from "../../components/dataGrid/cells/selectPrestador";

export const makeDynamicColumns = () => {
  return [
    {
      accessorKey: "acoes",
      header: "Ações",
      cell: (props) => (
        <TableActionsCell>
          <DeleteServicoAction id={props.row.original?._id} />
          <ServicosDialog
            label="Servico"
            defaultValues={{
              ...props.row.original,
              dataContratacao: formatDateToDDMMYYYY(
                props.row.original?.dataContratacao
              ),
              dataConclusao: formatDateToDDMMYYYY(
                props.row.original?.dataConclusao
              ),
            }}
          />
        </TableActionsCell>
      ),
    },
    {
      accessorKey: "pessoa",
      header: "Cliente ou prestador",
      enableSorting: false,
      cell: SelectPrestadorCell,
      enableColumnFilter: true,
      meta: {
        filterVariant: "selectPrestador",
        filterKey: "pessoa",
      },
    },
    {
      accessorKey: "tipoServicoTomado",
      header: "Tipo serviço",
      cell: (props) => <SelectListaCell {...props} cod="tipo-servico-tomado" />,
      enableColumnFilter: true,
      meta: { filterKey: "tipoServicoTomado" },
    },
    {
      accessorKey: "descricao",
      header: "Descrição",
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      meta: { filterKey: "descricao" },
    },
    {
      accessorKey: "valor",
      header: "Valor",
      cell: CurrencyCell,
      enableColumnFilter: true,
      meta: { filterKey: "valor" },
    },
    {
      accessorKey: "dataContratacao",
      header: "Data contratação",
      cell: DateCell,
      enableColumnFilter: true,
      meta: { filterKey: "dataContratacao" },
    },
    {
      accessorKey: "dataConclusao",
      header: "Data Conclusão",
      cell: DateCell,
      enableColumnFilter: true,
      meta: { filterKey: "dataConclusao" },
    },
  ];
};
