import * as XLSX from "xlsx";

export const handleExportData = async (onExportData) => {
  const data = await onExportData();

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "exported");

  XLSX.writeFile(workbook, "exported.xlsx", {
    type: "buffer",
  });
};

export const ExportData = ({ dataToExport, label = "Exportar (Excel)" }) => {
  return (
    <button
      style={{ cursor: "pointer" }}
      onClick={() => handleExportData(dataToExport)}
    >
      {label}
    </button>
  );
};
