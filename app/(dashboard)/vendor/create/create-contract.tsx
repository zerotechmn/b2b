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
import { signInSchema } from "@/lib/zod";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { paymentDateTypeEnum } from "@/app/api/database/schema";

export default function CreateContract() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-row">
          <div className="w-1/2 pr-6 ">
            <CustomSelectBox />
          </div>
          <div className="w-1/2">
            <CustomSelectBox />
          </div>
        </div>
        <div className="flex flex-row pt-5">
          <div className="w-1/2 pr-6">
            <CustomSelectBox />
          </div>
          <div className="w-1/2">
            <CustomSelectBox />
          </div>
        </div>
        <div className="flex flex-row pt-5">
          <div className="w-1/2 pr-6">
            <CustomSelectBox />
          </div>
          <div className="w-1/2">
            <CustomSelectBox />
          </div>
        </div>
        <div className="flex flex-row pt-5">
          <div className="w-1/2 pr-6">
            <CustomSelectBox />
          </div>
          <div className="w-1/2">
            <CustomSelectBox />
          </div>
        </div>
        <div className="flex flex-row pt-5">
          <div className="w-1/2 pr-6">
            <CustomSelectBox />
          </div>
          <div className="w-1/2">
            <CustomSelectBox />
          </div>
        </div>
        <div className="flex flex-row pt-5">
          <div className="w-1/2 pr-6">
            <CustomSelectBox />
          </div>
          <div className="w-1/2">
            <CustomSelectBox />
          </div>
        </div>
        <div className="flex flex-row pt-5">
          <div className="w-full ">
            <CustomSelectBox />
          </div>
        </div>

        <Button type="submit" className="w-200">
          {form.formState.isSubmitting ? "loading..." : "Хадгалах"}
        </Button>
      </form>
    </Form>
  );
}

export function CustomSelectBox({}) {
  return (
    <FormField
      // control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Дотоод байгууллагын нэр</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a verified email to display" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="m@example.com">m@example.com</SelectItem>
              <SelectItem value="m@google.com">m@google.com</SelectItem>
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
    <FormField
      // control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Дотоод байгууллагын нэр</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a verified email to display" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="m@example.com">m@example.com</SelectItem>
              <SelectItem value="m@google.com">m@google.com</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
