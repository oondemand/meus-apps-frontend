import { api } from "../config/api";
import { ORIGENS } from "../constants/origens";

const listarPessoas = async ({ filters }) => {
  const { data } = await api.get("/pessoas", { params: filters });
  return data;
};

const obterPessoa = async ({ id }) => {
  const { data } = await api.get(`/pessoas/${id}`);
  return data;
};

const criarPessoa = async ({ body, origem }) => {
  const { data } = await api.post("/pessoas", body, {
    headers: { "x-origem": origem },
  });

  return data;
};

const atualizarPessoa = async ({ id, body, origem }) => {
  const { data } = await api.patch(`/pessoas/${id}`, body, {
    headers: { "x-origem": origem },
  });
  return data;
};

const excluirPessoa = async ({ id, origem }) => {
  return await api.delete(`/pessoas/${id}`, {
    headers: { "x-origem": origem },
  });
};

const importarPessoas = async ({ files }) => {
  const formData = new FormData();
  for (const file of files) {
    formData.append("file", file);
  }

  const response = await api.post("/pessoas/importar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

const exportarPessoas = async ({ filters }) => {
  const response = await api.get("/pessoas/exportar", { params: filters });

  return response;
};

export const PessoaService = {
  listarPessoas,
  obterPessoa,
  criarPessoa,
  atualizarPessoa,
  importarPessoas,
  excluirPessoa,
  exportarPessoas,
};
