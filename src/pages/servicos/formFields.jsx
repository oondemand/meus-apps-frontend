import { DefaultField } from "../../components/buildForm/filds/default";
import { z } from "zod";
import { SelectListaField } from "../../components/buildForm/filds/selectListaField";
import { CurrencyField } from "../../components/buildForm/filds/currencyField";
import { currencyValidation, dateValidation } from "../../utils/zodHelpers";
import { DateField } from "../../components/buildForm/filds/dateField";
import { SelectPrestadorField } from "../../components/buildForm/filds/selectPrestadorField";

export const createDynamicFormFields = () => {
  return [
    {
      accessorKey: "pessoa",
      label: "Cliente ou prestador",
      render: SelectPrestadorField,
      validation: z.object(
        { label: z.string(), value: z.string() },
        { message: "Prestador é obrigatório" }
      ),
      colSpan: 2,
    },
    {
      accessorKey: "tipoServicoTomado",
      label: "Tipo de servico tomado",
      render: SelectListaField,
      cod: "tipo-servico-tomado",
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "valor",
      label: "Valor",
      render: CurrencyField,
      validation: currencyValidation,
      colSpan: 1,
    },
    {
      accessorKey: "dataContratacao",
      label: "Data contratação",
      render: DateField,
      validation: dateValidation,
      colSpan: 1,
    },
    {
      accessorKey: "dataConclusao",
      label: "Data Conclusão",
      render: DateField,
      validation: dateValidation,
      colSpan: 1,
    },
    {
      accessorKey: "descricao",
      label: "Descrição",
      render: DefaultField,
      validation: z.string().optional(),
      colSpan: 4,
    },
  ];
};
