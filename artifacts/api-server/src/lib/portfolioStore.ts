export interface PortfolioPhoto {
  id: number;
  url: string;
  caption: string;
  addedAt: string;
}

const store = new Map<number, PortfolioPhoto[]>();
let nextId = 1;

export function getPortfolio(userId: number): PortfolioPhoto[] {
  return store.get(userId) ?? [];
}

export function addPhoto(userId: number, url: string, caption: string): PortfolioPhoto {
  if (!url.startsWith("http")) throw new Error("URL must start with http");
  const list = store.get(userId) ?? [];
  if (list.length >= 20) throw new Error("Portfolio limit is 20 photos");
  const photo: PortfolioPhoto = { id: nextId++, url, caption: caption.slice(0, 120), addedAt: new Date().toISOString() };
  store.set(userId, [...list, photo]);
  return photo;
}

export function deletePhoto(userId: number, photoId: number): boolean {
  const list = store.get(userId);
  if (!list) return false;
  const filtered = list.filter(p => p.id !== photoId);
  if (filtered.length === list.length) return false;
  store.set(userId, filtered);
  return true;
}

export function getPortfolioByUserName(name: string): PortfolioPhoto[] {
  return [];
}

export function setPortfolioForUser(userId: number, photos: PortfolioPhoto[]): void {
  store.set(userId, photos);
}
