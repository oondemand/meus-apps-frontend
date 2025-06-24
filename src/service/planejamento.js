import { api } from "../config/api";

const sincronizarEsteira = async () => {
  return api.post("/planejamento/sincronizar-esteira");
};

const listarServicos = async ({ filters }) => {
  const { searchTerm, ...rest } = filters;
  const { data } = await api.get("/planejamento/listar-servicos", {
    params: rest,
  });

  return data;
};

const estatisticas = async () => {
  const { data } = await api.get("/planejamento/estatisticas");

  return data;
};

const processarMultiplosServicos = async ({ ids, statusProcessamento }) => {
  const { data } = await api.post(`/planejamento/processar-servicos`, {
    ids,
    statusProcessamento,
  });
  return data;
};

const processarServico = async ({ id, body }) => {
  const { data } = await api.post(
    `/planejamento/processar-servico/${id}`,
    body
  );

  return data;
};

export const PlanejamentoService = {
  sincronizarEsteira,
  listarServicos,
  estatisticas,
  processarMultiplosServicos,
  processarServico,
};
