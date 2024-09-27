import { clsx } from "clsx";
import Link from "next/link";

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="bg-surface-surface3 p-7">
      <ol className={clsx("flex flex-row text-xl md:text-m ")}>
        {breadcrumbs.map((breadcrumb, index) => (
          <div className="flex flex-row items-center" key={breadcrumb.href}>
            <li
              className={clsx(
                breadcrumb.active
                  ? " m-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white"
                  : "m-1 flex h-7 w-7 items-center justify-center rounded-full bg-surface-disabled text-white"
              )}
            >
              <p className="text-xs">{(index + 1).toString()}</p>
            </li>
            <li
              aria-current={breadcrumb.active}
              className={clsx(
                breadcrumb.active
                  ? "text-gray-900 text-base"
                  : "text-gray-500 text-base"
              )}
            >
              <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
              {index < breadcrumbs.length - 1 ? (
                <span className="mx-3 inline-block"> &#62;</span>
              ) : null}
            </li>
          </div>
        ))}
      </ol>
    </nav>
  );
}

// <Breadcrumbs
// breadcrumbs={[
//   {
//     label: "Байгууллага",
//     href: "/vendor/create/baiguullaga",
//     active: true,
//   },
//   {
//     label: "Гэрээ",
//     href: `/vendor/create/geree`,
//     active: false,
//   },
//   {
//     label: "Харилцагч",
//     href: `/vendor/create/hariltsagch`,
//     active: false,
//   },
// ]}
// />

// {
// <div>
//   {slug === "baiguullaga" ? (
//     <CreateVendorForm />
//   ) : slug === "geree" ? (
//     <p>geree</p>
//   ) : (
//     <p>hariltsagch</p>
//   )}
// </div>
// }
