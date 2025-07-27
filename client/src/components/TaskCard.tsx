import React from "react";

interface TaskCardProps {
  title: string;
  count: number;
  color: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ title, count, color }) => {
  return (
    <div className={`bg-slate-800 p-4 rounded-lg shadow w-full`}>
      <h3 className="text-white text-lg">{title}</h3>
      <p className={`text-${color}-400 text-3xl font-bold mt-2`}>{count}</p>
    </div>
  );
};

export default TaskCard;
