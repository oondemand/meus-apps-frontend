import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { ServicoService } from "../../../service/servico";

export const useCreateServico = ({ onSuccess, origem }) =>
  useMutation({
    mutationFn: async ({ body }) =>
      await ServicoService.criarServico({ body, origem }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Servico criado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao criar servico",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
