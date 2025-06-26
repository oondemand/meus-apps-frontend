import { Box, Text, Button, Flex } from "@chakra-ui/react";

import { Check } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toaster } from "../../../../components/ui/toaster";
import { formatDateToDDMMYYYY } from "../../../../utils/formatting";
import { queryClient } from "../../../../config/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { VisibilityControlDialog } from "../../../../components/vibilityControlDialog";
import { createDynamicFormFields } from "../../../pessoa/formFields";
import { useMemo } from "react";
import { useVisibleInputForm } from "../../../../hooks/useVisibleInputForms";
import { PessoaService } from "../../../../service/pessoa";
import { BuildForm } from "../../../../components/buildForm";
import { DocumentosCadastraisService } from "../../../../service/documentos-cadastrais";
import { useUpdatePessoa } from "../../../../hooks/api/pessoa/useUpdatePessoa";
import { ORIGENS } from "../../../../constants/origens";

const servicoSchema = z.object({
  servicos: z.array(z.object({ _id: z.string() }).transform((e) => e._id)),
});

export const AprovarForm = ({ pessoaId, documentoCadastral }) => {
  const { inputsVisibility, setInputsVisibility } = useVisibleInputForm({
    key: "PESSOAS_DOCUMENTO_CADASTAL_MODAL_FORM",
  });

  const { data } = useQuery({
    queryKey: ["listar-pessoa", { pessoaId }],
    queryFn: async () =>
      await PessoaService.obterPessoa({
        id: pessoaId,
      }),
  });

  const updatePessoa = useUpdatePessoa({
    origem: ORIGENS.FORM,
  });

  const { mutateAsync: onAprovarDocumento, isPending } = useMutation({
    mutationFn: async () =>
      await DocumentosCadastraisService.aprovarDocumentoCadastral({
        id: documentoCadastral?._id,
        origem: ORIGENS.APROVACAO_DOCUMENTO_CADASTRAL,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar-documentos-cadastrais"],
      });
      toaster.create({
        title: "Documento cadastral aprovado com sucesso!",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Ouve um erro ao aprovar o documento cadastral!",
        type: "error",
      });
    },
  });

  const { handleSubmit } = useForm({
    resolver: zodResolver(servicoSchema),
    defaultValues: {
      servicos: [],
    },
  });

  const handleAprovarDocumento = async () => {
    await onAprovarDocumento();
  };

  const fields = useMemo(() => createDynamicFormFields(), []);

  const onSubmitPessoa = async (values) => {
    const {
      endereco: { pais, ...rest },
    } = values;

    const body = {
      ...values,
      email: values?.email === "" ? null : values?.email,
      endereco: { ...rest, ...(pais.cod ? { pais } : {}) },
    };

    return await updatePessoa.mutateAsync({ id: pessoaId, body });
  };

  return (
    <form onSubmit={handleSubmit(handleAprovarDocumento)}>
      <Box>
        <Box mt="2">
          <Flex gap="4" alignItems="center" justifyContent="space-between">
            <Text color="gray.600" fontSize="sm">
              Pessoa
            </Text>
            <VisibilityControlDialog
              fields={fields}
              setVisibilityState={setInputsVisibility}
              visibilityState={inputsVisibility}
              title="Ocultar inputs"
            />
          </Flex>
        </Box>
        {data && (
          <Box mt="6">
            <BuildForm
              fields={fields}
              data={{
                ...data.pessoa,
                pessoaFisica: {
                  ...data?.pessoaFisica,
                  dataNascimento: formatDateToDDMMYYYY(
                    data?.pessoaFisica?.dataNascimento
                  ),
                },
              }}
              shouldUseFormValues={true}
              visibleState={inputsVisibility}
              onSubmit={onSubmitPessoa}
              gridColumns={2}
              gap={4}
            />
          </Box>
        )}
        <Box p="2" />
        <Button
          type="submit"
          disabled={isPending}
          variant="surface"
          shadow="xs"
          colorPalette="green"
          size="xs"
        >
          <Check /> Aprovar
        </Button>
      </Box>
    </form>
  );
};
