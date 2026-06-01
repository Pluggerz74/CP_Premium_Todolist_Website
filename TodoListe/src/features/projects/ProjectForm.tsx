import { FormEvent, useState } from "react";
import { projectTemplates } from "../../data/templates";
import type { ProjectTemplateId } from "../../types/template";
import { Button } from "../../components/ui/Button";

type ProjectFormProps = {
  onSubmit: (input: {
    name: string;
    description: string;
    goal: string;
    templateId: ProjectTemplateId;
  }) => void;
  onCancel: () => void;
};

export function ProjectForm({ onSubmit, onCancel }: ProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [templateId, setTemplateId] = useState<ProjectTemplateId>("simple-todo");

  const selectedTemplate = projectTemplates.find((template) => template.id === templateId);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      goal: goal.trim(),
      templateId,
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Project name
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Echo Realms" />
      </label>
      <label>
        Template
        <select value={templateId} onChange={(event) => setTemplateId(event.target.value as ProjectTemplateId)}>
          {projectTemplates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </label>
      {selectedTemplate ? (
        <p className="form__hint">
          {selectedTemplate.description} — {selectedTemplate.complexityMode === "complex" ? "includes planning areas" : "flat task workflow"}.
        </p>
      ) : null}
      <label>
        Description
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What is this project about?"
        />
      </label>
      <label>
        Goal
        <input value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="What does success look like?" />
      </label>
      <div className="form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Project</Button>
      </div>
    </form>
  );
}
