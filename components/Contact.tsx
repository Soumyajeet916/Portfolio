import React, { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { SOCIAL_LINKS } from "../constants";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);

  useEffect(() => {
    if (PUBLIC_KEY) {
      try {
        emailjs.init(PUBLIC_KEY);
        // eslint-disable-next-line no-console
        console.log("EmailJS initialized");
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("Failed to init EmailJS:", err);
      }
    } else {
      // eslint-disable-next-line no-console
      console.warn("VITE_EMAILJS_PUBLIC_KEY not set. Email won't work until configured.");
    }
  }, []);

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;

    setSending(true);
    setStatus("Sending...");

    try {
      const resp = await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current);
      // eslint-disable-next-line no-console
      console.log("EmailJS success", resp);
      setStatus("Message Sent! I will get back to you soon.");
      form.current.reset();
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error("EmailJS error:", err);
      setStatus("Failed to send. Check console and EmailJS dashboard for details.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center relative py-20">
      <div className="container mx-auto px-6 max-w-2xl text-center">
        <h2 className="text-5xl font-bold mb-8 text-slate-900 dark:text-white transition-colors">
          Let's Connect
        </h2>

        <div className="glass-panel p-8 rounded-3xl mb-12 transition-colors">
          <form ref={form} onSubmit={sendEmail} className="space-y-6 text-left">
            <div>
              <label className="block text-sm text-slate-600 dark:text-gray-400 mb-2">Name</label>
              <input
                name="user_name"
                type="text"
                required
                className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-gray-700 rounded-lg p-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 dark:text-gray-400 mb-2">Email</label>
              <input
                name="user_email"
                type="email"
                required
                className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-gray-700 rounded-lg p-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 dark:text-gray-400 mb-2">Message</label>
              <textarea
                name="message"
                rows={4}
                required
                className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-gray-700 rounded-lg p-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="Write your message..."
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className={`w-full py-4 rounded-lg font-bold text-white transition shadow-lg ${
                sending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90"
              }`}
            >
              {sending ? "Sending…" : "Send Message"}
            </button>

            {status && (
              <p
                className={`text-center mt-2 ${
                  status.toLowerCase().startsWith("failed") ? "text-red-500" : "text-green-500"
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
            rel="noopener noreferrer"
            className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:scale-125 transition-all"
          >
            <Github size={32} />
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-125 transition-all"
          >
            <Linkedin size={32} />
          </a>
          <a
            href={SOCIAL_LINKS.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 dark:text-gray-400 hover:text-black dark:hover:text-sky-400 hover:scale-125 transition-all"
            aria-label="X (Twitter)"
          >
            <Twitter size={32} />
          </a>
          <a
            href={SOCIAL_LINKS.email}
            className="text-slate-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:scale-125 transition-all"
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
