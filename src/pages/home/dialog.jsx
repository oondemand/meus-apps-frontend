import {
  Box,
  Button,
  Input,
  Text,
  createListCollection,
  Flex,
  Clipboard,
  IconButton,
} from "@chakra-ui/react";
import { CloseButton } from "../../components/ui/close-button";
import { useState } from "react";
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
import {
  SelectRoot,
  SelectLabel,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValueText,
} from "../../components/ui/select";
import { AMBIENTES_MAP } from "../../constants/maps";
import { nanoid } from "nanoid";
import { RefreshCcw } from "lucide-react";
import { useCreateAplicativo } from "../../hooks/api/aplicativos/useCreateAplicativo";
import { useUpdateAplicativo } from "../../hooks/api/aplicativos/useUpdateAplicativo";

const generateAppKey = () => `oon_${nanoid(10)}`;

const schema = z.object({
  url: z
    .string()
    .url({ message: "Url inválida" })
    .nonempty({ message: "Url é um campo obrigatório!" }),
  icone: z.union([
    z.literal(""), // aceita string vazia
    z.string().url({ message: "Url inválida" }), // ou uma URL válida
  ]),
  tipoAcessoUrl: z.string().url().optional(),
  nome: z
    .string({ message: "Nome é um campo obrigatório" })
    .nonempty({ message: "Nome é um campo obrigatório" }),
  ambiente: z.enum(Object.entries(AMBIENTES_MAP).map(([key, _]) => key)),
  appKey: z.string().regex(/^oon_.{10}$/, {
    message: "A chave deve começar com prefixo 'oon_'",
  }),
});

const options = createListCollection({
  items: Object.entries(AMBIENTES_MAP).map(([key, value]) => ({
    label: value.label,
    value: key,
  })),
});

export const CadastrarAplicativoDialog = ({ children, defaultValues }) => {
  const [open, setOpen] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...defaultValues,
      ambiente: defaultValues?.ambiente ? defaultValues.ambiente : "prod",
      appKey: defaultValues?.appKey ? defaultValues.appKey : generateAppKey(),
    },
  });

  const onCreateAplicativo = useCreateAplicativo({
    onSuccess: () => setOpen(false),
  });

  const onUpdateAplicativo = useUpdateAplicativo({
    onSuccess: () => setOpen(false),
  });

  const onSubmit = (values) => {
    if (defaultValues) {
      return onUpdateAplicativo.mutateAsync({
        body: values,
        id: defaultValues?._id,
      });
    }

    return onCreateAplicativo.mutateAsync({ body: values });
  };

  return (
    <Box>
      <DialogRoot
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        placement="center"
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Cadastrar aplicativo</DialogTitle>
            </DialogHeader>
            <DialogBody spaceY="4">
              <Box>
                <Text>Nome</Text>
                <Input {...register("nome")} />
                {errors?.nome?.message && (
                  <Text fontSize="xs" color="red">
                    {errors?.nome?.message}
                  </Text>
                )}
              </Box>
              <Box>
                <Text>Icone</Text>
                <Input {...register("icone")} />
                {errors?.icone?.message && (
                  <Text fontSize="xs" color="red">
                    {errors?.icone?.message}
                  </Text>
                )}
              </Box>
              <Box>
                <Text>Url</Text>
                <Input {...register("url")} />
                {errors?.url?.message && (
                  <Text fontSize="xs" color="red">
                    {errors?.url?.message}
                  </Text>
                )}
              </Box>
              <Box>
                <Text>AppKey</Text>
                <Flex gap="2">
                  <Input {...register("appKey")} />
                  <Clipboard.Root value={watch("appKey")}>
                    <Clipboard.Trigger asChild>
                      <IconButton variant="surface">
                        <Clipboard.Indicator />
                      </IconButton>
                    </Clipboard.Trigger>
                  </Clipboard.Root>
                  <IconButton
                    variant="surface"
                    onClick={() => setValue("appKey", generateAppKey())}
                  >
                    <RefreshCcw />
                  </IconButton>
                </Flex>
                {errors?.appKey?.message && (
                  <Text fontSize="xs" color="red">
                    {errors?.appKey?.message}
                  </Text>
                )}
              </Box>
              <Box>
                <Text>Url tipo de acesso</Text>
                <Input {...register("tipoAcessoUrl")} />
                {errors?.tipoAcessoUrl?.message && (
                  <Text fontSize="xs" color="red">
                    {errors?.tipoAcessoUrl?.message}
                  </Text>
                )}
              </Box>
              <Box>
                <SelectRoot
                  value={[watch("ambiente")]}
                  onValueChange={({ value }) => {
                    setValue("ambiente", ...value);
                  }}
                  collection={options}
                >
                  <SelectLabel>Ambiente</SelectLabel>
                  <SelectTrigger>
                    <SelectValueText />
                  </SelectTrigger>
                  <SelectContent zIndex="9999">
                    {options?.items?.map((item) => (
                      <SelectItem item={item} key={item?.key}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
                {errors?.ambiente?.message && (
                  <Text fontSize="xs" color="red">
                    {errors?.ambiente?.message}
                  </Text>
                )}
              </Box>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger>
                <Button variant="surface">Cancelar</Button>
              </DialogActionTrigger>

              <Button
                disabled={
                  onCreateAplicativo.isPending || onUpdateAplicativo.isPending
                }
                type="submit"
                variant="surface"
                colorPalette="blue"
              >
                Salvar
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
