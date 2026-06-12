// ⚠️ AES-GCM helpers — PREPARED FOR THE FUTURE, NOT WIRED INTO THE APP.
//
// Use only after activating the external Supabase (phase 3). All health data
// currently uses lightweight Base64 obfuscation in localStorage and stays on device.

const enc = new TextEncoder();
const dec = new TextDecoder();

export const importAesKey = async (rawBase64: string): Promise<CryptoKey> => {
  const raw = Uint8Array.from(atob(rawBase64), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);
};

export const generateAesKey = async (): Promise<string> => {
  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
  const raw = new Uint8Array(await crypto.subtle.exportKey("raw", key));
  return btoa(String.fromCharCode(...raw));
};

export const encryptAES = async (data: unknown, key: CryptoKey): Promise<string> => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(JSON.stringify(data))),
  );
  const merged = new Uint8Array(iv.length + ct.length);
  merged.set(iv);
  merged.set(ct, iv.length);
  return btoa(String.fromCharCode(...merged));
};

export const decryptAES = async <T,>(payloadBase64: string, key: CryptoKey): Promise<T> => {
  const bytes = Uint8Array.from(atob(payloadBase64), (c) => c.charCodeAt(0));
  const iv = bytes.slice(0, 12);
  const ct = bytes.slice(12);
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return JSON.parse(dec.decode(pt)) as T;
};
