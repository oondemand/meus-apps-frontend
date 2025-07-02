import { DefaultField } from "../../components/buildForm/filds/default";
import { z } from "zod";
import { CpfCnpjField } from "../../components/buildForm/filds/cpfCnpjField";
import { SelectListaField } from "../../components/buildForm/filds/selectListaField";
import { SelectField } from "../../components/buildForm/filds/selectField";
import { DateField } from "../../components/buildForm/filds/dateField";
import {
  REGIME_TRIBUTARIO_OPTIONS,
  TIPO_PESSOA_OPTIONS,
} from "../../constants";
import { Box } from "@chakra-ui/react";
import { Accordion } from "../../components/buildForm/components/accordion";
import { Separator } from "../../components/buildForm/components/separator";
import { Break } from "../../components/buildForm/components/break";
import { DefaultContainer } from "../../components/buildForm/components/default";
import { useFormContext } from "react-hook-form";
import { ConditionalRendering } from "../../components/buildForm/components/conditionalReendering";
import { currencyValidation, dateValidation } from "../../utils/zodHelpers";

export const createDynamicFormFields = () => {
  return [
    {
      label: "Detalhes do cliente/prestador",
      group: [
        {
          accessorKey: "nome",
          label: "Nome Completo",
          render: DefaultField,
          validation: z.coerce
            .string()
            .min(3, { message: "Nome precisa ter pelo menos 3 caracteres" }),
          colSpan: 3,
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
      ],
    },
    {
      label: "Pessoa física",
      wrapperComponent: ({ children }) => (
        <ConditionalRendering condition={(ctx) => ctx.tipo === "pf"}>
          <DefaultContainer children={children} label="Pessoa física" />
        </ConditionalRendering>
      ),
      group: [
        {
          accessorKey: "pessoaFisica.rg",
          label: "RG",
          render: DefaultField,
          validation: z.string().optional(),
          colSpan: 1,
        },
        {
          accessorKey: "pessoaFisica.dataNascimento",
          label: "Data de nascimento",
          render: DateField,
          validation: dateValidation,
          colSpan: 1,
        },
        {
          accessorKey: "pessoaFisica.apelido",
          label: "Apelido",
          render: DefaultField,
          validation: z.string().optional(),
          colSpan: 2,
        },
      ],
    },
    {
      label: "Pessoa jurídica",
      wrapperComponent: ({ children }) => (
        <ConditionalRendering condition={(ctx) => ctx.tipo === "pj"}>
          <DefaultContainer children={children} label="Pessoa jurídica" />
        </ConditionalRendering>
      ),
      group: [
        {
          accessorKey: "pessoaJuridica.nomeFantasia",
          label: "Nome da fantasia",
          render: DefaultField,
          validation: z.coerce.string().optional(),
          colSpan: 2,
        },
        {
          accessorKey: "pessoaJuridica.regimeTributario",
          label: "Regime tributário",
          render: SelectField,
          validation: z.string().optional(),
          colSpan: 2,
          options: REGIME_TRIBUTARIO_OPTIONS,
        },
      ],
    },
  ];
};
