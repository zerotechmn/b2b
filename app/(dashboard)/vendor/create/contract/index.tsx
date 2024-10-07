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
  SelectItem,
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
import { Button } from "@/components/ui/button";
import { PaymentDateSelector } from "@/components/payment-date-selector";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { VendorCreateFormSchema } from "../page";

export default function CreateContract() {
  const { setValue } = useFormContext<VendorCreateFormSchema>();

  return (
    <div key="contract">
      <div className="flex flex-row">
        <div className="w-1/2 pr-6 ">
          <CustomSelectBox
            name="Дотоод байгууллагын нэр"
            list={convertPgEnum(localEntityEnum)}
            selectedItem={(value) =>
              setValue(
                "contract.localEntity",
                value as
                  | "Шунхлай ХХК"
                  | "Шунхлай Трейдинг ХХК"
                  | "Шунхлай Говь ХХК"
                  | "Шунхлай Петролиум ХХК"
                  | "Эс жи ханги гейт ХХК"
                  | "Эс эи шивээ хүрэн депо ХХК"
              )
            }
            selectedItemName="contract.localEntity"
            placeHolder="Дотоод байгууллагын нэрээ сонгоно уу"
          />
        </div>
        <div className="w-1/2">
          <CustomSelectBox
            name="Борлуулалтын суваг"
            list={convertPgEnum(salesChannelEnum)}
            selectedItem={(value) =>
              setValue("contract.salesChannel", value as "RETAIL" | "BULK")
            }
            selectedItemName="contract.salesChannel"
            placeHolder="Борлуулалтын сувагаа сонгоно уу"
          />
        </div>
      </div>
      <div className="flex flex-row pt-5">
        <div className="w-1/2 pr-6">
          <CustomSelectBox
            name="Борлуулалтын бүс"
            list={convertPgEnum(zoneEnum)}
            selectedItem={(value) =>
              setValue(
                "contract.zone",
                value as
                  | "Баруун бүс"
                  | "Говийн бүс"
                  | "Дархан бүс"
                  | "Зүүн бүс"
                  | "Орхон бүс"
                  | "Сайншанд бүс"
                  | "Төв бүс-1 бүс"
                  | "Төв бүс-2 бүс"
                  | "Хангайн бүс"
              )
            }
            selectedItemName="contract.zone"
            placeHolder="Борлуулалтын бүс сонгоно уу"
          />
        </div>
        <div className="w-1/2">
          <CustomSelectBox
            name="Борлуулалтын бүс хариуцсан ажилтны мэдээлэл"
            list={convertPgEnum(localEntityEnum)}
            selectedItem={(value) =>
              setValue(
                "contract.localEntity",
                value as
                  | "Шунхлай ХХК"
                  | "Шунхлай Трейдинг ХХК"
                  | "Шунхлай Говь ХХК"
                  | "Шунхлай Петролиум ХХК"
                  | "Эс жи ханги гейт ХХК"
                  | "Эс эи шивээ хүрэн депо ХХК"
              )
            }
            selectedItemName=""
            placeHolder="Борлуулалтын бүс хариуцсан ажилтны мэдээлэл"
          />
        </div>
      </div>
      <div className="flex flex-row pt-5">
        <div className="w-1/2 pr-6">
          <CustomSelectBox
            name="ААНБ-н өмчийн хэлбэр"
            list={convertPgEnum(ownershipTypeEnum)}
            selectedItem={(value) =>
              setValue("contract.ownership", value as "PERSONAL" | "STATE")
            }
            selectedItemName="contract.ownership"
            placeHolder="ААНБ-н өмчийн хэлбэрээ оруулна уу"
          />
        </div>
        <div className="w-1/2">
          <CustomSelectBox
            name="Гэрээний нөхцөл"
            list={convertPgEnum(contractTypeEnum)}
            selectedItem={(value) =>
              setValue(
                "contract.contractType",
                value as "PRE_PAID" | "POST_PAID"
              )
            }
            selectedItemName="contract.contractType"
            placeHolder="Гэрээний нөхцөлөө оруулна уу"
          />
        </div>
      </div>

      {/* <div className="w-1/2 pr-6">
        <FormField
          name="contract.period"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Үргэлжлэх хугацаа</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pr-6 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-white border-slate-200 border rounded-lg"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={field.value}
                    // onSelect={(e) => setValue("contract.period", e!)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />
      </div> */}
      <div className="flex flex-row pt-5">
        <div className="w-1/2 pr-6">
          <FormField
            name="contract.startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Гэрээ хийсэн огноо</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pr-6 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Гэрээ хийсэн огноо</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white border-slate-200 border rounded-lg"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="w-1/2">
          <FormField
            name="contract.expiresAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Гэрээ дуусах огноо</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 pr-6 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Гэрээ дуусах огноо</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white border-slate-200 border rounded-lg"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      {/* <div className="w-full">
        <FormField
          name="contract.period"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Period</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 pr-6 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Гэрээ дуусах огноо</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-white border-slate-200 border rounded-lg"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    // {...register("contract.period")}
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />
      </div> */}
      <div className="flex flex-row pt-5">
        <div className="w-1/2 pr-6">
          <FormField
            name="contract.maximumLoanAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Зээлийн эрх</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Зээлийн эрх"
                    onChange={(e) =>
                      setValue(
                        "contract.maximumLoanAmount",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-1/2">
          <FormField
            name="contract.penaltyChargePercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Алдангийн хэмжээ</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Алдангийн хэмжээ"
                    onChange={(e) =>
                      setValue(
                        "contract.penaltyChargePercentage",
                        parseInt(e.target.value)
                      )
                    }
                  />
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
            setPaymentSchedule={(e) => {
              console.log(e);

              setValue("contract.paymentType", e.frequency);
              setValue("contract.paymentDateType", e.type);
              setValue("contract.weekOfMonth", e.weekOfMonth);
              setValue("contract.dayOfWeek", e.dayOfWeek);
              setValue("contract.daysAfter", e.daysAfter);
              setValue("contract.sameDayEachMonth", e.dayOfMonth);
            }}
          />
        </div>
        <div className="w-1/2">
          <FormField
            name="contract.discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Урамшуулал</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Урамшуулал"
                    onChange={(e) =>
                      setValue("contract.discount", parseInt(e.target.value))
                    }
                  />
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
            selectedItem={(value) =>
              setValue(
                "contract.eReceipt",
                value as "BULK" | "SINGLE" | "RECEIPT_FREE"
              )
            }
            selectedItemName="contract.eReceipt"
            placeHolder="И баримт сонгоно уу"
          />
        </div>
      </div>
      <div className="flex flex-row pt-5">
        <div className="w-full "> {/* <CustomAddBranchInfo />{" "} */}</div>
      </div>
    </div>
  );
}

export function CustomSelectBox({
  name,
  list,
  selectedItem,
  selectedItemName,
  placeHolder,
}: {
  name: String;
  list: Record<string, string>;
  selectedItem: (value: string) => void;
  selectedItemName: string;
  placeHolder: string;
}) {
  return (
    <FormField
      name={selectedItemName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{name}</FormLabel>
          <Select onValueChange={selectedItem} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeHolder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.values(list).map((value) => {
                // eslint-disable-next-line react/jsx-key
                return (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                );
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
