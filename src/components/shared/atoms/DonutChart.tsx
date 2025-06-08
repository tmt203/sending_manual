"use client";

import { ArcElement, Chart, DoughnutController, Legend, Tooltip } from "chart.js";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { memo, useEffect, useRef } from "react";
import { Skeleton } from ".";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

interface DonutChartProps {
	data: number[];
	labels: string[];
	colors: string[];
	isLoading?: boolean;
	fontSize?: number;
	className?: string;
}

/**
 * @description Donut chart component with smooth data updates
 * @param id string
 * @param data number[]
 * @param labels string[]
 * @param colors string[]
 * @param fontSize? number
 * @param className string
 */
const DonutChart = memo(
	({ data, labels, colors, isLoading = false, fontSize = 24, className }: DonutChartProps) => {
		const t = useTranslations();
		const { theme } = useTheme();

		const canvas = useRef<HTMLCanvasElement>(null);
		const legend = useRef<HTMLUListElement>(null);

		const textCenterPlugin = {
			id: "text-around-doughnut",
			beforeDraw(chart: Chart) {
				const {
					ctx,
					chartArea: { width, height },
				} = chart;

				const total = data.reduce((sum, value) => sum + value, 0);

				ctx.save();
				ctx.font = `bold ${fontSize}px sans-serif`;
				ctx.fillStyle = theme === "light" ? "black" : "white";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText(total.toString(), width / 2, height / 2);
				ctx.restore();
			},
		};

		const htmlLegendPlugin = {
			id: "htmlLegend",
			afterUpdate(chart: Chart, args: any, options: any) {
				const ul = legend.current;
				if (!ul) return;

				// Remove old legend items
				while (ul?.firstChild) {
					ul.firstChild.remove();
				}

				// Reuse the built-in legendItems generator
				const items = chart.options.plugins?.legend?.labels?.generateLabels?.(chart);

				items?.forEach((item) => {
					const li = document.createElement("li");
					li.style.alignItems = "center";
					li.style.cursor = "pointer";
					li.style.display = "flex";
					li.style.flexDirection = "row";
					li.style.marginLeft = "10px";

					li.onclick = () => {
						chart.toggleDataVisibility(item.index!);
						chart.update();
					};

					// Color box
					const boxSpan = document.createElement("span");
					boxSpan.style.background = `${item.fillStyle}`;
					boxSpan.style.display = "inline-block";
					boxSpan.style.flexShrink = "0";
					boxSpan.style.height = "12px";
					boxSpan.style.marginRight = "12px";
					boxSpan.style.width = "12px";
					boxSpan.style.borderRadius = "9999px";

					// Text
					const textContainer = document.createElement("p");
					textContainer.style.color = `${item.fontColor}`;
					textContainer.style.margin = "0";
					textContainer.style.padding = "0";
					textContainer.style.textDecoration = item.hidden ? "line-through" : "";

					const text = document.createTextNode(item.text);
					textContainer.appendChild(text);

					li.appendChild(boxSpan);
					li.appendChild(textContainer);
					ul?.appendChild(li);
				});
			},
		};

		useEffect(() => {
			const ctx = canvas.current;
			if (!ctx) return;

			const translatedLabels = labels.map((label) => (label.includes(".") ? t(label) : label));

			const newChart = new Chart(ctx, {
				type: "doughnut",
				data: {
					labels: translatedLabels,
					datasets: [{ data, backgroundColor: colors }],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: { display: false },
					},
					animation: false,
				},
				plugins: [textCenterPlugin, htmlLegendPlugin],
			});

			// Cleanup function
			return () => newChart.destroy();
		}, [data, isLoading, labels, colors, t]);

		return (
			<div className="flex flex-col gap-2">
				{/* Area: Chart */}
				<div className={clsx("size-full", className)}>
					{isLoading ? (
						<Skeleton className="donut-chart-skeleton !size-44 mx-auto !rounded-full" />
					) : (
						<canvas ref={canvas} />
					)}
				</div>

				{/* <div id={`legend-container-${id}`} /> */}
				<ul ref={legend} className="flex items-center justify-center flex-wrap"></ul>
			</div>
		);
	}
);

export default DonutChart;
