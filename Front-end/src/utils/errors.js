export function extractErrorMessage(err, fallback = "Ocurrio un error inesperado") {
  const data = err?.response?.data;
  if (!data) return err?.message || fallback;
  if (typeof data === "string") return data;
  if (data.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
    return Object.values(data.fieldErrors).join(" | ");
  }
  return data.message || data.error || fallback;
}
