import { createCipheriv, createDecipheriv, randomBytes, createHash } from "crypto";

// Derive a 32-byte AES-256 key from the BETTER_AUTH_SECRET env var.
// We use SHA-256 so any secret length works without padding issues.
function getEncryptionKey(): Buffer {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "BETTER_AUTH_SECRET is required for credential encryption. Set it in your .env file.",
    );
  }
  return createHash("sha256").update(secret).digest();
}

/**
 * Encrypt a plain-text JSON object using AES-256-GCM.
 * Returns a string in the format:  iv:ciphertext:authTag  (all hex-encoded).
 */
export function encryptCredential(data: Record<string, unknown>): string {
  const key = getEncryptionKey();
  const iv = randomBytes(12); // 96-bit IV recommended for GCM
  const cipher = createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${encrypted}:${authTag}`;
}

/**
 * Decrypt credential data produced by encryptCredential().
 * Also handles legacy plain-JSON data gracefully (auto-migration path).
 */
export function decryptCredential(stored: string): Record<string, unknown> {
  // Legacy fallback: if the stored value is plain JSON, parse it directly.
  // This allows a smooth migration — old credentials still work.
  if (stored.startsWith("{") || stored.startsWith("[")) {
    try {
      return JSON.parse(stored);
    } catch {
      // Not valid JSON either — fall through to decrypt
    }
  }

  const parts = stored.split(":");
  if (parts.length !== 3) {
    throw new Error(
      "Invalid encrypted credential format. Expected iv:ciphertext:authTag",
    );
  }

  const [ivHex, ciphertext, authTagHex] = parts;
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertext, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return JSON.parse(decrypted);
}
