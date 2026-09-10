/**
 * Responsive image sources. Cloudinary URLs get a width-based srcset with automatic
 * format; any other URL is passed through untouched. Add your own CDN rule here.
 */
export type ImageRole = 'hero' | 'inline' | 'thumb';

const WIDTHS: Record<ImageRole, number[]> = { hero: [640, 960, 1200], inline: [640, 960], thumb: [320, 480, 640] };
const SIZES: Record<ImageRole, string> = {
  hero: '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px',
  inline: '(max-width: 768px) 100vw, 960px',
  thumb: '(max-width: 768px) 100vw, 33vw',
};

export function isCloudinary(url: string): boolean {
  return url.includes('res.cloudinary.com/') && url.includes('/image/upload/');
}

function cloudinaryWithTransform(url: string, transform: string): string {
  const m = url.match(/^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?:[^/]+\/)*?(v\d+\/)?(.+)$/);
  if (!m) return url;
  const rest = m[3].replace(/^(?:[a-z]_[^/]+\/)+/, '');
  return `${m[1]}${transform}/${m[2] ?? ''}${rest}`;
}

export function responsive(url: string, role: ImageRole = 'inline'): { src: string; srcset?: string; sizes?: string } {
  if (!isCloudinary(url)) return { src: url };
  const widths = WIDTHS[role];
  const srcset = widths.map((w) => `${cloudinaryWithTransform(url, `w_${w},q_85,f_auto`)} ${w}w`).join(', ');
  return { src: cloudinaryWithTransform(url, `w_${widths[widths.length - 1]},q_85,f_auto`), srcset, sizes: SIZES[role] };
}
