export const colorCategoryValues = [
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "cyan",
  "purple",
  "pink"
];

export const colorValues = colorCategoryValues.reduce((colors, baseColor) => {
  const variants = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  colors.push(...variants.map(v => baseColor + "." + v));
  return colors;
}, [] as string[]);

export const spaceValues = [
  "0",
  "2",
  "3",
  "4",
  "5",
  "6",
  "8",
  "10",
  "12",
  "16",
  "20",
  "24",
  "32",
  "40",
  "48",
  "56",
  "64"
];

export const sizeValues = [
  "xs",
  "sm",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl"
];
