import { Badge } from "@/components/ui/badge";
import { contributionMeta, type ContributionId } from "../../../content/projects";
import { contributionIcons } from "@/lib/icons";

export function ContributionChip({ id }: { id: ContributionId }) {
  const meta = contributionMeta[id];
  const Icon = contributionIcons[meta.icon];

  return (
    <Badge variant="chip">
      <Icon strokeWidth={2} />
      {meta.label}
    </Badge>
  );
}

export function ContributionRow({ ids }: { ids: ContributionId[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ids.map((id) => (
        <ContributionChip key={id} id={id} />
      ))}
    </div>
  );
}
