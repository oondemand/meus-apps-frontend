import { Box } from "@chakra-ui/react";

export const Break = ({ children, ...props }) => {
  return (
    <Box>
      <Box>{children}</Box>
      <Box py="4" {...props} />
    </Box>
  );
};
