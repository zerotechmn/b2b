"use client";
import {
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
import { useFormContext } from "react-hook-form";
import {
  contractTypeEnum,
  convertPgEnum,
  eReceiptEnum,
  localEntityEnum,
  ownershipTypeEnum,
  salesChannelEnum,
  zoneEnum,
} from "@/app/api/database/schema";

import { PaymentDateSelector } from "@/components/payment-date-selector";
import { Plus } from "lucide-react";

export default function CreateContract() {
  const { register } = useFormContext();

  return (
    <div>
      <div className="flex flex-row">
        <div className="w-1/2 pr-6 ">
          <CustomSelectBox
            name="Дотоод байгууллагын нэр"
            list={convertPgEnum(localEntityEnum)}
            selectedItem={register("localEntity")}
            selectedItemName="localEntity"
          />
        </div>
        <div className="w-1/2">
          <CustomSelectBox
            name="Борлуулалтын суваг"
            list={convertPgEnum(salesChannelEnum)}
            selectedItem={register("salesChannel")}
            selectedItemName="salesChannel"
          />
        </div>
      </div>
      <div className="flex flex-row pt-5">
        <div className="w-1/2 pr-6">
          <CustomSelectBox
            name="Борлуулалтын бүс"
            list={convertPgEnum(zoneEnum)}
            selectedItem={register("zone")}
            selectedItemName="zone"
          />
        </div>
        <div className="w-1/2">
          <CustomSelectBox
            name="Борлуулалтын бүс хариуцсан ажилтны мэдээлэл"
            list={localEntityEnum}
            selectedItem={register("localEntity")}
            selectedItemName="zone"
          />
        </div>
      </div>
      <div className="flex flex-row pt-5">
        {/* <div className="w-1/2 pr-6">
          <CustomSelectBox
            name="ААНБ-н өмчийн хэлбэр"
            list={convertPgEnum(ownershipTypeEnum)}
            selectedItem={register("localEntity")}
          />
        </div> */}
        <div className="w-1/2">
          <CustomSelectBox
            name="Гэрээний нөхцөл"
            list={convertPgEnum(contractTypeEnum)}
            selectedItem={register("contractType")}
            selectedItemName="zocontractTypene"
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Зээлийн эрх</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Зээлийн эрх"
                    {...register("managerEmail")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-1/2">
          <FormField
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
            selectedItem={register("eReceipt")}
            selectedItemName="eReceipt"
          />
        </div>
      </div>
      <div className="flex flex-row pt-5">
        <div className="w-full ">{/* <CustomAddBranchInfo /> */}</div>
      </div>
    </div>
  );
}

export function CustomSelectBox({
  name,
  list,
  selectedItem,
  selectedItemName,
}: {
  name: String;
  list: Object;
  selectedItem: any;
  selectedItemName: string;
}) {
  return (
    <FormField
      name={selectedItemName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{name}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a verified email to display" />
              </SelectTrigger>
            </FormControl>
            <SelectContent ref={selectedItem}>
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

// export function CustomAddBranchInfo({}) {
//   return (
//     <div className="bg-surface-surface2 p-8 border-2">
//       <div className="flex flex-row ">
//         <div className="w-1/3 pr-6">
//           <CustomSelectBox
//             name=""
//             list={localEntityEnum}
//             selectedItem={register("localEntity")}
//           />
//         </div>
//         <div className="w-1/3 pr-6">
//           <CustomSelectBox
//             name=""
//             list={localEntityEnum}
//             selectedItem={register("localEntity")}
//           />
//         </div>
//         <div className="w-1/3">
//           <CustomSelectBox
//             name=""
//             list={localEntityEnum}
//             selectedItem={register("localEntity")}
//           />
//         </div>
//       </div>
//       <div>
//         <div className="flex flex-row justify-end items-center mt-6 ">
//           <Plus className="h-4 w-4" />
//           <p className="text-base">Дахин бүтээгдэхүүн нэмэх</p>
//         </div>
//       </div>
//     </div>
//   );
// }
