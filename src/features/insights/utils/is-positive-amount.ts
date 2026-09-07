export function isPositiveAmount(amount: string): boolean {
  return (
    amount !== "" && !Number.isNaN(Number(amount)) && Number(amount) > 0
  );
}