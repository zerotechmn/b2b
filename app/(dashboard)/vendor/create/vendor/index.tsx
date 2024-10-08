"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { VendorCreateFormSchema } from "../page";
import { z } from "zod";
import { z_vendorCreateSchema } from "@/app/api/[[...route]]/vendor-route";

export default function CreateVendorForm({ errorsww }: { errorsww: any }) {
  // const {} = useFormContext<VendorCreateFormSchema>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useFormContext<VendorCreateFormSchema>();

  return (
    <div className="w-full">
      <div className="flex items-start justify-start">
        <div className="w-[600px] gap-0 mt-0">
          <form className="space-y-4">
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Байгууллагын нэр</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Байгууллагын нэр"
                      {...register("name")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {errors.name && <span>{errors.name.message}</span>}

            <FormField
              name="register"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Байгууллагын регистрийн дугаар</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Байгууллагын регистрийн дугаар"
                      {...register("register")}
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
                  <FormLabel>Имайл</FormLabel>
                  <FormControl>
                    <Input placeholder="Имайл" {...register("email")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Утасны дугаар</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Утасны дугаар"
                      {...register("phoneNumber")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
