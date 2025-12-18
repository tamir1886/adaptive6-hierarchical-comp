export function formatBytes(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    let n = bytes;
    let u = 0;
    while (n >= 1024 && u < units.length - 1) {
      n /= 1024;
      u++;
    }
    const fixed = u === 0 ? 0 : n < 10 ? 1 : 0;
    return `${n.toFixed(fixed)} ${units[u]}`;
  }
  