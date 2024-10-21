import { api } from "@/lib/api";
import ChangePassword from "./change-password";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ChangePasswordPage({
  searchParams,
}: {
  searchParams: {
    token?: string;
    userId?: string;
    isReset?: string;
  };
}) {
  const res = await api["driver-card"].list.$get({
    json: {},
  });

  const response = await api.authenticate["verify-reset-token"].$post({
    json: {
      token: searchParams.token || "",
      userId: searchParams.userId || "",
    },
  });

  if (response.status !== 200) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-center">
          Буруу эсвэл хугацаа нь дууссан токен илэрлээ!
        </h1>
        <Button>
          <Link href="/auth/login">Нэвтрэх хэсэгрүү буцах</Link>
        </Button>
      </div>
    );
  }

  return (
    <ChangePassword
      token={searchParams.token!}
      user={(await response.json()).user!}
      isReset={searchParams.isReset === "true"}
    />
  );
}
