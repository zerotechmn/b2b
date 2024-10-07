import { PaymentDateSelector } from "@/components/payment-date-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function Home() {
  // const me = await getUser();

  return (
    <Card>
      <CardHeader>
        <span>Менежерийн мэдээлэл</span>
      </CardHeader>
      <CardContent>
        <div
          className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-4"
          x-chunk="dashboard-02-chunk-1"
        >
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no data
            </h3>
            <p className="text-sm text-muted-foreground">Lorem ipsum</p>
            <Button className="mt-4">Test</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
