import { clsx } from "clsx"

export function cn(...inputs) {
  return clsx(inputs)
}

const MAX_TEASER_BYTES = 15 * 1024 * 1024 // 15MB
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46] // "%PDF"

// Client-side hint only (accept=".pdf") is trivially bypassed by renaming a
// file. This checks actual size and file-signature bytes before upload.
export async function validatePdfFile(file) {
  if (!file) return { valid: false, error: "No file selected." }
  if (file.size > MAX_TEASER_BYTES) {
    return { valid: false, error: "File is too large (max 15MB)." }
  }
  const header = new Uint8Array(await file.slice(0, 4).arrayBuffer())
  const isPdf = PDF_MAGIC.every((byte, i) => header[i] === byte)
  if (!isPdf) {
    return { valid: false, error: "File is not a valid PDF." }
  }
  return { valid: true }
}
