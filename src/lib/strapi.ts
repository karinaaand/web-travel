export function getMediaUrl(path?: string | null) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `https://extra-brooke-yeremiadio-46b2183e.koyeb.app${path}`;
}
