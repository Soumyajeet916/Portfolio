/// <reference types="vite/client" />

// Provide Vite `import.meta.env` typings used throughout the app
interface ImportMetaEnv {
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
  // allow other env vars
  [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace JSX {
    // Permissive fallback: allow any JSX intrinsic element. This avoids many
    // r3f/three JSX errors while keeping TypeScript checks for the rest of
    // the codebase. If you prefer stricter typing, we can add explicit
    // r3f type mappings later.
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
