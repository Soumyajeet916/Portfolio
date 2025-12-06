import { Project, Skill } from './types';

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Fake News Detector",
    description: "AI-powered web app to identify and flag fake news articles.",
    tech: ["React", "Google Gemini AI", "Tailwind"],
    link: "https://fakenewsdetector-0nby.onrender.com/",
    github: "https://github.com/Soumyajeet916/FakeNewsDetector",
    image: "https://picsum.photos/600/400?random=1"
  },
  {
    id: 2,
    title: "Talkify",
    description: "A Chat application with real-time messaging and media sharing features.",
    tech: ["React", "Node.js", "MongoDB", "Socket.io","Cloudinary","Express","Tailwind","JWT"],
    link: "https://talkify-hc2m.onrender.com/",
    github: "https://github.com/Soumyajeet916/Talkify",
    image: "https://picsum.photos/600/400?random=2"
  },
  
];

export const SKILLS: Skill[] = [
  // Frontend
  { name: "React / Next.js", category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "Framer Motion", category: "frontend" },

  // Backend
  { name: "Node.js", category: "backend" },
  { name: "Express.js", category: "backend" },
  { name: "JavaScript", category: "backend" },
  { name: "TypeScript", category: "backend" },
  { name: "Java", category: "backend" },
  { name: "REST APIs", category: "backend" },
  { name: "Authentication (JWT, OAuth,clerk)", category: "backend" },

  // Database
  { name: "MongoDB / Mongoose", category: "database" },
  { name: "SQL", category: "database" },

  // DevOps & Tools
  { name: "Git / GitHub", category: "tools" },
  { name: "Vercel / Netlify Deployment", category: "tools" },
  { name: "Postman ", category: "tools" },

  // Other
  { name: "Problem Solving (DSA)", category: "other" },

];


export const SOCIAL_LINKS = {
  github: "https://github.com/Soumyajeet916",
  linkedin: "https://www.linkedin.com/in/soumyajeet-das-08140b250/",
  twitter: "https://x.com/Soumyajeet19", 
  email: "mailto:soumyajeetdas.sd@gmail.com",
  cv: "https://drive.google.com/file/d/1MkBaRmCEJoVUllnKaQm32e5XTPZ3C54s/view?usp=sharing"
};