import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../config/react-query";
import { toaster } from "../../../components/ui/toaster";
import { api } from "../../../config/api";

export const useDeleteAplicativo = ({ onSuccess }) =>
  useMutation({
    mutationFn: async ({ id }) => api.delete(`/aplicativos/${id}`),
    onSuccess: (data) => {
      onSuccess?.(data);
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
