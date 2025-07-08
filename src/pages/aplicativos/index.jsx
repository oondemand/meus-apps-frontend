import { Box, Button, Flex, Text, Table } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { api } from "../../config/api";
import { DataGrid } from "../../components/dataGrid";
import { MemoizedTableBody } from "../../components/dataGrid/memoizedTableBody";
import { Pagination } from "../../components/dataGrid/pagination";
import { TableFooter } from "../../components/dataGrid/tableFooter";
import { TableHeader } from "../../components/dataGrid/tableHeader";

import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { ConvidarUsuarioDialog } from "./dialog";

export const Aplicativos = () => {
  const { id } = useParams();

  console.log(id);

  const { data } = useQuery({
    queryKey: ["aplicativos", { id }],
    queryFn: async () => await api.get(`/aplicativos/${id}`),
  });

  console.log("LOG =>", data);

  //   {
  //     "message": "OK",
  //     "aplicativo": {
  //         "_id": "686d0d89a7d82016f25b0a44",
  //         "url": "https://homolog.cst.rakuten.oondemand.com.br/",
  //         "icone": "https://images.pexels.com/photos/8801684/pexels-photo-8801684.jpeg",
  //         "nome": "Central rakuten",
  //         "status": "ativo",
  //         "usuarios": [
  //             {
  //                 "_id": "686c1871eb6fce81cc217cb0",
  //                 "tipo": "master",
  //                 "email": "maikonalexandre574@gmail.com",
  //                 "nome": "Maikon",
  //                 "senha": "$2a$10$x9ErXpIT/daloHYoG7U3vut8I6T5Pds6iQwWzSVjfc7BjesXqLHzy",
  //                 "status": "ativo",
  //                 "__v": 0
  //             }
  //         ],
  //         "__v": 0
  //     }
  // }

  const columns = [
    {
      accessorKey: "nome",
      header: "Nome",
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
  ];

  // const table = {
  //   columns,
  //   searchTerm: "",
  // };

  const table = useReactTable({
    columns,
    data: data?.data?.aplicativo?.usuarios ?? [],
    rowCount: data?.data?.aplicativo?.usuarios?.length,
    enableColumnResizing: false,
    getCoreRowModel: getCoreRowModel(),
  });

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
        {/* <Button size="sm" colorPalette="cyan">
          Convidar usuário
        </Button> */}
        <ConvidarUsuarioDialog />
      </Flex>

      {/* {data?.data?.aplicativo?.usuarios && (
        <Text mt="8" fontSize="20px" color="gray.700" fontWeight="semibold">
          Usuarios
        </Text>
      )} */}

      {data?.data?.aplicativo?.usuarios &&
        data?.data?.aplicativo?.usuarios.map((item) => (
          <Box w="2xl" bg="white" p="6" shadow="sm" mt="8" rounded="lg">
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
        ))}
    </Box>
  );
};
