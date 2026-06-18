export function nullableText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

export function nullableNumber(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  if (!text) return null;

  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}
