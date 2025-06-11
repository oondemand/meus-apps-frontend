import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { PessoaService } from "../../../service/pessoa";

export const useDeletePessoa = ({ onSuccess, origem }) =>
  useMutation({
    mutationFn: async ({ id }) =>
      await PessoaService.excluirPessoa({ id, origem }),
    onSuccess(data) {
      onSuccess?.(data);
      toaster.create({
        title: "Pessoa excluído com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro ao excluir pessoa",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
