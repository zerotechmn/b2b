import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { columns } from "./table-columns";
import IconButton from "@/components/dashboard/icon-button";
import Header from "./header";

import { data } from "./make-data";
import { DataTable } from "@/components/data-table";

export default async function Page() {
  // const listTitle: SubHeader[] = [
  //   {
  //     label: "Картууд сонгох",
  //     status: true,
  //     href: "",
  //   },
  //   {
  //     label: "Төлбөр төлөлт",
  //     status: false,
  //     href: "",
  //   },
  // ];

  return (
    <div className="bg-white">
      <Header />
      {/* <BreadcrumbCustom list={listTitle} /> */}

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
                  <IconButton iconName="settings" title="Файл оруулах" />
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
