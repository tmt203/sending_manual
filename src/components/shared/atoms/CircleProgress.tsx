"use client";

import { useMemo } from "react";

interface CircleProgressProps {
	percentage: number;
	size?: number;
}

/**
 * Circle Progress Component
 * @prop CircleProgressProps
 */
const CircleProgress = ({ percentage, size = 48 }: CircleProgressProps) => {
	// Variables
	const radius = useMemo(() => size / 2, [size]);
	const strokeWidth = useMemo(() => size * 0.1, [size]);
	const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
	const progress = useMemo(() => (percentage / 100) * circumference, [percentage, circumference]);

	return (
		<svg width={size} height={size} viewBox="0 0 100 100">
			{/* Area: Background Circle */}
			<circle
				cx="50"
				cy="50"
				r={radius}
				stroke="#F3F6F9"
				strokeWidth={strokeWidth}
				fill="transparent"
			/>

			{/* Area: Progress Circle */}
			<circle
				cx="50"
				cy="50"
				r={radius}
				stroke="#0BAA60"
				strokeWidth={strokeWidth}
				fill="transparent"
				strokeDasharray={circumference}
				strokeDashoffset={circumference - progress}
				strokeLinecap="round"
				transform="rotate(-90 50 50)"
			/>

			{/* Area: Percentage Text */}
			<text
				x="50"
				y="54"
				fontSize={size * 0.18}
				fontWeight="bold"
				textAnchor="middle"
				className="dark:fill-white"
			>
				{parseFloat(percentage.toFixed(2))}%
			</text>
		</svg>
	);
};

export default CircleProgress;
