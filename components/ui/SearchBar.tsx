"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function SearchBar({ value, onChange, placeholder = "Search...", className = "" }: SearchBarProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <svg className="absolute left-3 text-gray-400 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 placeholder:text-gray-400"/>
      {value&&<button onClick={()=>onChange("")} className="absolute right-2.5 text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>}
    </div>
  );
}
