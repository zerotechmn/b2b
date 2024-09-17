import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  Icon: any;
  href: string;
  selected?: boolean;
  showBadge?: boolean;
  badgeCount?: number;
}

export function MenuItem({
  title,
  Icon,
  href,
  selected = false,
  showBadge = false,
  badgeCount = 0,
}: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        selected && "text-primary bg-muted"
      )}
    >
      <Icon className="h-4 w-4" />
      {title}
      {showBadge && (
        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
          {badgeCount}
        </Badge>
      )}
    </Link>
  );
}
