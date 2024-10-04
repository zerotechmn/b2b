import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

export default function CustomerForm() {
  const { register } = useFormContext();

  return (
    <div className="w-full">
      <div className="flex items-start justify-start">
        <div className="w-[600px] gap-0 mt-0">
          <FormField
            name="managerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имайл хаяг</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Менежэр имайл"
                    {...register("managerEmail")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Баг дугаар</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Байгууллагын нэр"
                    {...register("bagKhorooId")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coordinate</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Байгууллагын нэр"
                    {...register("coordinate")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Дэлгэрэнгүй хаяг</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Байгууллагын нэр"
                    {...register("details")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Утасны дугаар</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Утасны дугаар"
                    {...register("phone_number")}
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
