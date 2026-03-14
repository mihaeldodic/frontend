const normalizeForSlug = (value) =>
  (value || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const buildTravelDetailsPath = (continent, destinationSlug) => {
  const continentSlug = normalizeForSlug(continent) || "kontinent";
  const safeDestinationSlug = normalizeForSlug(destinationSlug);

  if (!safeDestinationSlug) {
    return "/putovanje";
  }

  return `/putovanje/kontinent/${continentSlug}/${safeDestinationSlug}`;
};
