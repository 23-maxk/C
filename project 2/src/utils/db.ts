import { Estimate } from "../components/EstimateCreator";

export function loadCustomerEstimates(customerId: string | number): Estimate[] {
  const key = keyFor(customerId);
  return JSON.parse(localStorage.getItem(key) || "[]");
}

export function saveCustomerEstimates(customerId: string | number, estimates: Estimate[]) {
  const key = keyFor(customerId);
  localStorage.setItem(key, JSON.stringify(estimates));
}

export function findEstimateByToken(token: string): Estimate | null {
  const allKeys = Object.keys(localStorage).filter(k => k.startsWith("estimates_customer_"));
  for (const k of allKeys) {
    const list: Estimate[] = JSON.parse(localStorage.getItem(k) || "[]");
    const match = list.find(e => e.token === token);
    if (match) return match;
  }
  return null;
}

export function upsertEstimate(estimate: Estimate) {
  const key = keyFor(estimate.customerId);
  const list: Estimate[] = JSON.parse(localStorage.getItem(key) || "[]");
  const idx = list.findIndex(e => e.id === estimate.id);
  if (idx === -1) list.push(estimate); else list[idx] = estimate;
  localStorage.setItem(key, JSON.stringify(list));
}

function keyFor(customerId: string | number) {
  return `estimates_customer_${customerId}`;
}