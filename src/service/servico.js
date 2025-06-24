import { api } from "../config/api";

const listarServicos = async ({ filters }) => {
  const { data } = await api.get("/servicos", { params: filters });
  return data;
};

const listarServicosPorPrestador = async ({ prestadorId, dataRegistro }) => {
  const { data } = await api.get(
    `/servicos/prestador/${prestadorId}?dataRegistro=${dataRegistro}`
  );
  return data;
};

const criarServico = async ({ body, origem }) => {
  const { data } = await api.post("/servicos", body, {
    headers: { "x-origem": origem },
  });
  return data;
};

const atualizarServico = async ({ id, body, origem }) => {
  const { data } = await api.patch(`servicos/${id}`, body, {
    headers: { "x-origem": origem },
  });
  return data;
};

const deletarServico = async ({ id, origem }) => {
  const { data } = await api.delete(`servicos/${id}`, {
    headers: { "x-origem": origem },
  });
  return data;
};

const importarServicos = async ({ files }) => {
  const formData = new FormData();
  for (const file of files) {
    formData.append("file", file);
  }

  const response = await api.post("servicos/importar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

const exportarServicos = async ({ filters }) => {
  const response = await api.get("/servicos/exportar", { params: filters });
  return response;
};

export const ServicoService = {
  listarServicos,
  criarServico,
  atualizarServico,
  importarServicos,
  deletarServico,
  listarServicosPorPrestador,
  exportarServicos,
};
