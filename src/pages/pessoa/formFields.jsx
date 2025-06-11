import { DefaultField } from "../../components/buildForm/filds/default";
import { z } from "zod";
import { CpfCnpjField } from "../../components/buildForm/filds/cpfCnpjField";
import { SelectListaField } from "../../components/buildForm/filds/selectListaField";
import { SelectField } from "../../components/buildForm/filds/selectField";
import { TIPO_PESSOA_OPTIONS } from "../../constants";

export const createDynamicFormFields = () => {
  return [
    {
      accessorKey: "nome",
      label: "Nome Completo",
      render: DefaultField,
      validation: z.coerce
        .string()
        .min(3, { message: "Nome precisa ter pelo menos 3 caracteres" }),
      colSpan: 2,
    },
    {
      accessorKey: "tipo",
      label: "Tipo de Pessoa",
      render: SelectField,
      validation: z.string({ message: "Tipo é um campo obrigatório" }),
      colSpan: 1,
      options: TIPO_PESSOA_OPTIONS,
    },
    {
      accessorKey: "documento",
      label: "Documento",
      render: CpfCnpjField,
      validation: z
        .string({ message: "Documento é um campo obrigatório" })
        .nonempty({ message: "Documento é um campo obrigatório" })
        .transform((value) => value.replace(/\D/g, "")),
      colSpan: 1,
    },
    {
      accessorKey: "grupo",
      label: "Grupo",
      render: SelectListaField,
      cod: "grupo",
      validation: z.string().optional(),
      colSpan: 1,
    },
  ];
};
