import {
  faPlaneDeparture,
  faBus,
  faTrain,
  faShip,
} from "@fortawesome/free-solid-svg-icons";

const normalizeTransportValue = (value) =>
  (value || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const getTransportIconByMethod = (method) => {
  const normalized = normalizeTransportValue(method);

  if (!normalized) return faPlaneDeparture;

  if (
    normalized.includes("brod") ||
    normalized.includes("brodom") ||
    normalized.includes("kruzer") ||
    normalized.includes("krstaren") ||
    normalized.includes("trajekt") ||
    normalized.includes("ferry")
  ) {
    return faShip;
  }

  if (
    normalized.includes("vlak") ||
    normalized.includes("train") ||
    normalized.includes("rail") ||
    normalized.includes("zeljezn") ||
    normalized.includes("zelezn")
  ) {
    return faTrain;
  }

  if (
    normalized.includes("autobus") ||
    normalized.includes("autobusom") ||
    normalized.includes("bus")
  ) {
    return faBus;
  }

  if (
    normalized.includes("avion") ||
    normalized.includes("avionom") ||
    normalized.includes("zrakoplov") ||
    normalized.includes("let") ||
    normalized.includes("flight")
  ) {
    return faPlaneDeparture;
  }

  return faPlaneDeparture;
};
