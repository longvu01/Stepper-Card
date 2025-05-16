// Parse up to first invalid char (allow negative, one dot, digits)
export const parseUpToInvalid = (raw: string) => {
  const s = raw.replace(/,/g, ".");
  // Allow '-', '.', '-.' as intermediate input
  if (s === "-" || s === "." || s === "-.") return s;
  // Find all valid numbers (including negative, floats)
  const matches = s.match(/-?(?:\d+\.\d*|\d+|\.\d+)/g);
  if (!matches || matches.length === 0) return "0";
  return matches[0];
};

export const parseInput = (raw: string) => {
  const sanitized = parseUpToInvalid(raw);
  const num = parseFloat(sanitized);
  return isNaN(num) ? 0 : num;
};
