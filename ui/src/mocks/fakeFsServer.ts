import type { FsFileKind, FsItem, FileItem, FolderItem } from "./types";

type FakeFsServerOptions = {
  delayMs?: number;     // default 1000
  errorRate?: number;   // 0..1, default 0
  minItems?: number;    // default 1
  maxItems?: number;    // default 5
  seed?: number;        // default 1337
  folderRatio?: number; // default 0.35
};

const FILE_KINDS: FsFileKind[] = ["doc", "png", "pdf", "mp3", "mp4", "zip", "txt", "tsx", "json"];
const NAME_ADJECTIVES = ["liable", "moaning", "safe", "integrated", "guilty", "gentle", "rapid", "silent", "brave", "curious"];
const NAME_ANIMALS = ["owl", "tapir", "ostrich", "bass", "egret", "fox", "koala", "panda", "wolf", "tiger"];

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function hash53(str: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)) >>> 0;
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function rand() {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function randInt(rand: () => number, min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function randomFileSizeBytes(rand: () => number, kind: FsFileKind): number {
  const r = (min: number, max: number) => randInt(rand, min, max);
  switch (kind) {
    case "png": return r(10_000, 3_000_000);
    case "mp3": return r(1_000_000, 10_000_000);
    case "mp4": return r(5_000_000, 200_000_000);
    case "zip": return r(200_000, 50_000_000);
    case "pdf": return r(50_000, 8_000_000);
    case "tsx":
    case "json":
    case "txt": return r(200, 200_000);
    case "doc":
    default: return r(5_000, 2_000_000);
  }
}

function makeStableId(parentId: string, name: string, seed: number) {
  const h = hash53(`${parentId}::${name}`, seed);
  return `${parentId}/${slugify(name)}-${h.toString(16)}`;
}

export class FakeFsServer {
  private cache = new Map<string, FsItem[]>();
  private opts: Required<FakeFsServerOptions>;

  constructor(options: FakeFsServerOptions = {}) {
    this.opts = {
      delayMs: options.delayMs ?? 1000,
      errorRate: options.errorRate ?? 0,
      minItems: options.minItems ?? 1,
      maxItems: options.maxItems ?? 5,
      seed: options.seed ?? 1337,
      folderRatio: options.folderRatio ?? 0.35,
    };
    console.log("[FakeFsServer] opts", this.opts);
  }

  async fetchChildren(parentId: string): Promise<FsItem[]> {
    const cached = this.cache.get(parentId);
    if (cached) {
      return cached;
    }

    await sleep(this.opts.delayMs);

    const randErr = mulberry32(hash53(`err::${parentId}`, this.opts.seed));
    if (randErr() < this.opts.errorRate) {
      throw new Error("Fake server error: failed to load folder children");
    }

    const rand = mulberry32(hash53(`data::${parentId}`, this.opts.seed));
    const isRoot = parentId === "root";

    const minItems = isRoot ? Math.max(this.opts.minItems, 3) : this.opts.minItems;
    const maxItems = isRoot ? Math.max(this.opts.maxItems, 6) : this.opts.maxItems;

    const count = randInt(rand, minItems, maxItems);
    // const count = randInt(rand, this.opts.minItems, this.opts.maxItems);

    const uniqueNames = new Set<string>();
    const items: FsItem[] = [];

    while (items.length < count) {
      const baseName = `${pick(rand, NAME_ADJECTIVES)}-${pick(rand, NAME_ANIMALS)}`;
      const foldersNeeded = isRoot ? 2 : 0;
const currentFolders = items.reduce((acc, x) => acc + (x.type === "folder" ? 1 : 0), 0);
      const isFolder =
      currentFolders < foldersNeeded
        ? true
        : rand() < this.opts.folderRatio;
      if (isFolder) {
        const name = baseName;
        if (uniqueNames.has(name)) continue;
        uniqueNames.add(name);

        const folder: FolderItem = {
          id: makeStableId(parentId, name, this.opts.seed),
          type: "folder",
          name,
          hasChildren: true,
        };
        items.push(folder);
      } else {
        const kind = pick(rand, FILE_KINDS);
        const name = `${baseName}.${kind}`;
        if (uniqueNames.has(name)) continue;
        uniqueNames.add(name);

        const file: FileItem = {
          id: makeStableId(parentId, name, this.opts.seed),
          type: "file",
          name,
          kind,
          sizeBytes: randomFileSizeBytes(rand, kind),
        };
        items.push(file);
      }
    }

    this.cache.set(parentId, items);
    return items;
  }

  clearCache() {
    this.cache.clear();
  }
}
