import { Card } from "./Card";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="empty-state">
      <div className="empty-state__icon">✦</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </Card>
  );
}
