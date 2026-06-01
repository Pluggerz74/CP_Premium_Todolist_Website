import { Card } from "./Card";

type StatCardProps = {
  label: string;
  value: string | number;
  helper: string;
};

export function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <Card className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{helper}</small>
    </Card>
  );
}
