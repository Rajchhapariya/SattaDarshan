export default function AdminUsersPage() {
  const users = [
    { email: "admin@sattadarshan.in", role: "Super Admin" },
    { email: "editor@sattadarshan.in", role: "Editor" },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin User Management</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
        {users.map((u) => (
          <div key={u.email} className="flex items-center justify-between border border-gray-100 rounded-xl px-3 py-2">
            <p className="text-sm">{u.email}</p>
            <span className="text-xs px-2 py-1 rounded-md bg-indigo-50 text-indigo-700">{u.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
