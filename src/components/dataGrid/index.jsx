import { Box, Table, Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { useMemo } from "react";
import { DebouncedInput } from "../DebouncedInput";
import { VisibilityControlDialog } from "../vibilityControlDialog";
import { MemoizedTableBody } from "./memoizedTableBody";
import { Pagination } from "./pagination";
import { TableHeader } from "./tableHeader";
import { TableFooter } from "./tableFooter";
import { MenuRoot, MenuItem, MenuContent, MenuTrigger } from "../ui/menu";

export const DataGrid = ({
  striped = true,
  TableBody = MemoizedTableBody,
  table: tableProps,
  rowCount,
  isDataLoading,
  data,
  form: Form,
  exportDataFn,
  importDataFn,
  title,
  onUpdateData,
}) => {
  const table = useReactTable({
    ...tableProps,
    data,
    rowCount,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: async (...props) => await onUpdateData(...props),
    },
  });

  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes = {};
    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

  const handleExportData = async (callback) => {
    const buffer = await callback();

    const byteArray = new Uint8Array(buffer?.data);
    const blob = new Blob([byteArray], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "exported");
  };

  return (
    <>
      <Box>
        <Flex
          w="full"
          alignItems="center"
          justifyContent="flex-start"
          pb="2"
          gap="4"
        >
          {title && (
            <Text fontSize="lg" fontWeight="semibold" color="gray.500">
              {title}
            </Text>
          )}
          {tableProps.globalFilter !== false && (
            <DebouncedInput
              value={tableProps?.filters?.searchTerm}
              debounce={700}
              onChange={(value) => {
                tableProps.setFilters((prev) => ({
                  ...prev,
                  searchTerm: value,
                  pageIndex: 0,
                }));
              }}
              size="sm"
              iconSize={18}
              startOffset="2px"
              color="gray.700"
            />
          )}
          <Button
            size="sm"
            variant="subtle"
            color="brand.500"
            fontWeight="semibold"
            onClick={tableProps.resetFilters}
            minW="32"
          >
            {isDataLoading && <Spinner size="md" />}
            {!isDataLoading && "Limpar filtros"}
          </Button>
          {Form && <Form />}

          {(importDataFn || exportDataFn) && (
            <MenuRoot>
              <MenuTrigger
                color="brand.500"
                focusRing="none"
                cursor="pointer"
                alignItems="baseline"
              >
                <Button
                  size="sm"
                  variant="subtle"
                  fontWeight="semibold"
                  color="brand.500"
                  _hover={{ backgroundColor: "gray.50" }}
                >
                  Excel
                </Button>
              </MenuTrigger>

              <MenuContent cursor="pointer">
                {importDataFn && (
                  <MenuItem
                    cursor="pointer"
                    value="importar-planilha"
                    onClick={importDataFn}
                  >
                    Importar planilha
                  </MenuItem>
                )}

                {exportDataFn && (
                  <>
                    <MenuItem
                      cursor="pointer"
                      onClick={() => handleExportData(() => exportDataFn(1))}
                      value="exportar-modelo"
                    >
                      Exportar modelo
                    </MenuItem>
                    <MenuItem
                      cursor="pointer"
                      onClick={() => handleExportData(() => exportDataFn())}
                      value="exportar"
                    >
                      Exportar datagrid
                    </MenuItem>
                  </>
                )}
              </MenuContent>
            </MenuRoot>
          )}

          <VisibilityControlDialog
            fields={tableProps?.columns.map((e) => ({
              label: e.header,
              accessorKey: e.accessorKey.replaceAll(".", "_"),
            }))}
            title="Ocultar colunas"
            setVisibilityState={table.setColumnVisibility}
            visibilityState={table.getState().columnVisibility}
          />
        </Flex>

        <Table.Root
          size="xs"
          overflowY="scroll"
          colorScheme="gray"
          {...columnSizeVars}
          width={`${table.getTotalSize()}px`}
          striped={striped}
        >
          <TableHeader
            filters={tableProps.filters}
            onFilterChange={tableProps.onFilterChange}
            table={table}
          />

          <TableBody
            data={table.options.data}
            columns={table.getVisibleLeafColumns()}
            rows={table.getRowModel().rows}
          />

          <TableFooter table={table} />
        </Table.Root>

        <Pagination table={table} />
      </Box>
    </>
  );
};
