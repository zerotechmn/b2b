"use client";

import { PaymentDateSelector } from "@/components/payment-date-selector";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { currencyFormat, truncateFormat } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function Header() {
  return (
    <Card className="bg-white border-0 py-2">
      <CardHeader>
        <div className="grid md:grid-cols-2 sm:grid-cols-1">
          <div className="md:mr-auto sm:items-center flex flex-column md:ml-2 items-center justify-center ">
            <TextMasterCard
              title="Мастер Картын үлдэгдэл"
              text={currencyFormat(2300000000)}
            />
            <TextColumn title="Картын дугаар" text="509809987584" />
            <TextColumn title="Эзэмшигч" text="Билгүүн Мөнхбат" />
          </div>
          <div className="md:ml-auto sm:items-center justify-center flex">
            {/* <Button variant="ghost">
              <Plus className="md:mr-2 h-4 w-4" /> Цэнэглэх заавар
            </Button>
            <Button variant="outline" className="bg-primary text-white">
              <Plus className="md:mr-2 h-4 w-4" /> Толгой карт цэнэглэх
            </Button> */}
            <PaymentDateSelector
              setPaymentSchedule={(e) => console.log("props:", e)}
            />
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
    <div className="md:mr-10">
      <p className="text-xs text-gray-500 uppercase">{title}</p>
      <p className="md:text-base sm:text-xs  font-semibold text-black ">
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
    <div className="md:mr-10 sm:justify-center sm:items-center">
      <p className="truncate text-xs text-gray-500 uppercase">{title}</p>
      <p className="md:text-xl sm:text-xs font-semibold text-black">
        {truncateFormat(text.toString(), 17)}
      </p>
    </div>
  );
}
