import { storageKeys } from "../constants/storageKeys";
import { demoTasks } from "../data/demoTasks";
import type { Task, TaskInput } from "../types/task";
import { createId } from "../utils/ids";
import { migrateTasks } from "../utils/migration";
import { applyStatusUpdate } from "../utils/selectors";
import { calculateHighValueScore } from "../utils/scoring";
import { useLocalStorage } from "./useLocalStorage";

function buildTask(input: TaskInput): Task {
  const now = new Date().toISOString();
  const highValueScore = calculateHighValueScore(input);
  return {
    ...input,
    id: createId("task"),
    highValueScore,
    createdAt: now,
    updatedAt: now,
    completedAt: input.status === "done" ? now : null,
  };
}

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(storageKeys.tasks, demoTasks, migrateTasks);

  function createTask(input: TaskInput) {
    const task = buildTask(input);
    setTasks((current) => [task, ...current]);
    return task;
  }

  function updateTask(taskId: string, input: Partial<TaskInput>) {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== taskId) return task;
        const merged = { ...task, ...input, updatedAt: new Date().toISOString() };
        merged.highValueScore = calculateHighValueScore(merged);
        if (input.status === "done" && !merged.completedAt) {
          merged.completedAt = new Date().toISOString();
        }
        if (input.status && input.status !== "done") {
          merged.completedAt = null;
        }
        return merged;
      }),
    );
  }

  function updateTaskStatus(taskId: string, status: Task["status"]) {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== taskId) return task;
        const updates = applyStatusUpdate(task, status);
        return { ...task, ...updates, highValueScore: calculateHighValueScore(task) };
      }),
    );
  }

  function deleteTask(taskId: string) {
    setTasks((current) => current.filter((task) => task.id !== taskId));
  }

  function deleteTasksForProject(projectId: string) {
    setTasks((current) => current.filter((task) => task.projectId !== projectId));
  }

  function moveTasksToProject(fromProjectId: string, toProjectId: string) {
    const now = new Date().toISOString();
    setTasks((current) =>
      current.map((task) =>
        task.projectId === fromProjectId
          ? {
              ...task,
              projectId: toProjectId,
              areaId: null,
              phaseId: null,
              milestoneId: null,
              epicId: null,
              taskGroupId: null,
              updatedAt: now,
            }
          : task,
      ),
    );
  }

  return {
    tasks,
    setTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    deleteTasksForProject,
    moveTasksToProject,
  };
}
