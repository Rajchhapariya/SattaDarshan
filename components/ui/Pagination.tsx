"use client";

type PaginationProps = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, pages, onPageChange }: PaginationProps) {
  if (pages<=1) return null;
  const nums = Array.from({length:Math.min(5,pages)},(_,i)=>Math.max(1,Math.min(pages-4,page-2))+i);
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button onClick={()=>onPageChange(page-1)} disabled={page===1} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40">‹</button>
      {nums.map(n=><button key={n} onClick={()=>onPageChange(n)} className={`w-9 h-9 rounded-xl text-sm font-medium ${n===page?"bg-orange-500 text-white":"border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{n}</button>)}
      <button onClick={()=>onPageChange(page+1)} disabled={page===pages} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40">›</button>
    </div>
  );
}
