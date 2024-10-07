"use client";

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
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string(),
});

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();

  async function onSubmit({ email }: z.infer<typeof formSchema>) {
    const response = await api.authenticate["reset-password"].$post({
      json: { email },
    });

    if (response.status !== 200)
      return form.setError("email", {
        type: "manual",
        message: "Хэрэглэгч олдсонгүй",
      });

    router.push((await response.json()).link);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Link
          href="/auth/login"
          className="ml-auto text-sm underline inline-block"
        >
          Буцах
        </Link>

        <Button
          loading={form.formState.isSubmitting}
          type="submit"
          className="w-full"
        >
          Нууц үг сэргээх
        </Button>
      </form>
    </Form>
  );
}
