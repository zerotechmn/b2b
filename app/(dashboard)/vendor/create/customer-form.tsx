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
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/lib/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CustomerForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    // await login(values).then((res) => {
    //   if (!!res?.error) {
    //     toast({ title: res?.error, variant: "destructive" });
    //   } else {
    //     router.replace("/");
    //   }
    // });
  }

  return (
    <div className="w-full">
      <div className="flex items-start justify-start">
        <div className="w-[600px] gap-0 mt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имайл хаяг</FormLabel>
                    <FormControl>
                      <Input placeholder="Байгууллагын нэр" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-200">
                {form.formState.isSubmitting ? "loading..." : "Хадгалах"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
