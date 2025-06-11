import { useMutation } from "@tanstack/react-query";
import { toaster } from "../../../components/ui/toaster";
import { PessoaService } from "../../../service/pessoa";

export const useUpdatePessoa = ({ onSuccess, origem }) =>
  useMutation({
    mutationFn: async ({ body, id }) =>
      await PessoaService.atualizarPessoa({
        body,
        id,
        origem,
      }),
    onSuccess(data) {
      onSuccess?.(data?.pessoa);
      toaster.create({
        title: "Pessoa atualizado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      console.log(error);
      toaster.create({
        title: "Ouve um erro ao atualizar o pessoa",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
