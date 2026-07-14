export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="text-sm font-medium text-slate-500 animate-pulse uppercase tracking-widest">Synchronizing Matrix...</p>
      </div>
    </div>
  );
}
