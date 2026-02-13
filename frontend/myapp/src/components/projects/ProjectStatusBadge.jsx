import { PROJECT_STATUSES } from "../../shared/constants/gameConstants";

export default function ProjectStatusBadge({ status }) {
  const statusConfig = PROJECT_STATUSES.find(s => s.value === status) || PROJECT_STATUSES[0];
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${statusConfig.color}`}>
      <span>{statusConfig.icon}</span>
      <span>{statusConfig.label}</span>
    </span>
  );
}