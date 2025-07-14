import { DefaultField } from "../../components/buildForm/filds/default";
import { z } from "zod";
import { SelectField } from "../../components/buildForm/filds/selectField";
import { TIPOS_USUARIO } from "../../constants/maps";

export const createDynamicFormFields = () => {
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
      label: "Tipo",
      render: SelectField,
      validation: z.string({ message: "Tipo é um campo obrigatório" }),
      colSpan: 2,
      options: tiposDeUsuario,
    },
    {
      accessorKey: "email",
      label: "E-mail",
      render: DefaultField,
      validation: z
        .string()
        .email({ message: "Email é um campo obrigatório!" }),
      colSpan: 2,
    },
    {
      accessorKey: "status",
      label: "Status",
      render: SelectField,
      validation: z.string({ message: "Tipo é um campo obrigatório" }),
      colSpan: 2,
      options: status,
    },

    {
      accessorKey: "senha",
      label: "Senha",
      render: DefaultField,
      validation: z
        .string()
        .min(6, { message: "A senha precisa ter no mínimo 6 dígitos" }),
      colSpan: 2,
    },
  ];
};
