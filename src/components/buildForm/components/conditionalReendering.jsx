import { Box } from "@chakra-ui/react";
import { useFormContext, useWatch } from "react-hook-form";
import { useMemo } from "react";

export const ConditionalRendering = ({ children, condition, ...props }) => {
  const { control } = useFormContext();
  const values = useWatch({ control });

  const isVisible = useMemo(() => {
    return condition(values);
  }, [values, condition]);

  if (!isVisible) return; 

  return <Box {...props}>{children}</Box>;
};
