import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full lg:grid lg:grid-cols-2">
      <div className="hidden bg-muted lg:block">
        <Image
          src="/auth-layout-image.png"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="h-full flex items-center justify-center px-4">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 pb-12">
            <Image
              src="/logo.png"
              alt="logo"
              width="150"
              height="100"
              className="object-cover mx-auto dark:brightness-[0.2] dark:grayscale"
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
