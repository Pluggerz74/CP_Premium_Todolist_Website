import type { Project } from "../types/project";

/** Stable id for the system inbox list — tasks move here when a list is deleted. */
export const INBOX_PROJECT_ID = "project-inbox";

const INBOX_CREATED = "2026-06-01T07:00:00.000Z";

export const inboxProjectSeed: Project = {
  id: INBOX_PROJECT_ID,
  name: "Inbox",
  description: "Default capture list for tasks without a project.",
  status: "active",
  color: "#64748b",
  goal: "Quick capture before sorting into lists.",
  complexityMode: "simple",
  templateId: "simple-todo",
  createdAt: INBOX_CREATED,
  updatedAt: INBOX_CREATED,
};

export function isInboxProject(projectId: string): boolean {
  return projectId === INBOX_PROJECT_ID;
}

export function ensureInboxInProjects(projects: Project[]): Project[] {
  if (projects.some((project) => project.id === INBOX_PROJECT_ID)) {
    return projects;
  }
  return [inboxProjectSeed, ...projects];
}
