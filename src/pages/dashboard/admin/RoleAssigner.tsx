export default function RoleAssigner() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Role Assignment</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Assign User Roles</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-sm text-gray-500">john@example.com</p>
            </div>
            <select className="border rounded px-3 py-1">
              <option>Public</option>
              <option>Execom</option>
              <option>Treasurer</option>
              <option>Faculty</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <p className="font-medium">Jane Smith</p>
              <p className="text-sm text-gray-500">jane@example.com</p>
            </div>
            <select className="border rounded px-3 py-1">
              <option>Public</option>
              <option>Execom</option>
              <option>Treasurer</option>
              <option>Faculty</option>
            </select>
          </div>
        </div>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save Role Changes
        </button>
      </div>
    </div>
  );
}