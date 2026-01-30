export default function ProgressCircle({ percent, color }) {
  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full rotate-[-90deg]">
        <circle
          cx="50%"
          cy="50%"
          r="40%"
          stroke="#E5E7EB"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="50%"
          cy="50%"
          r="40%"
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray="251"
          strokeDashoffset={251 - (251 * percent) / 100}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-bold">
        {percent}%
      </span>
    </div>
  );
}
