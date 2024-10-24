"use client";
import { z_vendorCreateSchema } from "@/app/api/[[...route]]/vendor-route";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Building2,
  CalendarPlus,
  CassetteTape,
  Loader,
  Router,
} from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import CustomerForm from "./customer-form";
import CreateContract from "./contract";
import CreateVendorForm from "./vendor";
import { useToast } from "@/components/hooks/use-toast";
import { useRouter } from "next/navigation";
import { submitForm } from "./validation";
import { api } from "@/lib/api";
import { auth } from "@/auth";
import { useSession } from "next-auth/react";

export type VendorCreateFormSchema = z.infer<typeof z_vendorCreateSchema>;

export default function Page() {
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof z_vendorCreateSchema>>({
    defaultValues: {},
    // resolver: zodResolver(z_vendorCreateSchema),
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: z.infer<typeof z_vendorCreateSchema>) => {
    console.log("on sub");
    // const { data: success, errors } = await submitForm(data);

    if (errors) {
      toast({ title: "Алдаа гарлаа", variant: "destructive" });
    }

    if (true) {
      try {
        const response = await api.vendor.create.$post(
          {
            json: data,
          },
          {
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          }
        );

        console.log("res", response);
        if (response.status == 200) {
          toast({ title: "Амжилттай бүртгүүллээ", variant: "default" });
          router.replace("/vendor");
        }
      } catch (e) {
        toast({ title: "Алдаа гарлаа", variant: "destructive" });
      }
    }
  };

  return (
    <main className="m-8">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onError={(e) => console.log("form error", e)}
          className="space-y-4"
        >
          <div className="">
            <div className="flex flex-row justify-between">
              <div className="pb-8">
                <p className="text-xl text-bold">
                  Байгууллагын гэрээний дэлгэрэнгүй мэдээлэл
                </p>
                <p className="text-sm text-slate-500">Байгууллага бүртгэх</p>
              </div>
              <div>
                <Button type="submit" className="p-6">
                  {isSubmitting ? <Loader /> : "Хадгалах"}
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
                  "data-[state=active]:bg-surface-surface3 w-full py-3 px-0 justify-start items-start"
                )}
                value="vendor"
              >
                <div className="flex">
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
                  <div className="pl-4">
                    <CalendarPlus className="h-5" />
                  </div>
                  <div className="pl-2"> Харилцагч</div>
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent className="w-full ml-8" value="vendor">
              <CreateVendorForm errorsww={errors} />
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
