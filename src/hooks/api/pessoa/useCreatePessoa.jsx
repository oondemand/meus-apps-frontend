import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { PessoaService } from "../../../service/pessoa";

export const useCreatePessoa = ({ onSuccess, origem }) =>
  useMutation({
    mutationFn: async ({ body }) =>
      await PessoaService.criarPessoa({ body, origem }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Pessoa criado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao criar pessoa",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
