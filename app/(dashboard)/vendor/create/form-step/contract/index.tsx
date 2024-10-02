"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { signInSchema, vendorCreateSchema } from "@/lib/zod";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  contractTypeEnum,
  convertPgEnum,
  eReceiptEnum,
  localEntityEnum,
  ownershipTypeEnum,
  paymentDateTypeEnum,
  salesChannelEnum,
  zoneEnum,
} from "@/app/api/database/schema";
import { PgArray, PgEnum, PgEnumColumn } from "drizzle-orm/pg-core";

import { currencyFormat } from "@/lib/utils";
import { PaymentDateSelector } from "@/components/payment-date-selector";
import { Plus } from "lucide-react";

export default function CreateContract() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof vendorCreateSchema>>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(values: z.infer<typeof vendorCreateSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-row">
          <div className="w-1/2 pr-6 ">
            <CustomSelectBox
              name="Дотоод байгууллагын нэр"
              list={convertPgEnum(localEntityEnum)}
            />
          </div>
          <div className="w-1/2">
            <CustomSelectBox
              name="Борлуулалтын суваг"
              list={convertPgEnum(salesChannelEnum)}
            />
          </div>
        </div>
        <div className="flex flex-row pt-5">
          <div className="w-1/2 pr-6">
            <CustomSelectBox
              name="Борлуулалтын бүс"
              list={convertPgEnum(zoneEnum)}
            />
          </div>
          <div className="w-1/2">
            <CustomSelectBox
              name="Борлуулалтын бүс хариуцсан ажилтны мэдээлэл"
              list={localEntityEnum}
            />
          </div>
        </div>
        <div className="flex flex-row pt-5">
          <div className="w-1/2 pr-6">
            <CustomSelectBox
              name="ААНБ-н өмчийн хэлбэр"
              list={convertPgEnum(ownershipTypeEnum)}
            />
          </div>
          <div className="w-1/2">
            <CustomSelectBox
              name="Гэрээний нөхцөл"
              list={convertPgEnum(contractTypeEnum)}
            />
          </div>
        </div>
        {/* <div className="flex flex-row pt-5">
          <div className="w-1/2 pr-6">
            <CustomSelectBox name="Гэрээний хийсэн он" list={localEntityEnum} />
          </div>
          <div className="w-1/2">
            <CustomSelectBox name="Гэрээний дуусах он" list={localEntityEnum} />
          </div>
        </div> */}
        <div className="flex flex-row pt-5">
          <div className="w-1/2 pr-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Зээлийн эрх</FormLabel>
                  <FormControl>
                    <Input placeholder="Зээлийн эрх" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-1/2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Алдангийн хэмжээ</FormLabel>
                  <FormControl>
                    <Input placeholder="Алдангийн хэмжээ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-row pt-5">
          <div className="w-1/2 pr-6 ">
            <FormLabel>Төлбөр төлөх хугацаа</FormLabel>
            <div className="pb-2"></div>
            <PaymentDateSelector
              setPaymentSchedule={(e) => console.log("props:", e)}
            />
          </div>
          <div className="w-1/2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Урамшуулал</FormLabel>
                  <FormControl>
                    <Input placeholder="Урамшуулал" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-row pt-5">
          <div className="w-full ">
            <CustomSelectBox
              name="И баримт"
              list={convertPgEnum(eReceiptEnum)}
            />
          </div>
        </div>
        <div className="flex flex-row pt-5">
          <div className="w-full ">
            <CustomAddBranchInfo />
          </div>
        </div>
      </form>
    </Form>
  );
}

export function CustomSelectBox({
  name,
  list,
}: {
  name: String;
  list: Object;
}) {
  return (
    <FormField
      // control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{name}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a verified email to display" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.values(list).map((value) => {
                // eslint-disable-next-line react/jsx-key
                return <SelectItem value={value}>{value}</SelectItem>;
              })}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CustomAddBranchInfo({}) {
  return (
    <div className="bg-surface-surface2 p-8 border-2">
      <div className="flex flex-row ">
        <div className="w-1/3 pr-6">
          <CustomSelectBox name="" list={localEntityEnum} />
        </div>
        <div className="w-1/3 pr-6">
          <CustomSelectBox name="" list={localEntityEnum} />
        </div>
        <div className="w-1/3">
          <CustomSelectBox name="" list={localEntityEnum} />
        </div>
      </div>
      <div>
        <div className="flex flex-row justify-end items-center mt-6 ">
          <Plus className="h-4 w-4" />
          <p className="text-base">Дахин бүтээгдэхүүн нэмэх</p>
        </div>
      </div>
    </div>
  );
}
