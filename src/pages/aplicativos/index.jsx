import { Box, Button, Flex, Text, Table } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { api } from "../../config/api";
import { MemoizedTableBody } from "../../components/dataGrid/memoizedTableBody";
import { Pagination } from "../../components/dataGrid/pagination";
import { TableFooter } from "../../components/dataGrid/tableFooter";
import { TableHeader } from "../../components/dataGrid/tableHeader";

import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { ConvidarUsuarioDialog } from "./dialog";
import { columns } from "./columns";
import { useAuth } from "../../hooks/useAuth";

export const Aplicativos = () => {
  const { id } = useParams();

  const { data } = useQuery({
    queryKey: ["aplicativos", { id }],
    queryFn: async () => await api.get(`/aplicativos/${id}`),
  });

  const table = useReactTable({
    columns: columns(),
    data: data?.data?.aplicativo?.usuarios ?? [],
    rowCount: data?.data?.aplicativo?.usuarios?.length,
    enableColumnResizing: false,
    getCoreRowModel: getCoreRowModel(),
  });

  const { user } = useAuth();

  console.log("DATA:", data, user?.tipo);
  return (
    <Box>
      <Flex justifyContent="space-between">
        <Box>
          <Text color="gray.400" fontSize="xs">
            Aplicativo
          </Text>
          <Text color="gray.700" fontSize="lg">
            {data?.data?.aplicativo?.nome}
          </Text>
        </Box>
        {user && ["master", "admin-app"].includes(user?.tipo) && (
          <ConvidarUsuarioDialog aplicativo={data?.data?.aplicativo} />
        )}
      </Flex>

      {data?.data?.aplicativo?.usuarios && (
        <Box bg="white" p="6" shadow="sm" mt="8" rounded="lg" overflow="auto">
          <Flex gap="4">
            <Text mb="4" fontSize="lg" fontWeight="bold" color="gray.700">
              Usuarios
            </Text>
          </Flex>
          <Table.Root
            size="xs"
            overflowY="scroll"
            colorScheme="gray"
            width={`${table.getTotalSize()}px`}
          >
            <TableHeader table={table} />

            <MemoizedTableBody
              data={table.options.data}
              columns={table.getVisibleLeafColumns()}
              rows={table.getRowModel().rows}
            />

            <TableFooter table={table} />
          </Table.Root>

          <Box pt="4" />

          <Pagination table={table} />
        </Box>
      )}
    </Box>
  );
};
