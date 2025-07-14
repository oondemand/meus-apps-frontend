import {
  Box,
  Button,
  Input,
  Text,
  createListCollection,
} from "@chakra-ui/react";
import { CloseButton } from "../../components/ui/close-button";

import { useState } from "react";

import { toaster } from "../../components/ui/toaster";

import {
  DialogRoot,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogActionTrigger,
} from "../../components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../../config/api";
import { queryClient } from "../../config/react-query";
import { useMemo } from "react";

import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../../components/ui/select";
import axios from "axios";

const schema = z.object({
  email: z.string().email("Email inválido!"),
  tipoAcesso: z.string().optional(),
});

export const ConvidarUsuarioDialog = ({ aplicativo }) => {
  const [open, setOpen] = useState();

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const { mutateAsync: convidarUsuarioMutation, isPending } = useMutation({
    mutationFn: async ({ body }) =>
      api.post(`/aplicativos/${aplicativo?._id}`, body),
    onSuccess: () => {
      toaster.create({
        title: "Usuário convidado com sucesso!",
        type: "success",
      });
      queryClient.invalidateQueries(["aplicativos"]);
      setOpen(false);
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro inesperado ao enviar email!",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });

  const { data } = useQuery({
    queryKey: ["tipo-acesso-options"],
    queryFn: async () => await axios.get(aplicativo.tipoAcessoUrl),
  });

  const options = useMemo(
    () =>
      createListCollection({
        items: data?.data?.options ?? [],
      }),
    [data?.data]
  );

  return (
    <Box>
      <DialogRoot
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        placement="center"
      >
        <DialogTrigger asChild>
          <Button size="sm" colorPalette="cyan">
            Convidar usuario
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form
            onSubmit={handleSubmit(
              async (values) => await convidarUsuarioMutation({ body: values })
            )}
          >
            <DialogHeader>
              <DialogTitle>Convidar usuario</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Box>
                <Text>Email</Text>
                <Input {...register("email")} />
                {errors?.email?.message && (
                  <Text fontSize="xs" color="red">
                    {errors?.email?.message}
                  </Text>
                )}
              </Box>
              <Box mt="2">
                <SelectRoot
                  value={[watch("tipoAcesso")]}
                  onValueChange={({ value }) => {
                    setValue("tipoAcesso", ...value);
                  }}
                  collection={options}
                >
                  <SelectLabel>Tipo de acesso</SelectLabel>
                  <SelectTrigger>
                    <SelectValueText />
                  </SelectTrigger>
                  <SelectContent zIndex="9999">
                    {options?.items?.map((item) => (
                      <SelectItem item={item} key={item?.key}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
                {errors?.tipoAcesso?.message && (
                  <Text fontSize="xs" color="red">
                    {errors?.tipoAcesso?.message}
                  </Text>
                )}
              </Box>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="surface">Cancelar</Button>
              </DialogActionTrigger>

              <Button
                disabled={isPending}
                type="submit"
                variant="surface"
                colorPalette="blue"
              >
                Enviar
              </Button>
            </DialogFooter>
            <DialogCloseTrigger>
              <CloseButton />
            </DialogCloseTrigger>
          </form>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
};
