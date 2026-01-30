import React from "react";

const TaskCompletion = () => {
  const completed = 70;
  const pending = 30;

  return (
    <div className="w-full max-w-sm bg-white p-5">
      <h2 className="text-sm font-semibold text-gray-800 mb-6">Task Completion</h2>

      <div className="flex justify-between items-center">
        <ProgressCircle
          value={completed}
          label="Completed"
          strokeColor="stroke-green-500"
          textColor="text-green-600"
        />

        <ProgressCircle
          value={pending}
          label="Pending"
          strokeColor="stroke-orange-400"
          textColor="text-orange-500"
        />
      </div>
    </div>
  );
};

export default TaskCompletion;


const ProgressCircle = ({ value, label, strokeColor, textColor }) => {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-gray-500">{label}</span>

      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90">
          <circle cx="48" cy="48" r={radius} strokeWidth="6" className="fill-none stroke-gray-200" />

          <circle
            cx="48"
            cy="48"
            r={radius}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            className={`fill-none ${strokeColor}`}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-semibold ${textColor}`}>{value}%</span>
        </div>
      </div>
    </div>
  );
};
