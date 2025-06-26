import { Checkbox, Flex } from "@chakra-ui/react";
import { toaster } from "../../ui/toaster";
import { useMutation } from "@tanstack/react-query";
import { ServicoTomadoTicketService } from "../../../service/servicoTomadoTicket";
import { queryClient } from "../../../config/react-query";
import { useConfirmation } from "../../../hooks/useConfirmation";
import { ORIGENS } from "../../../constants/origens";
import { PlanejamentoService } from "../../../service/planejamento";

export const CheckActionCell = ({ ...props }) => {
  const { requestConfirmation } = useConfirmation();

  const checked = ["pendente", "processando"].includes(
    props.row.original.statusProcessamento
  );

  const colorPalletMaps = {
    aberto: "",
    pendente: "orange",
    processando: "purple",
  };

  const { mutateAsync: deleteServicoMutation } = useMutation({
    mutationFn: async ({ servicoId }) =>
      await ServicoTomadoTicketService.removerServico({
        servicoId,
        origem: ORIGENS.PLANEJAMENTO,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["listar-servicos"]);
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro inesperado ao realizar operação!",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });

  const processarServico = useMutation({
    mutationFn: async ({ id, body }) =>
      await PlanejamentoService.processarServico({
        id,
        body,
      }),
    onSuccess: () => queryClient.invalidateQueries(["listar-servicos"]),
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro inesperado ao realizar operação!",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });

  const handleCheckChange = async (e) => {
    if (props.row.original.statusProcessamento === "processando") {
      const { action } = await requestConfirmation({
        title: "Tem certeza ?",
        description: "Essa operação ira remover o serviço do ticket.",
      });

      if (action === "confirmed") {
        return await deleteServicoMutation({
          servicoId: props.row.original._id,
        });
      }
    }

    if (props.row.original.statusProcessamento === "aberto") {
      return await processarServico.mutateAsync({
        id: props.row.original._id,
        body: { statusProcessamento: "pendente" },
      });
    }

    if (props.row.original.statusProcessamento === "pendente") {
      return await processarServico.mutateAsync({
        id: props.row.original._id,
        body: { statusProcessamento: "aberto" },
      });
    }
  };

  return (
    <Flex w="full" placeContent="center">
      <Checkbox.Root
        colorPalette={colorPalletMaps[props.row.original.statusProcessamento]}
        variant="subtle"
        checked={checked}
        onChange={handleCheckChange}
        disabled={processarServico.isPending}
        cursor="pointer"
        _disabled={{ cursor: "not-allowed" }}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
      </Checkbox.Root>
    </Flex>
  );
};
