export const formatRupiah = (value: number): string => {
  const formatted = new Intl.NumberFormat('id-ID').format(value);
  return `Rp${formatted}`;
};
