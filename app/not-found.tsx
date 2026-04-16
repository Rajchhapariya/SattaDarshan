import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl font-black text-gray-100">404</div>
      <h2 className="text-2xl font-bold mt-4">Page Not Found</h2>
      <Link href="/" className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold">Go Home</Link>
    </div>
  );
}
