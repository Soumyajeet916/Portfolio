// Vite environment type declarations for ImportMeta.env
// Add any VITE_... variables used in the app below so TypeScript recognizes them.
interface ImportMetaEnv {
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
  // Allow other VITE_ prefixed env vars as optional strings
  readonly [key: `VITE_${string}`]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
