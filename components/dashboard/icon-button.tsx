import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default async function IconButton({
  title,
  iconName,
}: {
  title: String;
  iconName: any;
}) {
  return (
    <Button variant="outline" className="">
      <Settings className="mr-2 h-4 w-4 " /> {title}
    </Button>
  );
}
