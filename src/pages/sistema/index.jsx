import { Box, Flex, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { FORMS } from "./forms";
import { BuildForm } from "../../components/buildForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SistemaService } from "../../service/sistema";
import { toaster } from "../../components/ui/toaster";
import { formatDate } from "../../utils/formatting";
import { TesteEnvioEmailDialog } from "./dialog";
import { queryClient } from "../../config/react-query";
import { ORIGENS } from "../../constants/origens";

export const SistemaPage = () => {
  const forms = useMemo(() => FORMS, []);

  const { data } = useQuery({
    queryKey: ["list-sistema"],
    queryFn: SistemaService.obterConfiguracoesSistema,
  });

  const { mutateAsync: updateConfigMutation } = useMutation({
    mutationFn: async ({ body, id }) =>
      SistemaService.atualizarConfiguracoesSistema({
        body,
        id,
        origem: ORIGENS.FORM,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["list-sistema"]);
      toaster.create({
        title: "Configuração atualizada com sucesso!",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Ouve um erro inesperado ao atualizar configuração!",
        type: "error",
      });
    },
  });

  const onSubmit = (values) => {
    return updateConfigMutation({ body: values, id: data?._id });
  };

  return (
    <>
      <Text fontWeight="semibold" fontSize="lg">
        Configurações de sistema
      </Text>
      <Flex
        mt="4"
        p="6"
        gap="8"
        flexWrap="wrap"
        bg="white"
        shadow="xs"
        roundedLeft="lg"
      >
        {data &&
          forms.map((form) => (
            <Box key={form.title}>
              <Box>
                <Text color="gray.500" fontWeight="medium">
                  {form.title}
                </Text>
                <Box mt="6">
                  <BuildForm
                    data={{
                      ...data,
                      data_corte_app_publisher: formatDate(
                        data?.data_corte_app_publisher
                      ),
                    }}
                    gridColumns={2}
                    onSubmit={onSubmit}
                    fields={form.fields}
                    gap={6}
                  />
                  {form.title === "Geral" && <TesteEnvioEmailDialog />}
                </Box>
              </Box>
            </Box>
          ))}
      </Flex>
    </>
  );
};
