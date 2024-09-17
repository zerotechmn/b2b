import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type SubHeader = {
  id: string;
  step: number;
  title: string;
  status: string;
  href: string;
};

export function BreadcrumbCustom({ list }: { list: SubHeader[] }) {
  return (
    <Breadcrumb className="p-6 pl-8 bg-headerTable">
      <BreadcrumbList>
        {list.map((item) => (
          <div key={item.id}>
            {item.status === "active" ? (
              <BreadcrumbItem>
                <div className="m-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                  <p className="text-xs">{item.step.toString()}</p>
                </div>

                <BreadcrumbLink href="/" className=" text-black font-bold">
                  {item.title}
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem>
                <div className="m-1 flex h-7 w-7 items-center justify-center rounded-full bg-gray-400 text-white">
                  <p className="text-xs">{item.step.toString()}</p>
                </div>

                <BreadcrumbLink
                  href="/"
                  className="text-gray-400 font-semibold"
                >
                  {item.title}
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
