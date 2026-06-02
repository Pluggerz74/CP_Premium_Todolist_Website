import { FormEvent, useState } from "react";
import { projectTemplates } from "../../data/templates";
import type { ProjectTemplateId } from "../../types/template";
import { useI18n } from "../../i18n/useI18n";
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
  const { t } = useI18n();
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
        {t("form.projectName")}
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={t("placeholder.projectName")}
        />
      </label>
      <label>
        {t("form.template")}
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
          {selectedTemplate.description} —{" "}
          {selectedTemplate.complexityMode === "complex"
            ? t("projectForm.templateHintComplex")
            : t("projectForm.templateHintSimple")}
          .
        </p>
      ) : null}
      <label>
        {t("label.description")}
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={t("placeholder.projectDescription")}
        />
      </label>
      <label>
        {t("form.goal")}
        <input
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          placeholder={t("placeholder.projectGoal")}
        />
      </label>
      <div className="form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t("btn.cancel")}
        </Button>
        <Button type="submit">{t("form.createProject")}</Button>
      </div>
    </form>
  );
}
