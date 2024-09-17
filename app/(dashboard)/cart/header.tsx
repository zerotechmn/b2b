import IconButton from "@/components/dashboard/icon-button";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { currencyFormat, truncateFormat } from "@/lib/utils";
import { Plus } from "lucide-react";

export default async function Header() {
  return (
    <Card className="bg-white border-0 py-2">
      <CardHeader className="">
        <div className="flex flex-row p-1">
          <div className="mr-auto flex flex-column ml-2">
            <TextMasterCard
              title="Мастер Картын үлдэгдэл"
              text={currencyFormat(2300000000)}
            />
            <TextColumn title="Картын дугаар" text="509809987584" />
            <TextColumn title="Эзэмшигч" text="Билгүүн Мөнхбат" />
          </div>
          <div className="ml-auto">
            <Button variant="ghost">
              <Plus className="mr-2 h-4 w-4" /> Цэнэглэх заавар
            </Button>
            <Button variant="outline" className="bg-primary text-white">
              <Plus className="mr-2 h-4 w-4" /> Толгой карт цэнэглэх
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export async function TextColumn({
  title,
  text,
}: {
  title: String;
  text: String;
}) {
  return (
    <div className="min-w-0 mr-10">
      <p className="truncate text-xs text-gray-500 uppercase">{title}</p>
      <p className="hidden text-m sm:block font-semibold text-black">
        {truncateFormat(text.toString(), 17)}
      </p>
    </div>
  );
}

export async function TextMasterCard({
  title,
  text,
}: {
  title: String;
  text: String;
}) {
  return (
    <div className="min-w-0 mr-10">
      <p className="truncate text-xs text-gray-500 uppercase">{title}</p>
      <p className="hidden text-xl sm:block font-semibold text-black">
        {truncateFormat(text.toString(), 17)}
      </p>
    </div>
  );
}
