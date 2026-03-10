import React from 'react';

interface MatchScoreCardProps {
  score: number | string;
}

const MatchScoreCard: React.FC<MatchScoreCardProps> = ({ score }) => {
  // Convert to number and ensure it's valid
  const numericScore = typeof score === 'string' ? parseInt(score, 10) : score;
  const validScore = isNaN(numericScore) ? 0 : Math.min(Math.max(numericScore, 0), 100);

  const getRingColor = () => {
    if (validScore >= 75) return 'stroke-brand';
    if (validScore >= 50) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

  const getTextColor = () => {
    if (validScore >= 75) return 'text-brand';
    if (validScore >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  // Use numericScore for the calculation to ensure no NaN is passed to SVG
  const dashOffset = circumference * (1 - validScore / 100);

  return (
    <div className="flex flex-col items-center">
      <div className="relative inline-flex items-center justify-center">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            className="text-gray-100 dark:text-gray-700"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="80"
            cy="80"
          />
          <circle
            className={`${getRingColor()} transition-all duration-1000 ease-out`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={isNaN(dashOffset) ? circumference : dashOffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="80"
            cy="80"
          />
        </svg>
        <div className="absolute flex flex-col items-center rotate-90">
          <span className={`text-5xl font-extrabold tracking-tighter ${getTextColor()}`}>{validScore}</span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Score</span>
        </div>
      </div>
      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 font-medium text-center">
        {validScore >= 75 ? "Excellent Match!" : validScore >= 50 ? "Good Potential" : "Needs Improvement"}
      </p>
    </div>
  );
};

export default MatchScoreCard;
