import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../config/react-query";
import { toaster } from "../../../components/ui/toaster";
import { api } from "../../../config/api";

export const useCreateAplicativo = ({ onSuccess }) =>
  useMutation({
    mutationFn: async (body) => {
      await api.post("aplicativos", body);
    },
    onSuccess: (data) => {
      onSuccess?.(data);
      queryClient.invalidateQueries(["aplicativos"]);
      toaster.create({
        title: "Aplicativo cadastrado com sucesso!",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Ouve um erro inesperado cadastrar aplicativo!",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });
