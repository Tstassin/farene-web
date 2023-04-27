export const price = (price: number) => {
  const safePrice = Math.round((isNaN(price) ? 0 : price) * 100) / 100
  return safePrice
}

export const mult = (price1: number, price2: number) => {
  return price(price(price1) * price(price2))
}

export const eur = (price1: number) => {
  return price(price1).toFixed(2) + '€'
}