export function createLocationSlug(city, state) {
  if (!city && !state) return "";

  const parts = [city, state]
    .filter(Boolean)
    .map((part) =>
      part
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    );

  return parts.join("-");
}
