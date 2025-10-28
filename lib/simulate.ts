export function simulate(initial: number, monthly: number, years: number, annualRate: number) {
  const months = Math.max(0, Math.round(years * 12));
  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
  let balance = Number(initial || 0);
  const history: { year: number; balance: number }[] = [];
  for (let m = 1; m <= months; m++) {
    balance += Number(monthly || 0);
    balance *= 1 + monthlyRate;
    if (m % 12 === 0) history.push({ year: m / 12, balance: Math.round(balance * 100) / 100 });
  }
  return { balance: Math.round(balance * 100) / 100, history };
}