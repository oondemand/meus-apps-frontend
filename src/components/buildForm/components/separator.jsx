import { Box } from "@chakra-ui/react";

export const Separator = ({ children }) => {
  return (
    <Box>
      <Box>{children}</Box>
      <Box my="8" border="1px dashed" borderColor="gray.200" />
    </Box>
  );
};
