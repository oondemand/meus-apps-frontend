import { Box, Button, Input, Text } from "@chakra-ui/react";
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
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../config/react-query";
import { api } from "../../config/api";
// import { SistemaService } from "../../service/sistema";

const schema = z.object({
  url: z.string().url({ message: "Url inválida" }).optional(),
  icone: z.string().url({ message: "Url inválida" }).optional(),
  nome: z
    .string({ message: "Nome é um campo obrigatório" })
    .nonempty({ message: "Nome é um campo obrigatório" }),
});

export const CadastrarAplicativoDialog = () => {
  const [open, setOpen] = useState();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const { mutateAsync: onTestEmailMutation, isPending } = useMutation({
    mutationFn: async ({ body }) => {
      await api.post("aplicativos", body);
    },
    onSuccess: () => {
      toaster.create({
        title: "Aplicativo cadastrado com sucesso!",
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

  return (
    <Box>
      <DialogRoot
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        placement="center"
      >
        <DialogTrigger asChild>
          <Button size="sm" colorPalette="cyan">
            Cadastrar aplicativo
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form
            onSubmit={handleSubmit(
              async (values) => await onTestEmailMutation({ body: values })
            )}
          >
            <DialogHeader>
              <DialogTitle>Cadastrar aplicativo</DialogTitle>
            </DialogHeader>
            <DialogBody spaceY="4">
              <Box>
                <Text>Nome</Text>
                <Input {...register("nome")} />
                {errors?.nome?.message && (
                  <Text fontSize="xs" color="red">
                    {errors?.nome?.message}
                  </Text>
                )}
              </Box>
              <Box>
                <Text>Icone</Text>
                <Input {...register("icone")} />
                {errors?.icone?.message && (
                  <Text fontSize="xs" color="red">
                    {errors?.icone?.message}
                  </Text>
                )}
              </Box>
              <Box>
                <Text>Url</Text>
                <Input {...register("url")} />
                {errors?.url?.message && (
                  <Text fontSize="xs" color="red">
                    {errors?.url?.message}
                  </Text>
                )}
              </Box>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger>
                <Button variant="surface">Cancelar</Button>
              </DialogActionTrigger>

              <Button
                disabled={isPending}
                type="submit"
                variant="surface"
                colorPalette="blue"
              >
                Cadastrar
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
