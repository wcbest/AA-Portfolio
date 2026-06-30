import { clsx } from "clsx"

export function cn(...inputs) {
  return clsx(inputs)
}

const MAX_TEASER_BYTES = 15 * 1024 * 1024 // 15MB

const SIGNATURES = {
  pdf:  { magic: [0x25, 0x50, 0x44, 0x46], contentType: 'application/pdf',  ext: 'pdf'  },
  jpg:  { magic: [0xFF, 0xD8, 0xFF],        contentType: 'image/jpeg',        ext: 'jpg'  },
  png:  { magic: [0x89, 0x50, 0x4E, 0x47],  contentType: 'image/png',         ext: 'png'  },
}

// Checks actual size and file-signature bytes — the accept attribute is trivially bypassed by renaming.
export async function validateTeaserFile(file) {
  if (!file) return { valid: false, error: "No file selected." }
  if (file.size > MAX_TEASER_BYTES) {
    return { valid: false, error: "File is too large (max 15MB)." }
  }
  const header = new Uint8Array(await file.slice(0, 4).arrayBuffer())
  for (const [, sig] of Object.entries(SIGNATURES)) {
    if (sig.magic.every((byte, i) => header[i] === byte)) {
      return { valid: true, contentType: sig.contentType, ext: sig.ext }
    }
  }
  return { valid: false, error: "File must be a PDF, JPG, or PNG." }
}

export function teaserContentType(path) {
  const ext = (path || '').split('.').pop().toLowerCase()
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg'
  if (ext === 'png') return 'image/png'
  return 'application/pdf'
}

export function isImagePath(path) {
  const ext = (path || '').split('.').pop().toLowerCase()
  return ext === 'jpg' || ext === 'jpeg' || ext === 'png'
}
