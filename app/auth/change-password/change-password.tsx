"use client";

import Image from "next/image";
import Link from "next/link";

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
import { changePasswordSchema } from "@/lib/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { login } from "../actions";
import { User } from "@/app/api/database/types";
import { api } from "@/lib/api";

interface Props {
  token: string;
  user: User;
  isReset: boolean;
}

export default function ChangePassword({ token, user, isReset }: Props) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit({
    newPassword,
    repeatPassword,
  }: z.infer<typeof changePasswordSchema>) {
    if (newPassword !== repeatPassword)
      return form.setError("repeatPassword", {
        type: "manual",
        message: "Нууц үг таарахгүй байна",
      });

    const response = await api.authenticate["reset-password"][":token"].$post({
      param: { token },
      json: { userId: user.id, password: newPassword },
    });

    if (response.status !== 200) {
      toast({ title: "Алдаа гарлаа", variant: "destructive" });
      return;
    }

    if (isReset) {
      router.replace("/login");
      toast({
        title:
          "Нууц үг амжилттай солилоо. Та шинэ нууц үгээ ашиглан нэвтэрнэ үү.",
      });
      return;
    }

    await login({ email: user.email!, password: newPassword }).then((res) => {
      if (!!res?.message) {
        toast({ title: res?.message, variant: "destructive" });
      } else {
        router.replace("/");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Нууц үг</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="repeatPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Нууц үг давтах</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          loading={form.formState.isSubmitting}
          type="submit"
          className="w-full"
        >
          Нууц үг солих
        </Button>
      </form>
    </Form>
  );
}
