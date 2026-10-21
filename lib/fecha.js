export function hace(fecha) {
  const min = Math.floor((Date.now() - new Date(fecha).getTime()) / 60000);
  if (min < 60) return `hace ${Math.max(min, 1)} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} ${h === 1 ? "hora" : "horas"}`;
  const d = Math.floor(h / 24);
  if (d < 7) return `hace ${d} ${d === 1 ? "día" : "días"}`;
  const s = Math.floor(d / 7);
  return `hace ${s} ${s === 1 ? "semana" : "semanas"}`;
}