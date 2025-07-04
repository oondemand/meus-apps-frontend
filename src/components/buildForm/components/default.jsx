import { Box, Text } from "@chakra-ui/react";

export const DefaultContainer = ({ children, label }) => {
  return (
    <Box
      border="1px dashed"
      borderColor="gray.200"
      borderRadius="lg"
      pt="5"
      pb="6"
      px="6"
    >
      {label && (
        <Text fontWeight="semibold" fontSize="md" color="gray.600" mb="6">
          {label}
        </Text>
      )}
      {children}
    </Box>
  );
};
