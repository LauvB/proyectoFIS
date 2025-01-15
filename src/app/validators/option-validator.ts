import { PRODUCT_PRICES } from "../config/product-prices";

export const COLORS = [
  { name: "Blanco", value: "white" },
  { name: "Negro", value: "black" },
  { name: "Azul", value: "#2293ed" },
  { name: "Verde", value: "#3cbc21" },
  { name: "Naranja", value: "#d8772e" },
  { name: "Rosado", value: "#f762b3" },
] as const;

export const SIZES = {
  name: "sizes",
  options: [
    {
      label: "S",
      value: "S",
      price: PRODUCT_PRICES.size.s,
    },
    {
      label: "M",
      value: "M",
      price: PRODUCT_PRICES.size.m,
    },
    {
      label: "L",
      value: "L",
      price: PRODUCT_PRICES.size.l,
    },
    {
      label: "XL",
      value: "XL",
      price: PRODUCT_PRICES.size.xl,
    },
  ],
} as const;

export const MATERIALS = {
  name: "materials",
  options: [
    {
      label: "Algodón",
      value: "Algodón",
      price: PRODUCT_PRICES.material.algodon,
    },
    {
      label: "Licra",
      value: "Licra",
      price: PRODUCT_PRICES.material.licra,
    },
  ],
} as const;

export const getColorFilter = (color: string) => {
  switch (color) {
    case "white":
      return "hue-rotate(0deg) saturate(0) brightness(2) contrast(0.6)";
    case "black":
      return "hue-rotate(0deg) saturate(0) brightness(0.3)";
    case "#2293ed":
      return "hue-rotate(220deg) saturate(1) brightness(1)";
    case "#3cbc21":
      return "hue-rotate(120deg) saturate(1) brightness(1)";
    case "#d8772e":
      return "hue-rotate(40deg) saturate(1) brightness(1)";
    case "#f762b3":
      return "hue-rotate(330deg) saturate(1) brightness(1)";
    default:
      return "hue-rotate(0deg) saturate(1) brightness(1)";
  }
};
