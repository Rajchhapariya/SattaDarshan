"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full px-4">
      <div className="max-w-md w-full bg-white border border-slate-100 rounded-2xl p-8 shadow-xl text-center">
        <div className="mx-auto w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Protocol Interrupted</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          The system encountered an unexpected synchronization error. Data pedigree could not be verified at this moment.
        </p>
        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => reset()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-xl font-bold gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset Connection
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = "/"}
            className="w-full py-6 rounded-xl font-semibold border-slate-200"
          >
            Return to Command Center
          </Button>
        </div>
        {error.digest && (
          <p className="mt-6 text-[10px] font-mono text-slate-300 uppercase tracking-tighter">
            Error Signature: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
