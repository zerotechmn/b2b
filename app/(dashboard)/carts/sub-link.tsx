// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";

// export type SubHeader = {
//   label: string;
//   status: boolean;
//   href: string;
// };

// export function BreadcrumbCustom({ list }: { list: SubHeader[] }) {
//   return (
//     <Breadcrumb className="p-6 pl-8 bg-headerTable">
//       <BreadcrumbList>
//         {list.map((item, index) => (
//           <div key={index}>
//             {item.status === true ? (
//               <BreadcrumbItem>
//                 <div className="m-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
//                   <p className="text-xs">{(index + 1).toString()}</p>
//                 </div>

//                 <BreadcrumbLink
//                   href={item.href}
//                   className=" text-black font-bold"
//                 >
//                   {item.label}
//                 </BreadcrumbLink>
//                 <BreadcrumbSeparator />
//               </BreadcrumbItem>
//             ) : (
//               <BreadcrumbItem>
//                 <div className="m-1 flex h-7 w-7 items-center justify-center rounded-full bg-gray-400 text-white">
//                   <p className="text-xs">{(index + 1).toString()}</p>
//                 </div>

//                 <BreadcrumbLink
//                   href={item.href}
//                   className="text-gray-400 font-semibold"
//                 >
//                   {item.label}
//                 </BreadcrumbLink>
//                 <BreadcrumbSeparator />
//               </BreadcrumbItem>
//             )}
//           </div>
//         ))}
//       </BreadcrumbList>
//     </Breadcrumb>
//   );
// }
