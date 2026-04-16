import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { StateIcon } from "@/components/ui/StateIcon";

type PoliticianCardProps = {
  slug: string;
  name: string;
  photo?: string;
  role?: string;
  partyName?: string;
  constituency?: string;
  state?: string;
};

export function PoliticianCard({ slug, name, photo, role, partyName, constituency, state }: PoliticianCardProps) {
  return (
    <Link href={"/politicians/"+slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-4 group">
      <div className="w-14 h-14 rounded-full bg-gray-100 mx-auto mb-3 overflow-hidden flex items-center justify-center">
        <Avatar className="w-full h-full">
          <AvatarImage src={photo} alt={name} className="w-full h-full object-cover" />
          <AvatarFallback className="text-2xl font-bold text-gray-300">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
      <h3 className="font-semibold text-sm text-gray-900 text-center line-clamp-2 group-hover:text-orange-600">{name}</h3>
      <div className="mt-2 text-center"><span className="text-xs bg-orange-50 text-orange-700 font-semibold px-2 py-0.5 rounded-md">{role}</span></div>
      <p className="text-xs text-gray-500 text-center mt-1.5">{partyName}</p>
      {state && (
        <div className="flex items-center justify-center gap-1 mt-1 text-xs text-gray-500">
          <StateIcon stateName={state} className="w-3.5 h-3.5 text-gray-400" />
          <span>{state}</span>
        </div>
      )}
      {constituency&&<p className="text-xs text-gray-400 text-center mt-0.5">{constituency}</p>}
    </Link>
  );
}
