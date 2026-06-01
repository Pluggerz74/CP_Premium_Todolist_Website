import { storageKeys } from "../constants/storageKeys";
import { demoTasks } from "../data/demoTasks";
import type { Task, TaskInput } from "../types/task";
import { createId } from "../utils/ids";
import { useLocalStorage } from "./useLocalStorage";

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(storageKeys.tasks, demoTasks);

  function createTask(input: TaskInput) {
    const now = new Date().toISOString();
    const task: Task = {
      ...input,
      id: createId("task"),
      createdAt: now,
      updatedAt: now,
    };
    setTasks((current) => [task, ...current]);
  }

  function updateTask(taskId: string, input: Partial<TaskInput>) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, ...input, updatedAt: new Date().toISOString() } : task,
      ),
    );
  }

  function deleteTask(taskId: string) {
    setTasks((current) => current.filter((task) => task.id !== taskId));
  }

  return { tasks, setTasks, createTask, updateTask, deleteTask };
}
