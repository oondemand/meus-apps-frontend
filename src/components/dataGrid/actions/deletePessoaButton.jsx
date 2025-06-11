import { IconButton } from "@chakra-ui/react";
import { Trash } from "lucide-react";
import { queryClient } from "../../../config/react-query";
import { useConfirmation } from "../../../hooks/useConfirmation";
import { Tooltip } from "../../ui/tooltip";
import { useDeletePessoa } from "../../../hooks/api/pessoa/useDeletePessoa";
import { ORIGENS } from "../../../constants/origens";

export const DeletePessoaAction = ({ id }) => {
  const { requestConfirmation } = useConfirmation();

  const deletePessoa = useDeletePessoa({
    onSuccess: () => queryClient.invalidateQueries(["listar-pessoas"]),
    origem: ORIGENS.DATAGRID,
  });

  const handleDeletePessoa = async () => {
    const { action } = await requestConfirmation({
      title: "Tem certeza que deseja excluir pessoa?",
      description: "Essa operação não pode ser desfeita.",
    });

    if (action === "confirmed") {
      await deletePessoa.mutateAsync({ id });
    }
  };

  return (
    <Tooltip
      content="Excluir pessoa"
      positioning={{ placement: "top" }}
      openDelay={700}
      closeDelay={50}
      contentProps={{
        css: {
          "--tooltip-bg": "white",
          color: "gray.600",
        },
      }}
    >
      <IconButton
        variant="surface"
        colorPalette="red"
        size="2xs"
        onClick={handleDeletePessoa}
      >
        <Trash />
      </IconButton>
    </Tooltip>
  );
};
