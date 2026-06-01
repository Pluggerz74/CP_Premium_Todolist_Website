import { FormEvent, useState } from "react";
import type { ProjectInput } from "../../types/project";
import { Button } from "../../components/ui/Button";

const projectColors = ["#7c3aed", "#0ea5e9", "#10b981", "#f97316", "#f43f5e"];

type ProjectFormProps = {
  onSubmit: (input: ProjectInput) => void;
  onCancel: () => void;
};

export function ProjectForm({ onSubmit, onCancel }: ProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [color, setColor] = useState(projectColors[0]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim() || "A focused project with measurable progress.",
      goal: goal.trim() || "Create meaningful momentum.",
      status: "active",
      color,
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Project name
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Launch command center" />
      </label>
      <label>
        Description
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What is this project about?" />
      </label>
      <label>
        Goal
        <input value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="What does success look like?" />
      </label>
      <label>
        Accent color
        <select value={color} onChange={(event) => setColor(event.target.value)}>
          {projectColors.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <div className="form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Create Project</Button>
      </div>
    </form>
  );
}
