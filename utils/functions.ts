export function getDays(distance: number) {
  return Math.floor(distance / (1000 * 60 * 60 * 24));
}

export function getHours(distance: number) {
  return Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
}

export function getMinutes(distance: number) {
  return Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
}

export function getSeconds(distance: number) {
  return Math.floor((distance % (1000 * 60)) / 1000);
}

export function toDate(...args: number[]) {
  return args.map((arg) => (arg > 9 ? arg : "0" + arg)).join(":");
}

export function getDiscountedPrize(discount: number = 0, prize: number) {
  return (prize * (100 - discount)) / 100;
}
