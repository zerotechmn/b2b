"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Building2, CalendarPlus, CassetteTape, PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import CreateContract from "./form-step/contract";
import CustomerForm from "./customer-form";
import { Form, useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { z_vendorCreateSchema } from "@/app/api/[[...route]]/vendor-route";
import CreateVendorForm from "./form-step/vendor";

export default function Page() {
  const form = useForm<z.infer<typeof z_vendorCreateSchema>>({
    // resolver: zodResolver(z_vendorCreateSchema),
  });

  // const form = useForm();
  function onSubmit2222(values: z.infer<typeof z_vendorCreateSchema>) {
    console.log("Dataaa");
    console.log(values);

    // const response = await api.vendor.create
    //   .$post({
    //     json: values,
    //   })
    //   .then((res) => {
    //     console.log(res);
    //   });
  }

  ("use server");
  const onSubmit = (data: z.infer<typeof z_vendorCreateSchema>) => {
    console.log(data);
  };

  return (
    <main className="m-8">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="">
            <div className="flex flex-row justify-between">
              <div>
                <p className="text-xl text-bold">
                  Байгууллагын гэрээний дэлгэрэнгүй мэдээлэл
                </p>
                <p className="pb-8">Sub title</p>
              </div>
              <div>
                <Button type="submit" className="w-200">
                  Хадгалах
                </Button>
              </div>
            </div>
            <Separator />
          </div>
          <Tabs
            defaultValue="vendor"
            className="w-full flex flex-row justify-start items-start h-full mt-6"
          >
            <TabsList className="flex flex-col w-full w-[260px] rounded-md bg-white">
              <TabsTrigger
                className={cn(
                  "data-[state=active]:bg-surface-surface3 w-full py-3 px-0  justify-start items-start"
                )}
                value="vendor"
              >
                <div className="flex">
                  <div className="bg-primary w-1"></div>
                  <div className="pl-4">
                    <Building2 className="h-5" />
                  </div>
                  <div className="pl-2"> Байгууллага</div>
                </div>
              </TabsTrigger>

              <TabsTrigger
                className={cn(
                  "data-[state=active]:bg-surface-surface3 w-full py-3 px-0  justify-start items-start"
                )}
                value="geree"
              >
                <div className="flex">
                  <div className="bg-primary w-1"></div>
                  <div className="pl-4">
                    <CassetteTape className="h-5" />
                  </div>
                  <div className="pl-2"> Гэрээ</div>
                </div>
              </TabsTrigger>
              <TabsTrigger
                className={cn(
                  "data-[state=active]:bg-surface-surface3 w-full py-3 px-0  justify-start items-start"
                )}
                value="hariltsagch"
              >
                <div className="flex">
                  <div className="bg-primary w-1"></div>
                  <div className="pl-4">
                    <CalendarPlus className="h-5" />
                  </div>
                  <div className="pl-2"> Харилцагч</div>
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent className="w-full ml-8" value="vendor">
              <CreateVendorForm />
            </TabsContent>

            <TabsContent className="w-full ml-8" value="geree">
              <CreateContract />
            </TabsContent>
            <TabsContent className="w-full ml-8" value="hariltsagch">
              <CustomerForm />
            </TabsContent>
          </Tabs>
        </form>
      </FormProvider>
    </main>
  );
}
