import { PencilIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
// import { deleteInvoice } from "@/app/lib/actions";

export function CreateVendor() {
  return (
    <Link
      href="/vendor/create"
      className="flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <PlusIcon className="h-5" />
      <span className="hidden md:block">Шинэ харилцагч нэмэх</span>{" "}
    </Link>
  );
}

export function UpdateInvoice({ slug }: { slug: string }) {
  return (
    <Link
      href={`/vendor/${slug}`}
      className="flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <PlusIcon className="h-5" />
      <span className="hidden md:block">Шинэ харилцагч нэмэх</span>{" "}
    </Link>
  );
}

// export function DeleteInvoice({ id }: { id: string }) {
//   const deleteInvoiceWithId = deleteInvoice.bind(null, id);
//   return (
//     <form action={deleteInvoiceWithId}>
//       <button className="rounded-md border p-2 hover:bg-gray-100">
//         <span className="sr-only">Delete</span>
//         <TrashIcon className="w-5" />
//       </button>
//     </form>
//   );
// }
