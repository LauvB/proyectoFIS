export const PRODUCT_PRICES = {
  size: {
    s: 0,
    m: 0,
    l: 5000,
    xl: 5000,
  },
  material: {
    algodon: 0,
    licra: 5000,
  },
} as const;

export const STAMP_PRICE = 10000;
export const BASE_PRICE = 60000; //El precio base no tiene incluido el precio de la estampa

export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
};
