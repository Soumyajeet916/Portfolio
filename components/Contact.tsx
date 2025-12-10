import React, { useRef, useState } from "react";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { SOCIAL_LINKS } from "../constants";

// Vite env variables
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    console.log("SERVICE_ID:", SERVICE_ID);
    console.log("TEMPLATE_ID:", TEMPLATE_ID);
    console.log("PUBLIC_KEY:", PUBLIC_KEY);

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus("❌ Missing EmailJS config (.env values)");
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      const formData = new FormData(formRef.current);

      // REQUIRED by EmailJS REST /send-form
      formData.append("service_id", SERVICE_ID);
      formData.append("template_id", TEMPLATE_ID);
      formData.append("user_id", PUBLIC_KEY);

      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send-form", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      console.log("EmailJS response:", res.status, text);

      if (!res.ok) {
        throw new Error(text || `HTTP ${res.status}`);
      }

      setStatus("✅ Message sent successfully!");
      formRef.current.reset();
    } catch (err: any) {
      console.error("EmailJS Error:", err);
      setStatus(`❌ Failed to send message: ${err?.message || "Unknown error"}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center py-20">
      <div className="container mx-auto px-6 max-w-2xl text-center">
        <h2 className="text-5xl font-bold mb-8 text-slate-900 dark:text-white">
          Let's Connect
        </h2>

        <div className="glass-panel p-8 rounded-3xl mb-12">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 text-left">
            {/* Name */}
            <div>
              <label className="block text-sm text-slate-600 dark:text-gray-400 mb-2">
                Name
              </label>
              <input
                name="name" // 🔗 matches {{name}}
                type="text"
                required
                placeholder="Your name"
                className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-gray-700 rounded-lg p-3 text-white"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-slate-600 dark:text-gray-400 mb-2">
                Email
              </label>
              <input
                name="email" // 🔗 matches {{email}}
                type="email"
                required
                placeholder="you@example.com"
                className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-gray-700 rounded-lg p-3 text-white"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm text-slate-600 dark:text-gray-400 mb-2">
                Message
              </label>
              <textarea
                name="message" // 🔗 matches {{message}}
                rows={4}
                required
                placeholder="Write your message..."
                className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-gray-700 rounded-lg p-3 text-white"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={sending}
              className={`w-full py-4 rounded-lg font-bold text-white transition ${
                sending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
              }`}
            >
              {sending ? "Sending…" : "Send Message"}
            </button>

            {/* Status */}
            {status && (
              <p
                className={`text-center mt-2 ${
                  status.startsWith("❌") ? "text-red-500" : "text-green-500"
                }`}
              >
                {status}
              </p>
            )}
          </form>
        </div>

        <div className="flex justify-center gap-8">
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noreferrer"
            className="text-slate-500 hover:scale-125 transition-transform"
          >
            <Github size={32} />
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-slate-500 hover:scale-125 transition-transform"
          >
            <Linkedin size={32} />
          </a>
          <a
            href={SOCIAL_LINKS.twitter}
            target="_blank"
            rel="noreferrer"
            className="text-slate-500 hover:scale-125 transition-transform"
          >
            <Twitter size={32} />
          </a>
          <a
            href={SOCIAL_LINKS.email}
            className="text-slate-500 hover:scale-125 transition-transform"
          >
            <Mail size={32} />
          </a>
        </div>

        <footer className="mt-20 text-slate-500 dark:text-gray-600 text-sm">
          © {new Date().getFullYear()} Soumyajeet Das. All rights reserved.
        </footer>
      </div>
    </section>
  );
};

export default Contact;
