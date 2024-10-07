import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { VendorCreateFormSchema } from "./page";

export default function CustomerForm() {
  const { register } = useFormContext<VendorCreateFormSchema>();

  return (
    <div className="w-full">
      <div className="flex items-start justify-start">
        <div className="w-[600px] gap-0 mt-0">
          <FormField
            name="managerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Менежэр имайл</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Менежэр имайл хаягаа оруулна уу"
                    {...register("managerEmail")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="pt-6"></div>
          <FormField
            name="address.bagKhorooId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Баг/хорооны дугаар</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Баг/хорооны дугаараа оруулна уу"
                    {...register("address.bagKhorooId")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="pt-6"></div>
          <FormField
            name="address.coordinate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Хаяг координат</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Хаяг координатыг оруулна уу"
                    {...register("address.coordinate")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="pt-6"></div>
          <FormField
            name="address.details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Дэлгэрэнгүй хаяг</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Дэлгэрэнгүй хаягаа оруулна уу"
                    {...register("address.details")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="pt-6"></div>
          <FormField
            name="address.phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Утасны дугаар</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Утасны дугаараа оруулна уу"
                    {...register("address.phone_number")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
