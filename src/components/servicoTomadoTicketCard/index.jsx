import { Box, Text, Flex, Badge } from "@chakra-ui/react";
import React, { memo, useState } from "react";

import { ptBR } from "date-fns/locale";
import { LucideListCheck, Paperclip, File } from "lucide-react";
import { Tooltip } from "../ui/tooltip";

import { ServicesCard } from "./servicesCard";
import { AnexosCard } from "./arquivosCard";
import { currency } from "../../utils/currency";

import { TicketModal } from "../servicoTomadoTicketModal";
import { format } from "date-fns";
import { DocumentosFiscaisCard } from "./documentosFiscaisCard";
import { useListEtapas } from "../../hooks/api/etapas/useListEtapas";

const BADGE_MAP = {
  pago: { color: "green", title: "Pago em" },
  atrasado: { color: "red", title: "Pago em" },
  "a vencer": { color: "yellow", title: "Venc." },
};

const _TicketCard = ({ ticket }) => {
  const [open, setOpen] = useState(false);

  const statusColorMap = {
    "aguardando-inicio": "yellow.400",
    trabalhando: "green.400",
    revisao: "red.500",
  };

  const ticketTypeCarMap = {
    pj: "NF",
    ext: "INV",
    pf: "RPA",
  };

  const valorTotal = ticket?.servicos?.reduce((acc, curr) => {
    acc = acc + (curr?.valor ?? 0);
    return acc;
  }, 0);

  const { etapas } = useListEtapas();
  const ultimaEtapa = etapas?.[etapas?.length - 1]?.codigo;

  return (
    <Box>
      <Box cursor="pointer" p={2} my={2} color="brand.900" h="50px">
        <Flex
          onClick={() => setOpen(true)}
          alignItems="center"
          gap="2"
          fontWeight="bold"
          fontSize="md"
          py="1"
          rounded="lg"
          bg="white"
          p="2"
          boxShadow="0px 1px 2px 0px rgba(0, 0, 0, 0.05)"
          _hover={{ background: "gray.50" }}
        >
          <Flex w="full" flexDir="column" gap="2">
            <Flex w="full" alignItems="baseline" gap="2">
              <Box
                rounded="full"
                minH="12px"
                minW="12px"
                bg={statusColorMap[ticket?.status] || "blue.500"}
              />
              <Tooltip
                showArrow
                content={ticket?.titulo}
                positioning={{ placement: "top" }}
                openDelay={700}
                closeDelay={50}
                contentProps={{
                  css: {
                    "--tooltip-bg": "white",
                    color: "gray.600",
                  },
                }}
              >
                <Box w="90%">
                  <Text
                    truncate
                    fontWeight={500}
                    fontSize="xs"
                    color="gray.700"
                  >
                    {ticket?.titulo}
                  </Text>
                  <Text
                    truncate
                    fontWeight={400}
                    fontSize="2xs"
                    color="gray.400"
                  >
                    {format(ticket?.createdAt, "MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </Text>
                </Box>
              </Tooltip>
            </Flex>

            {(ticket?.contaPagarOmie || ticket?.status === "concluido") && (
              <Flex alignItems="center" justifyContent="space-between">
                <Text color="gray.400" fontSize="2xs" fontWeight="medium">
                  {BADGE_MAP[
                    ticket?.contaPagarOmie?.status_titulo?.toLowerCase()
                  ]?.title ?? "Concluido"}{" "}
                  {ticket?.contaPagarOmie?.data_vencimento}
                </Text>
                <Badge
                  variant="surface"
                  colorPalette={
                    BADGE_MAP[
                      ticket?.contaPagarOmie?.status_titulo?.toLowerCase()
                    ]?.color ?? ""
                  }
                  size="xs"
                >
                  {ticket?.contaPagarOmie?.status_titulo?.toLowerCase() ??
                    "Concluido"}
                </Badge>
              </Flex>
            )}

            <Flex
              w="full"
              alignItems="center"
              justifyContent="space-between"
              gap="2"
            >
              <Flex alignItems="center" gap="2">
                <Badge>
                  <Text fontSize="xs">
                    {ticketTypeCarMap[ticket?.pessoa?.tipo]}
                  </Text>
                </Badge>
                <Tooltip
                  showArrow
                  content={<ServicesCard servicos={ticket?.servicos} />}
                  positioning={{ placement: "bottom" }}
                  openDelay={500}
                  closeDelay={50}
                  contentProps={{
                    css: {
                      "--tooltip-bg": "white",
                      color: "gray.600",
                    },
                  }}
                >
                  <Flex color="gray.400" alignItems="center" gap="1px">
                    <LucideListCheck size={14} />
                    <Text
                      h="15px"
                      textAlign="center"
                      fontWeight={400}
                      fontSize="xs"
                    >
                      {ticket?.servicos?.length}
                    </Text>
                  </Flex>
                </Tooltip>
                <Tooltip
                  showArrow
                  content={<AnexosCard anexos={ticket?.arquivos} />}
                  positioning={{ placement: "bottom" }}
                  openDelay={500}
                  closeDelay={50}
                  contentProps={{
                    css: {
                      "--tooltip-bg": "white",
                      color: "gray.600",
                    },
                  }}
                >
                  <Flex color="gray.400" alignItems="center" gap="1px">
                    <Paperclip size={14} />
                    <Text
                      h="15px"
                      textAlign="center"
                      fontWeight={400}
                      fontSize="xs"
                    >
                      {ticket?.arquivos?.length ?? 0}
                    </Text>
                  </Flex>
                </Tooltip>
                {/* <Tooltip
                  showArrow
                  content={
                    <DocumentosFiscaisCard
                      documentosFiscais={ticket?.documentosFiscais}
                    />
                  }
                  positioning={{ placement: "bottom" }}
                  openDelay={500}
                  closeDelay={50}
                  contentProps={{
                    css: {
                      "--tooltip-bg": "white",
                      color: "gray.600",
                    },
                  }}
                >
                  <Flex color="gray.400" alignItems="center" gap="1px">
                    <File size={14} />
                    <Text
                      h="15px"
                      textAlign="center"
                      fontWeight={400}
                      fontSize="xs"
                    >
                      {ticket?.documentosFiscais?.length ?? 0}
                    </Text>
                  </Flex>
                </Tooltip> */}
              </Flex>
              <Text
                h="15px"
                truncate
                color="gray.400"
                fontWeight={400}
                fontSize="xs"
              >
                {currency.format(valorTotal)}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>

      {open && (
        <TicketModal
          defaultValue={ticket}
          open={open}
          setOpen={setOpen}
          onlyReading={ticket?.etapa === ultimaEtapa}
        />
      )}
    </Box>
  );
};

export const TicketCard = memo(_TicketCard);
