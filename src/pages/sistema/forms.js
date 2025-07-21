import { DefaultField } from "../../components/buildForm/fields/default";
import { z } from "zod";
import { PasswordField } from "../../components/buildForm/fields/passwordField";

export const FORMS = [
  {
    title: "Geral",
    fields: [
      {
        accessorKey: "remetente.nome",
        label: "Nome remetente",
        render: DefaultField,
        validation: z.string().nonempty(),
        colSpan: 1,
      },
      {
        accessorKey: "sendgrid_api_key",
        label: "Sendgrid api key",
        render: PasswordField,
        validation: z.string().nonempty(),
        colSpan: 2,
      },
      {
        accessorKey: "remetente.email",
        label: "Email remetente",
        render: DefaultField,
        validation: z.string().email("Email inválido!").nonempty(),
        colSpan: 1,
      },
    ],
  },
];
