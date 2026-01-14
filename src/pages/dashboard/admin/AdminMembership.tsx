export default function AdminMembership() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Member Management</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Members</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Export List
          </button>
        </div>
        <p>Member list with admin actions will appear here.</p>
      </div>
    </div>
  );
}