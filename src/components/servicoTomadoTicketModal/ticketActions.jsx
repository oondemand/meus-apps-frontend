import { Flex, Button, useDialogContext } from "@chakra-ui/react";
import { Check, Trash, X } from "lucide-react";

import { toaster } from "../ui/toaster";
import { ServicoTomadoTicketService } from "../../service/servicoTomadoTicket";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useConfirmation } from "../../hooks/useConfirmation";
import { queryClient } from "../../config/react-query";
import { ORIGENS } from "../../constants/origens";
import { EtapaService } from "../../service/etapa";
import { useListEtapas } from "../../hooks/api/etapas/useListEtapas";

export const TicketActions = ({ ticketId, etapa }) => {
  const { setOpen } = useDialogContext();
  const { requestConfirmation } = useConfirmation();

  const { etapas } = useListEtapas();

  const { mutateAsync: arquiveTicketMutation, isPending: isArquivePending } =
    useMutation({
      mutationFn: async () =>
        await ServicoTomadoTicketService.arquivarTicket({
          id: ticketId,
          origem: ORIGENS.ESTEIRA,
        }),
      onSuccess: () => {
        toaster.create({
          title: "Ticket arquivado com sucesso!",
          type: "success",
        });
      },
      onError: (error) => {
        toaster.error({
          title: "Ouve um erro ao arquivar o ticket!",
          description: error?.response?.data?.message,
        });
      },
    });

  const { mutateAsync: aproveTicketMutation, isPending: isAprovePending } =
    useMutation({
      mutationFn: async () =>
        await ServicoTomadoTicketService.aprovarTicket({
          id: ticketId,
          origem: ORIGENS.ESTEIRA,
        }),
      onSuccess: () => {
        queryClient.invalidateQueries(["listar-tickets"]);
        toaster.create({
          title: "Ticket aprovado com sucesso!",
          type: "success",
        });
      },
      onError: (error) => {
        toaster.error({
          title: "Ouve um erro ao aprovar o ticket!",
          description: error?.response?.data?.message,
        });
      },
    });

  const { mutateAsync: reproveTicketMutation, isPending: isReprovePending } =
    useMutation({
      mutationFn: async () =>
        await ServicoTomadoTicketService.reprovarTicket({
          id: ticketId,
          origem: ORIGENS.ESTEIRA,
        }),
      onSuccess: (error) => {
        queryClient.invalidateQueries(["listar-tickets"]);
        toaster.create({
          description: error?.response?.data?.message,
          title: "Ticket reprovado com sucesso!",
          type: "success",
        });
      },
      onError: () => {
        toaster.error({ title: "Ouve um erro ao reprovar o ticket!" });
      },
    });

  const handleArquiveTicket = async () => {
    const { action } = await requestConfirmation({
      title: "Tem que deseja arquivar ticket?",
      description: "Todo o seu progresso será perdido!",
    });

    if (action === "confirmed") {
      await arquiveTicketMutation();
      setOpen(false);
    }
  };

  const ultimaEtapa = etapas[etapas.length - 1]?.codigo;
  const primeiraEtapa = etapas[0]?.codigo;

  return (
    <Flex alignItems="center" w="full" justifyContent="space-between">
      <Flex gap="2">
        <Button
          onClick={async (e) => {
            await aproveTicketMutation();
            setOpen(false);
          }}
          disabled={etapa === ultimaEtapa || isAprovePending}
          variant="surface"
          shadow="xs"
          colorPalette="green"
          size="xs"
        >
          <Check /> Aprovar
        </Button>
        <Button
          disabled={
            etapa === primeiraEtapa || etapa == ultimaEtapa || isReprovePending
          }
          onClick={async (e) => {
            await reproveTicketMutation();
            setOpen(false);
          }}
          colorPalette="red"
          variant="surface"
          shadow="xs"
          size="xs"
        >
          <X /> Reprovar
        </Button>
        <Button
          disabled={isArquivePending}
          onClick={async (e) => {
            await handleArquiveTicket();
            setOpen(false);
          }}
          variant="surface"
          shadow="xs"
          size="xs"
        >
          <Trash /> Arquivar
        </Button>
      </Flex>
      <Button
        onClick={(e) => {
          setOpen(false);
        }}
        variant="surface"
        shadow="xs"
        size="xs"
      >
        Fechar
      </Button>
    </Flex>
  );
};
