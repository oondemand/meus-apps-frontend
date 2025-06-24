import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid, GridItem, Box, Text } from "@chakra-ui/react";
import { z } from "zod";

const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

function buildNestedSchema(fields) {
  const flattenFields = [];

  const flatten = (arr) => {
    for (const field of arr) {
      if (field.group) {
        flatten(field.group);
      } else {
        flattenFields.push(field);
      }
    }
  };

  flatten(fields);

  const schemaStructure = flattenFields.reduce((acc, field) => {
    if (!field.accessorKey || !field.validation) return acc;

    const parts = field.accessorKey.split(".");
    let currentLevel = acc;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      if (isLast) {
        currentLevel[part] = field.validation;
      } else {
        if (!currentLevel[part] || currentLevel[part] instanceof z.ZodType) {
          currentLevel[part] = {};
        }
        currentLevel = currentLevel[part];
      }
    }

    return acc;
  }, {});

  const createRecursiveSchema = (structure) => {
    const entries = Object.entries(structure)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        if (value instanceof z.ZodType) {
          return [key, value];
        }
        return [key, createRecursiveSchema(value)];
      });

    return z.object(Object.fromEntries(entries));
  };

  return createRecursiveSchema(schemaStructure);
}

export const BuildForm = ({
  visibleState,
  fields,
  onSubmit,
  data,
  gap,
  gridColumns = 4,
  disabled,
  shouldUseFormValues = false,
  ...props
}) => {
  const schema = buildNestedSchema(fields);

  const formConfig = {
    mode: "onBlur",
    resolver: zodResolver(schema),
    shouldFocusError: false,
  };

  if (shouldUseFormValues) {
    formConfig.values = { ...data };
  } else {
    formConfig.defaultValues = { ...data };
  }

  const methods = useForm(formConfig);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = methods;

  const renderField = (field) => {
    const { render, ...rest } = field;

    const isVisible =
      visibleState?.[field.accessorKey] === undefined
        ? true
        : visibleState?.[field.accessorKey];

    return (
      <GridItem
        display={isVisible ? "block" : "none"}
        key={field.accessorKey}
        colSpan={field?.colSpan || 1}
      >
        {field.render({
          getInitialValue: () => getNestedValue(data, field.accessorKey),
          initialValue: getNestedValue(data, field.accessorKey),
          field: register(field.accessorKey),
          error: getNestedValue(errors, field.accessorKey)?.message,
          methods,
          disabled,
          ...rest,
          ...props,
          ...methods,
        })}
      </GridItem>
    );
  };

  return (
    <FormProvider {...methods}>
      <form onBlur={handleSubmit(onSubmit)}>
        <Grid
          alignItems="baseline"
          templateColumns={`repeat(${gridColumns}, 1fr)`}
          gap={gap}
        >
          {fields.map((fieldOrGroup, idx) => {
            if (fieldOrGroup.group) {
              const Wrapper =
                fieldOrGroup.wrapperComponent ||
                (({ children }) => (
                  <Box
                    border="1px dashed"
                    borderColor="gray.200"
                    borderRadius="md"
                    py="6"
                    px="6"
                  >
                    {fieldOrGroup.label && (
                      <Text fontWeight="bold" mb={4}>
                        {fieldOrGroup.label}
                      </Text>
                    )}
                    {children}
                  </Box>
                ));

              return (
                <GridItem key={`group-${idx}`} colSpan={gridColumns}>
                  <Wrapper group={fieldOrGroup}>
                    <Grid
                      templateColumns={`repeat(${gridColumns}, 1fr)`}
                      gap={gap}
                    >
                      {fieldOrGroup.group.map(renderField)}
                    </Grid>
                  </Wrapper>
                </GridItem>
              );
            } else {
              return renderField(fieldOrGroup);
            }
          })}
        </Grid>
      </form>
    </FormProvider>
  );
};
