"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
export default function AdminLogin() {
  const router = useRouter();
  const [email,setEmail] = useState(""); const [password,setPassword] = useState(""); const [error,setError] = useState(""); const [loading,setLoading] = useState(false);
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError("");
    const res = await signIn("credentials",{email,password,redirect:false});
    if(res?.ok) router.push("/admin"); else { setError("Invalid credentials"); setLoading(false); }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-indigo-800 flex items-center justify-center mx-auto mb-3"><span className="text-white font-black text-lg">स</span></div>
          <h1 className="text-xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-sm text-gray-400 mt-0.5">SattaDarshan CMS</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error&&<p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"/>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"/>
          </div>
          <button type="submit" disabled={loading} className="w-full h-10 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50">{loading?"Signing in...":"Sign In"}</button>
        </form>
      </div>
    </div>
  );
}
