import { Badge, Box, Flex } from "@chakra-ui/react";

export const AplicativosCell = ({ getValue, row, ...rest }) => {
  const aplicativos = getValue();

  return (
    <Box>
      <Flex gap="2">
        {row?.original?.tipo === "master" && (
          <Badge colorPalette="orange">Todos</Badge>
        )}

        {row?.original?.tipo !== "master" &&
          aplicativos?.map(({ aplicativo, tipoAcesso }) => {
            return (
              <Box key={aplicativo?._id}>
                <Badge colorPalette="purple">
                  {aplicativo?.nome} - {tipoAcesso}
                </Badge>
              </Box>
            );
          })}
      </Flex>
    </Box>
  );
};
