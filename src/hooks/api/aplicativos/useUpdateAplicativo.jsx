import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../config/react-query";
import { toaster } from "../../../components/ui/toaster";
import { api } from "../../../config/api";

export const useUpdateAplicativo = ({ onSuccess }) =>
  useMutation({
    mutationFn: async ({ body, id }) => {
      await api.put(`aplicativos/${id}`, body);
    },
    onSuccess: (data) => {
      onSuccess?.(data);
      toaster.create({
        title: "Aplicativo cadastrado com sucesso!",
        type: "success",
      });
      queryClient.invalidateQueries(["aplicativos"]);
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro inesperado ao atualizar aplicativo!",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
