import { DefaultField } from "../../components/buildForm/filds/default";
import { z } from "zod";
import { SelectListaField } from "../../components/buildForm/filds/selectListaField";
import { CurrencyField } from "../../components/buildForm/filds/currencyField";
import { currencyValidation, dateValidation } from "../../utils/zodHelpers";
import { DateField } from "../../components/buildForm/filds/dateField";

export const createDynamicFormFields = () => {
  return [
    // {
    //   accessorKey: "nome",
    //   label: "Nome Completo",
    //   render: DefaultField,
    //   validation: z.coerce
    //     .string()
    //     .min(3, { message: "Nome precisa ter pelo menos 3 caracteres" }),
    //   colSpan: 2,
    // },
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
