import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          text: 'Pending'
        };
      case 'approved':
        return {
          color: 'bg-green-500/20 text-green-400 border-green-500/30',
          text: 'Approved'
        };
      case 'rejected':
        return {
          color: 'bg-red-500/20 text-red-400 border-red-500/30',
          text: 'Rejected'
        };
      default:
        return {
          color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
          text: status
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
      {config.text}
    </span>
  );
};

export default StatusBadge;