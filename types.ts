import { ThreeElements } from '@react-three/fiber';

export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  link: string;
  github: string;
  image: string;
}

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools'|'other';
}

export interface LeetCodeData {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
  ranking: number;
}

// 3D Prop Types
export interface CharacterProps {
  scrollProgress: number;
}

export enum Section {
  HERO = 'HERO',
  ABOUT = 'ABOUT',
  SKILLS = 'SKILLS',
  PROJECTS = 'PROJECTS',
  LEETCODE = 'LEETCODE',
  CONTACT = 'CONTACT',
}

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}