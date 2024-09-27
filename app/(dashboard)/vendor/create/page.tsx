import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { PlusIcon, SeparatorHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import CreateVendorForm from "./vendor-form";
import CreateContract from "./create-contract";

export const metadata: Metadata = {
  title: "Байгууллага | Админ",
};
export default function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  console.log(slug);

  return (
    <main className="m-8">
      <div>
        <p className="text-xl text-bold">
          Байгууллагын гэрээний дэлгэрэнгүй мэдээлэл
        </p>
        <p className="pb-8">Sub title</p>
        <Separator />
      </div>
      <Tabs
        defaultValue="vendor"
        className="w-full flex flex-row justify-start items-start h-full mt-6"
      >
        <TabsList className="flex flex-col w-full w-[230px] rounded-md bg-white">
          <TabsTrigger
            className={cn(
              "data-[state=active]:bg-surface-surface3 w-full py-3"
            )}
            value="vendor"
          >
            <PlusIcon className="h-5" />
            Байгууллага
          </TabsTrigger>

          <TabsTrigger
            className={cn(
              "data-[state=active]:bg-surface-surface3 w-full py-3"
            )}
            value="geree"
          >
            <PlusIcon className="h-5" />
            Password
          </TabsTrigger>
        </TabsList>
        <TabsContent className="w-full ml-8" value="vendor">
          <CreateVendorForm />
        </TabsContent>

        <TabsContent className="w-full ml-8" value="geree">
          <CreateContract />
        </TabsContent>
      </Tabs>
    </main>
  );
}
