export const bigintToNumber = (value: bigint, decimals = 18) => {
  return Number(value) / Math.pow(10, decimals);
};
