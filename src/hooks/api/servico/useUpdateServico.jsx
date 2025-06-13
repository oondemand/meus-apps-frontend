import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { ServicoService } from "../../../service/servico";

export const useUpdateServico = ({ onSuccess, origem }) =>
  useMutation({
    mutationFn: async ({ body, id }) =>
      await ServicoService.atualizarServico({
        body,
        id,
        origem,
      }),
    onSuccess(data) {
      onSuccess?.(data?.servico);
      toaster.create({
        title: "Servico atualizado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      console.log(error);
      toaster.create({
        title: "Ouve um erro ao atualizar o servico",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
