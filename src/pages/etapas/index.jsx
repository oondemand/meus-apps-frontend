import React, { useCallback, useMemo } from "react";

import { Box, Text, createListCollection } from "@chakra-ui/react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { DataGrid } from "../../components/dataGrid";
import { useDataGrid } from "../../hooks/useDataGrid";
import { makeEtapasDynamicColumns } from "./columns";
import { EtapaService } from "../../service/etapa";
import { EtapasDialog } from "./dialog";
import { useUpdateEtapa } from "../../hooks/api/etapas/useUpdateEtapa";
import { queryClient } from "../../config/react-query";
import { ORIGENS } from "../../constants/origens";
import { Container } from "../../components/container";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../../components/ui/select";
import { useStateWithStorage } from "../../hooks/useStateStorage";

const esteirasCollection = createListCollection({
  items: [
    { label: "Pedido Venda", value: "pedido-venda" },
    { label: "Servicos Tomados", value: "servicos-tomados" },
  ],
});

export const EtapasPage = () => {
  const columns = useMemo(() => makeEtapasDynamicColumns({}), []);
  const { filters, table } = useDataGrid({ columns, key: "ETAPAS" });
  const [selectedEsteira, setSelectedEsteira] =
    useStateWithStorage("SELECTED_ESTEIRA");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "listar-etapas",
      { filters: { ...filters, esteira: selectedEsteira } },
    ],
    queryFn: async () =>
      await EtapaService.listarEtapas({
        filters: { ...filters, esteira: selectedEsteira },
      }),
    placeholderData: keepPreviousData,
    enabled: Boolean(selectedEsteira),
  });

  const updateEtapa = useUpdateEtapa({
    origem: ORIGENS.DATAGRID,
    onSuccess: () =>
      queryClient.invalidateQueries(["listar-etapas", { filters }]),
  });

  return (
    <Container>
      <Box>
        <Text fontSize="lg" color="gray.700" fontWeight="semibold">
          Etapas
        </Text>

        <Box
          mt="4"
          bg="white"
          py="6"
          px="4"
          rounded="lg"
          shadow="xs"
          spaceY="8"
        >
          <SelectRoot
            w="sm"
            value={[selectedEsteira]}
            onValueChange={({ value }) => setSelectedEsteira(value[0])}
            collection={esteirasCollection}
          >
            <SelectLabel fontSize="sm">Esteira</SelectLabel>
            <SelectTrigger>
              <SelectValueText />
            </SelectTrigger>
            <SelectContent>
              {esteirasCollection?.items?.map((item) => (
                <SelectItem item={item} key={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
          <DataGrid
            table={table}
            form={() => <EtapasDialog esteira={selectedEsteira} />}
            data={data?.results || []}
            rowCount={data?.pagination?.totalItems}
            isDataLoading={isLoading || isFetching}
            onUpdateData={async (values) => {
              await updateEtapa.mutateAsync({
                id: values.id,
                body: values.data,
              });
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};
