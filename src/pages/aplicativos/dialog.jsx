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
import { api } from "../../config/api";
import { queryClient } from "../../config/react-query";

const schema = z.object({
  email: z.string().email("Email inválido!"),
});

export const ConvidarUsuarioDialog = ({ aplicativoId }) => {
  const [open, setOpen] = useState();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const { mutateAsync: convidarUsuarioMutation, isPending } = useMutation({
    mutationFn: async ({ body }) =>
      api.post(`/aplicativos/${aplicativoId}`, body),
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
              <Text>Email</Text>
              <Input {...register("email")} />
              {errors?.email?.message && (
                <Text fontSize="xs" color="red">
                  {errors?.email?.message}
                </Text>
              )}
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
