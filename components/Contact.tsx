import React, { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { SOCIAL_LINKS } from "../constants";

/**
 * Contact.tsx
 * Clean, production-ready contact component using EmailJS (client) with a server fallback.
 *
 * Requirements (Vite):
 *  - .env: VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
 *  - Restart dev server after editing .env
 *
 * If you prefer a server approach, implement POST /api/send-email that accepts JSON:
 * { user_name, user_email, message }
 */

// Read Vite env vars
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);

  useEffect(() => {
    console.log("EmailJS envs:", { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY });
    if (PUBLIC_KEY) {
      try {
        emailjs.init(PUBLIC_KEY);
        console.log("EmailJS initialized");
      } catch (err) {
        console.warn("emailjs.init failed:", err);
      }
    } else {
      console.warn("VITE_EMAILJS_PUBLIC_KEY not set. Client EmailJS will not work until configured.");
    }
  }, []);

  const buildTemplateParams = (formEl: HTMLFormElement) => {
    const fd = new FormData(formEl);
    const user_name = String(fd.get("user_name") ?? "");
    const user_email = String(fd.get("user_email") ?? "");
    const message = String(fd.get("message") ?? "");

    return { user_name, user_email, message };
  };

  const sendViaEmailJS = async (formEl: HTMLFormElement) => {
    // Validate IDs at runtime (TypeScript non-null assertions used after this check)
    if (!SERVICE_ID || !TEMPLATE_ID) {
      throw new Error("Missing EmailJS service/template ID");
    }

    const templateParams = buildTemplateParams(formEl);
    console.log("EmailJS: sending params", templateParams);

    // emailjs.init(PUBLIC_KEY) was called in useEffect; call send with non-null IDs
    return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
  };

  // Server fallback (optional) - implement /api/send-email on your backend
  const sendViaServer = async (payload: { user_name: string; user_email: string; message: string }) => {
    // Adjust URL if your backend is on a different origin (e.g., http://localhost:5000/api/send-email)
    return fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    // Determine missing config
    const missing: string[] = [];
    if (!SERVICE_ID) missing.push("VITE_EMAILJS_SERVICE_ID");
    if (!TEMPLATE_ID) missing.push("VITE_EMAILJS_TEMPLATE_ID");
    if (!PUBLIC_KEY) missing.push("VITE_EMAILJS_PUBLIC_KEY");

    if (missing.length > 0) {
      setStatus(`Email config missing: ${missing.join(", ")}. Attempting server fallback if available.`);
    } else {
      setStatus("Sending via EmailJS...");
    }

    setSending(true);

    try {
      if (missing.length === 0) {
        // Client-side send
        const resp = await sendViaEmailJS(formRef.current);
        console.log("EmailJS send response:", resp);
        setStatus("Message sent! Check your inbox and EmailJS dashboard.");
        formRef.current.reset();
      } else {
        // Try server fallback
        const fd = new FormData(formRef.current);
        const payload = {
          user_name: String(fd.get("user_name") ?? ""),
          user_email: String(fd.get("user_email") ?? ""),
          message: String(fd.get("message") ?? ""),
        };
        const serverResp = await sendViaServer(payload);
        if (serverResp.ok) {
          const json = await serverResp.json().catch(() => ({}));
          console.log("/api/send-email response:", json);
          setStatus("Message sent via server fallback!");
          formRef.current.reset();
        } else {
          const text = await serverResp.text().catch(() => "");
          console.error("/api/send-email failed:", serverResp.status, text);
          setStatus(`Server fallback failed (status ${serverResp.status}). Check server logs.`);
        }
      }
    } catch (err: any) {
      console.error("Send error:", err);
      // Friendly mapping of common issues
      const text = String(err?.text ?? err?.message ?? err);
      if (err?.status === 403 || text.toLowerCase().includes("permission")) {
        setStatus("Auth failed — check service/template/public key in EmailJS dashboard.");
      } else if (err?.status === 400 || text.toLowerCase().includes("template")) {
        setStatus("Bad request — check EmailJS template placeholders (user_name, user_email, message).");
      } else {
        setStatus("Failed to send. See console & EmailJS dashboard for details.");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center relative py-20">
      <div className="container mx-auto px-6 max-w-2xl text-center">
        <h2 className="text-5xl font-bold mb-8 text-slate-900 dark:text-white transition-colors">Let's Connect</h2>

        <div className="glass-panel p-8 rounded-3xl mb-12 transition-colors">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 text-left">
            <div>
              <label className="block text-sm text-slate-600 dark:text-gray-400 mb-2">Name</label>
              <input
                name="user_name"
                type="text"
                required
                placeholder="Your name"
                className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-gray-700 rounded-lg p-3 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 dark:text-gray-400 mb-2">Email</label>
              <input
                name="user_email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-gray-700 rounded-lg p-3 text-white"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 dark:text-gray-400 mb-2">Message</label>
              <textarea
                name="message"
                rows={4}
                required
                placeholder="Write your message..."
                className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-gray-700 rounded-lg p-3 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className={`w-full py-4 rounded-lg font-bold text-white transition ${sending ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"}`}
            >
              {sending ? "Sending…" : "Send Message"}
            </button>

            {status && (
              <p className={`text-center mt-2 ${status.toLowerCase().includes("failed") || status.toLowerCase().includes("auth") ? "text-red-500" : "text-green-500"}`}>
                {status}
              </p>
            )}
          </form>
        </div>

        <div className="flex justify-center gap-8">
          <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" className="text-slate-500 hover:scale-125">
            <Github size={32} />
          </a>
          <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noreferrer" className="text-slate-500 hover:scale-125">
            <Linkedin size={32} />
          </a>
          <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noreferrer" className="text-slate-500 hover:scale-125">
            <Twitter size={32} />
          </a>
          <a href={SOCIAL_LINKS.email} className="text-slate-500 hover:scale-125">
            <Mail size={32} />
          </a>
        </div>

        <footer className="mt-20 text-slate-500 dark:text-gray-600 text-sm">© {new Date().getFullYear()} Soumyajeet Das. All rights reserved.</footer>
      </div>
    </section>
  );
};

export default Contact;
