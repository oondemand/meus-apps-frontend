import { Box, Flex, Text, Link, Button, Badge } from "@chakra-ui/react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { Settings, Filter, Trash, User } from "lucide-react";
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
import { AMBIENTES_MAP, APP_STATUS_MAP } from "../../constants/maps";

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
                shadow="xs"
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
                  borderColor="gray.100"
                >
                  <Flex gap="2" alignItems="center">
                    <Badge
                      size="md"
                      rounded="md"
                      colorPalette={APP_STATUS_MAP[item?.status]?.color}
                    >
                      {APP_STATUS_MAP[item?.status]?.label}
                    </Badge>
                    <Badge
                      size="md"
                      rounded="md"
                      colorPalette={AMBIENTES_MAP[item?.ambiente]?.color}
                    >
                      {AMBIENTES_MAP[item?.ambiente]?.label}
                    </Badge>
                  </Flex>

                  <Flex alignItems="center" gap="3">
                    <MenuRoot positioning={{ placement: "bottom-end" }}>
                      <MenuTrigger
                        color="brand.600"
                        focusRing="none"
                        cursor="pointer"
                        alignItems="baseline"
                      >
                        <Settings />
                      </MenuTrigger>
                      <MenuContent cursor="pointer" fontWeight="semibold">
                        <MenuItem
                          onClick={() => {}}
                          cursor="pointer"
                          _hover={{ bg: "gray.50" }}
                        >
                          <User size={14} />
                          <a
                            href={`/aplicativos/${item?._id}/usuarios`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Usuários
                          </a>
                        </MenuItem>
                        {user && user?.tipo === "master" && (
                          <MenuItem
                            onClick={() => handleDeleteApp({ id: item?._id })}
                            cursor="pointer"
                            _hover={{ bg: "red.50" }}
                          >
                            <Trash size={14} /> Excluir aplicativo
                          </MenuItem>
                        )}
                      </MenuContent>
                    </MenuRoot>
                  </Flex>
                </Flex>

                <Flex p="4" gap="2.5">
                  <Flex
                    rounded="2xl"
                    bg="purple.100"
                    justifyContent="center"
                    alignItems="center"
                    overflow="hidden"
                    w="50px"
                    h="50px"
                  >
                    {item?.icone ? (
                      <img
                        src={item?.icone}
                        alt="ícone"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Text fontWeight="bold" color="gray.500" fontSize="3xl">
                        {item?.nome?.[0]?.toUpperCase() ?? "?"}
                      </Text>
                    )}
                  </Flex>
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
                  right="4"
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
