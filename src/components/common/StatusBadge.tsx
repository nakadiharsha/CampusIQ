import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let badgeStyle = 'bg-[#F7F8FA] text-[#17202A] border-[#D9DEE5]';

  switch (status) {
    case 'Indexed':
    case 'Approved':
    case 'Success':
    case 'Active':
      badgeStyle = 'bg-[#EBF5F3] text-[#2F7D6D] border-[#BCE1D9]';
      break;
    case 'Processing':
    case 'Pending Approval':
    case 'Pending':
    case 'In Progress':
      badgeStyle = 'bg-[#FEFCBF] text-[#B7791F] border-[#F6E05E]';
      break;
    case 'Needs Review':
    case 'Warning':
      badgeStyle = 'bg-[#FFFAF0] text-[#DD6B20] border-[#FBD38D]';
      break;
    case 'Rejected':
    case 'Failed':
      badgeStyle = 'bg-[#FFF5F5] text-[#B54747] border-[#FEB2B2]';
      break;
    default:
      badgeStyle = 'bg-[#F7F8FA] text-[#667085] border-[#D9DEE5]';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${badgeStyle}`}
    >
      {status}
    </span>
  );
};
