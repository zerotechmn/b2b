import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { columns } from "./table-columns";
import IconButton from "@/components/dashboard/icon-button";
import { data } from "./make-data";
import { DataTable } from "@/components/data-table";
import { CreateVendor, UpdateInvoice } from "./buttons";

export default async function Page() {
  // auth
  return (
    <div className="bg-white">
      <div className="m-8 bg-white">
        <Card className="bg-white">
          <CardHeader className="bg-headerTable">
            <div className="flex items-center px-0">
              <div className="mr-auto">
                <IconButton iconName="settings" title="Хүснэгтийн тохиргоо" />
              </div>
              <div className="flex ml-auto">
                <div>
                  <IconButton iconName="settings" title="Файл татах" />
                </div>
                <div className="ml-4">
                  <CreateVendor />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable data={data} columns={columns}></DataTable>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
