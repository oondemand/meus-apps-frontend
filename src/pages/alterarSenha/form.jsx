import { string, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";
import { LoginService } from "../../service/auth";

import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button, Input, Box, VStack, Text } from "@chakra-ui/react";

import { toaster } from "../../components/ui/toaster";
import { useEffect } from "react";

const FormSchema = z.object({
  senha: z
    .string()
    .min(6, { message: "A senha precisa ter no mínimo 6 caracteres" }),
  nome: z.string().nonempty({ message: "Nome é obrigatório" }),
  telefone: z.string(),
});

export const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    const token = searchParams.get("code");
    if (token) {
      localStorage.setItem("code", token);
      navigate(location.pathname, { replace: true });
    }
  }, [searchParams, navigate]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      senha: "",
      nome: "",
    },
  });

  const { mutateAsync: onLoginMutation } = useMutation({
    mutationFn: async ({ body, code }) =>
      await LoginService.firstAccess({ body, code }),
    onSuccess({ data: { usuario, token } }) {
      login(token, usuario);
      localStorage.removeItem("code");
      return navigate("/");
    },
    onError(error) {
      console.log(error);
      toaster.create({
        title: "Erro ao fazer login",
        description: error?.response?.data?.message,
        type: "error",
      });
    },
  });

  const onSubmit = async (values) => {
    await onLoginMutation({ body: values, code: localStorage.getItem("code") });
  };

  return (
    <Box w="full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spaceY="4">
          <Box w="full">
            <Text color="brand.500">Nome</Text>
            <Input
              focusRingColor="brand.350"
              placeholder="Seu nome"
              {...register("nome")}
            />
            {errors.nome?.message && (
              <Text fontSize="sm" color="red.500">
                {errors.nome.message}
              </Text>
            )}
          </Box>

          <Box w="full">
            <Text color="brand.500">Telefone</Text>
            <Input
              focusRingColor="brand.350"
              placeholder="Seu telefone"
              {...register("telefone")}
            />
            {errors.telefone?.message && (
              <Text fontSize="sm" color="red.500">
                {errors.telefone.message}
              </Text>
            )}
          </Box>

          <Box w="full">
            <Text color="brand.500">Senha</Text>
            <Input
              type="password"
              focusRingColor="brand.350"
              placeholder="Sua senha"
              {...register("senha")}
            />
            {errors.senha?.message && (
              <Text fontSize="sm" color="red.500">
                {errors.senha.message}
              </Text>
            )}
          </Box>

          <Button w="full" fontWeight="semibold" type="submit" bg="blue.500">
            Confirmar
          </Button>
        </VStack>
      </form>
    </Box>
  );
};
