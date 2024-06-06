import React from 'react';

interface DashboardCardProps {
  number: number | string;
  title: string;
  subtitle: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ number, title, subtitle }) => {
  return (
    <div className="flex flex-col w-full sm:w-1/2 lg:w-1/4 mb-2 mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden p-5">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium dark:text-gray-200">{title}</h3>
        <span className="text-sm text-gray-500 dark:text-gray-200">{subtitle}</span>
      </div>
      <p className="text-2xl text-center font-bold dark:text-gray-200">{number}</p>
    </div>
  );
};

export default DashboardCard;
