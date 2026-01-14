// src/components/dashboard/SystemMonitor.tsx
import { useState } from 'react';

interface SystemLog {
  id: string;
  timestamp: string;
  user_email: string;
  action: string;
  details: Record<string, unknown>;
}

export default function SystemMonitor() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">System Activity Monitor</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th>Time</th>
              <th>User</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.user_email}</td>
                <td>{log.action}</td>
                <td>{JSON.stringify(log.details)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}