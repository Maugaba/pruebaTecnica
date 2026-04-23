const currencyFmt = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 2,
});

export function formatCurrency(value) {
  if (value === null || value === undefined || isNaN(Number(value))) return "Q 0.00";
  return currencyFmt.format(Number(value));
}

export function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleString("es-GT", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
