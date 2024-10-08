"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";

interface CardModalProps {
  isOpen?: boolean;
  onSave?: (data: any) => void;
}

type Transaction = {
  cardNumber: string;
  balance: string;
  status: "Идэвхтэй" | "Идэвхгүй";
};

const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "cardNumber",
    header: "Картын дугаар",
  },
  {
    accessorKey: "balance",
    header: "Дансны үлдэгдэл",
  },
  {
    accessorKey: "status",
    header: "Төлөв",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          row.original.status === "Идэвхтэй"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {row.original.status}
      </span>
    ),
  },
];

const data: Transaction[] = [
  {
    cardNumber: "4210 4436 8523 3224",
    balance: "129'090'876₮",
    status: "Идэвхтэй",
  },
  {
    cardNumber: "4902 4900 5188 4344",
    balance: "350'000'000₮",
    status: "Идэвхтэй",
  },
  {
    cardNumber: "4132 7645 0923 8759",
    balance: "900'000₮",
    status: "Идэвхгүй",
  },
];

export function CardModalComponent({ isOpen = false, onSave }: CardModalProps) {
  const [open, setOpen] = useState(isOpen);
  const [activeTab, setActiveTab] = useState("owner");
  const [formData, setFormData] = useState({
    phoneNumber: "88111026",
    registrationNumber: "TA88111026",
    cardNumber: "4210 446 8523 3224",
    driver: "Т. Төмөрбаатар",
    vehicleNumber: ["8", "8", "1", "1"],
    vehicleLetter: ["У", "Е", "Е"],
    limit: "0.00",
    fuelType: "",
    pinCode: ["8", "8", "1", "1"],
    isPinEnabled: false,
    dateRange: { from: new Date(), to: new Date() },
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    setOpen(false);
  };

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 bg-white overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <DialogHeader className="p-0">
            <div className="p-4 flex justify-between items-center gap-4">
              <div className="flex">
                <TabsList className="grid w-full grid-cols-2 h-10 items-stretch p-1 bg-gray-100 rounded-md">
                  <TabsTrigger
                    value="owner"
                    className="text-xs sm:text-sm data-[state=active]:bg-[#14162E] data-[state=active]:text-white rounded-md"
                  >
                    Карт Эзэмшигч
                  </TabsTrigger>
                  <TabsTrigger
                    value="limit"
                    className="text-xs sm:text-sm data-[state=active]:bg-[#14162E] data-[state=active]:text-white rounded-md"
                  >
                    Картын Тохиргоо
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="flex items-center justify-end space-x-2 mr-8">
                <Switch id="active-card" />
                <Label htmlFor="active-card" className="text-xs sm:text-sm">
                  Идэвхтэй карт
                </Label>
              </div>
            </div>
          </DialogHeader>
          <div className="border-t border-gray-200">
            <TabsContent value="owner" className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Карт эзэмшигчийн мэдээлэл
              </h2>
              <div className="space-y-2">
                <Label htmlFor="phone-number" className="text-sm font-medium">
                  Утасны дугаар
                </Label>
                <Input
                  id="phone-number"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    updateFormData("phoneNumber", e.target.value)
                  }
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="registration-number"
                  className="text-sm font-medium"
                >
                  Регистрийн дугаар
                </Label>
                <Input
                  id="registration-number"
                  value={formData.registrationNumber}
                  onChange={(e) =>
                    updateFormData("registrationNumber", e.target.value)
                  }
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-number" className="text-sm font-medium">
                  Картын дугаар
                </Label>
                <Input
                  id="card-number"
                  value={formData.cardNumber}
                  disabled
                  className="h-9 bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driver" className="text-sm font-medium">
                  Жолооч
                </Label>
                <Input
                  id="driver"
                  value={formData.driver}
                  disabled
                  className="h-9 bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle-number" className="text-sm font-medium">
                  Машины дугаар
                </Label>
                <div className="flex space-x-2">
                  <InputOTP maxLength={7} pattern="[A-Za-z0-9]*">
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                      <InputOTPSlot index={6} />
                    </InputOTPGroup>
                  </InputOTP>
                  {/* <InputOTP
                    value={"1234"}
                    onChange={(value) =>
                      updateFormData("vehicleNumber", value.split(""))
                    }
                    maxLength={10}
                    render={({ slots }) => (
                      <InputOTPGroup className="gap-2">
                        {slots.map((slot, index) => (
                          <InputOTPSlot
                            index={index}
                            key={index}
                            {...slot}
                            className="h-9 w-9"
                          />
                        ))}
                      </InputOTPGroup>
                    )}
                  /> */}
                  {/* <InputOTP
                    value={formData?.vehicleLetter?.join("") || "1234"}
                    onChange={(value) =>
                      updateFormData("vehicleLetter", value.split(""))
                    }
                    maxLength={3}
                    render={({ slots }) => (
                      <InputOTPGroup className="gap-2">
                        {slots.map((slot, index) => (
                          <InputOTPSlot
                            index={index}
                            key={index}
                            {...slot}
                            className="h-9 w-9"
                          />
                        ))}
                      </InputOTPGroup>
                    )}
                  /> */}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="limit" className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Лимит тохируулах
              </h2>
              <div className="space-y-2">
                <Label htmlFor="limit" className="text-sm font-medium">
                  Мөнгөн дүнгээр
                </Label>
                <Input
                  id="limit"
                  type="number"
                  value={formData.limit}
                  onChange={(e) => updateFormData("limit", e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {["20'000₮", "30'000₮", "50'000₮", "100'000₮", "200'000₮"].map(
                  (amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateFormData("limit", amount.replace(/[^\d]/g, ""))
                      }
                    >
                      {amount}
                    </Button>
                  )
                )}
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Бүтээгдэхүүн түгжих
              </h2>
              <div className="space-y-2">
                <RadioGroup
                  value={formData.fuelType}
                  onValueChange={(value) => updateFormData("fuelType", value)}
                >
                  <div className="flex wrap gap-2 w-full">
                    {[
                      "АИ-92",
                      "АИ-80",
                      "Евро АИ-92",
                      "АИ-95",
                      "АИ-98",
                      "Евро ДТ",
                      "ДТ",
                      "Авто хий",
                    ].map((fuel) => (
                      <div
                        key={fuel}
                        className="flex items-center space-x-2 border rounded-md p-2 whitespace-nowrap"
                      >
                        <RadioGroupItem value={fuel} id={fuel} />
                        <Label htmlFor={fuel}>{fuel}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <h2 className="text-lg font-semibold text-gray-900">
                Картын тохиргоо
              </h2>
              <div className="space-y-2">
                <Label htmlFor="pin-code" className="text-sm font-medium">
                  Пин код
                </Label>
                <div className="flex items-center space-x-2">
                  <InputOTP maxLength={4} pattern="[A-Za-z0-9]*">
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                  <Switch
                    id="pin-enabled"
                    checked={formData.isPinEnabled}
                    onCheckedChange={(checked) =>
                      updateFormData("isPinEnabled", checked)
                    }
                  />
                  <Label htmlFor="pin-enabled">Нууц үг нуух</Label>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
        <div className="border-t border-gray-200 p-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Цуцлах
          </Button>
          <Button
            className="bg-[#F26E21] hover:bg-[#D15E18]"
            onClick={handleSave}
          >
            Хадгалах
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
