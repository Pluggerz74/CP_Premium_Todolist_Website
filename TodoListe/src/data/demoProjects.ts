import type { Project } from "../types/project";

export const demoProjects: Project[] = [
  {
    id: "project-todolist",
    name: "High Value Todo",
    description: "Build a premium project command center that can become a SaaS product.",
    status: "active",
    color: "#7c3aed",
    goal: "Ship a polished version 1 and deploy it to Hetzner.",
    createdAt: "2026-06-01T08:00:00.000Z",
  },
  {
    id: "project-brand",
    name: "Personal Brand System",
    description: "Create content and assets that communicate expertise and taste.",
    status: "active",
    color: "#0ea5e9",
    goal: "Build a repeatable content workflow.",
    createdAt: "2026-06-01T08:10:00.000Z",
  },
  {
    id: "project-automation",
    name: "Automation Engine",
    description: "Automate repetitive business and productivity workflows.",
    status: "active",
    color: "#10b981",
    goal: "Save at least five hours per week.",
    createdAt: "2026-06-01T08:20:00.000Z",
  },
  {
    id: "project-learning",
    name: "Skill Compounding",
    description: "Improve high-leverage technical, design, and business skills.",
    status: "paused",
    color: "#f97316",
    goal: "Build rare skills that compound over time.",
    createdAt: "2026-06-01T08:30:00.000Z",
  }
];
