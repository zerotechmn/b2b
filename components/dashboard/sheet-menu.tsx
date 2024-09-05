import Link from "next/link";
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  Icon: any;
  href: string;
  selected?: boolean;
  showBadge?: boolean;
  badgeCount?: number;
}

export function SheetMenu({ title, Icon, href, selected = false, showBadge = false, badgeCount = 0 }: Props) {
  return <Link
    href={href}
    className={cn("mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground", selected && "bg-muted text-foreground")}
  >
    <Icon className="h-5 w-5" />
    {title}
    {showBadge && <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
      {badgeCount}
    </Badge>}
  </Link>
}