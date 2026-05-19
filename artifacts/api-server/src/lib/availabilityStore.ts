export interface BlockedDate {
  date: string;
  reason: string;
}

const store = new Map<number, BlockedDate[]>();

export function getBlockedDates(userId: number): BlockedDate[] {
  return store.get(userId) ?? [];
}

export function blockDate(userId: number, date: string, reason: string): BlockedDate {
  const existing = store.get(userId) ?? [];
  const entry: BlockedDate = { date, reason: reason.slice(0, 80) };
  const filtered = existing.filter(d => d.date !== date);
  store.set(userId, [...filtered, entry]);
  return entry;
}

export function unblockDate(userId: number, date: string): boolean {
  const existing = store.get(userId);
  if (!existing) return false;
  const filtered = existing.filter(d => d.date !== date);
  store.set(userId, filtered);
  return true;
}

export function getBlockedDatesByUserId(userId: number): BlockedDate[] {
  return store.get(userId) ?? [];
}
