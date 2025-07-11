import { Box, Flex, Text, Link, Button } from "@chakra-ui/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { Settings, Filter, Trash } from "lucide-react";
import { AplicativoService } from "../../service/aplicativo";
import { DebouncedInput } from "../../components/DebouncedInput";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "../../components/ui/menu";
import { useAuth } from "../../hooks/useAuth";
import { useStateWithStorage } from "../../hooks/useStateStorage";
import { CadastrarAplicativoDialog } from "./dialog";
import { useConfirmation } from "../../hooks/useConfirmation";
import { api } from "../../config/api";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../config/react-query";
import { toaster } from "../../components/ui/toaster";

export const Home = () => {
  const [searchTerm, setSearchTerm] = useStateWithStorage("searchTerm");
  const { requestConfirmation } = useConfirmation();
  const { user } = useAuth();

  const { data } = useQuery({
    queryFn: AplicativoService.listarAplicativos,
    queryKey: ["aplicativos"],
    staleTime: 1000 * 60, //1m
    placeholderData: keepPreviousData,
  });

  const aplicativosFiltrados =
    searchTerm?.toLowerCase()?.trim()?.length > 2
      ? data?.aplicativos.filter((aplicativo) => {
          const term = searchTerm?.toLowerCase()?.trim();
          return aplicativo?.nome?.toLowerCase()?.includes(term);
        })
      : data?.aplicativos;

  const { mutateAsync } = useMutation({
    mutationFn: async ({ id }) => api.delete(`/aplicativos/${id}`),
    onSuccess: () => {
      toaster.create({
        title: "Aplicativo excluído com sucesso!",
        type: "success",
      });
      queryClient.invalidateQueries(["aplicativos"]);
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro inesperado ao excluir aplicativo!",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });

  const handleDeleteApp = async ({ id }) => {
    const { action } = await requestConfirmation({
      title: "Tem certeza ?",
      description: "Essa ação não pode ser desfeita!",
    });

    if (action === "confirmed") {
      return mutateAsync({ id });
    }
  };

  return (
    <>
      <Flex justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Text color="gray.400" fontSize="xs">
            Visão geral
          </Text>
          <Text color="gray.700" fontSize="lg">
            Meus aplicativos
          </Text>
        </Box>
        <Flex gap="4">
          <Flex alignItems="center" color="gray.400" gap="3">
            <Filter size={22} />
            <DebouncedInput
              size="sm"
              w="xs"
              bg="white"
              placeholder="Pesquisar aplicativo"
              rounded="sm"
              _placeholder={{ color: "gray.400" }}
              placeIcon="right"
              iconSize={16}
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </Flex>

          {user && user?.tipo === "master" && <CadastrarAplicativoDialog />}
        </Flex>
      </Flex>

      <Flex mt="8" gap="4">
        {aplicativosFiltrados &&
          aplicativosFiltrados?.map((item) => {
            return (
              <Box
                h="56"
                w="80"
                bg="white"
                shadow="md"
                rounded="2xl"
                position="relative"
                key={item?._id}
              >
                <Flex
                  p="3"
                  justifyContent="space-between"
                  alignItems="center"
                  w="full"
                  color="gray.600"
                  borderBottom="1px solid"
                  borderColor="gray.200"
                >
                  <Text fontWeight="semibold">{item?.status}</Text>

                  <Flex alignItems="center" gap="3">
                    {user && user?.tipo === "master" && (
                      <Box
                        as="button"
                        p="1"
                        rounded="full"
                        bg="gray.50"
                        cursor="pointer"
                        onClick={() => handleDeleteApp({ id: item?._id })}
                      >
                        <Trash size={22} />
                      </Box>
                    )}
                    <MenuRoot positioning={{ placement: "bottom-end" }}>
                      <MenuTrigger
                        color="brand.500"
                        focusRing="none"
                        cursor="pointer"
                        alignItems="baseline"
                      >
                        <Box p="1" rounded="full" bg="brand.50">
                          <Settings />
                        </Box>
                      </MenuTrigger>
                      <MenuContent cursor="pointer">
                        <MenuItem
                          fontWeight="semibold"
                          onClick={() => {}}
                          cursor="pointer"
                        >
                          <a
                            href={`/aplicativos/${item?._id}/usuarios`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Cadastrar usuário
                          </a>
                        </MenuItem>
                      </MenuContent>
                    </MenuRoot>
                  </Flex>
                </Flex>

                <Flex p="4" gap="2">
                  <Box rounded="2xl" overflow="hidden" w="50px" h="50px">
                    {item?.icone && <img src={item?.icone} />}
                  </Box>
                  <Text fontSize="2xl" fontWeight="semibold">
                    {item?.nome}
                  </Text>
                </Flex>

                <Link
                  position="absolute"
                  fontWeight="semibold"
                  py="2"
                  px="4"
                  bottom="2"
                  left="2"
                  href={item?.url}
                  bg="cyan.500"
                  rounded="2xl"
                  textDecor="none"
                  target="_blank"
                  color="white"
                >
                  Acessar
                </Link>
              </Box>
            );
          })}
      </Flex>
    </>
  );
};
