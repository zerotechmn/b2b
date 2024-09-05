import { AppType } from "@/app/api/[[...route]]/route";
import { hc } from "hono/client";

export const { api } = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
