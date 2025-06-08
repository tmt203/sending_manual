"use client";

import { chartColors } from "@utils/chartjs-config";
import { tailwindConfig } from "@utils/format-value";
import type { ChartData, TimeScaleTimeOptions } from "chart.js";
import {
	Chart,
	Filler,
	LinearScale,
	LineController,
	LineElement,
	PointElement,
	TimeScale,
	Tooltip,
} from "chart.js";
import { _DeepPartialObject } from "chart.js/dist/types/utils";
import "chartjs-adapter-moment";
import moment from "moment";
import { useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import Skeleton from "./Skeleton";

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip);

interface LineChartProps {
	data: ChartData;
	width: string | number;
	height: string | number;
	isLoading?: boolean;
	timeScaleTimeOptions: _DeepPartialObject<TimeScaleTimeOptions>;
}

/**
 * LineChart Component with smooth updates
 * @param data ChartData
 * @param width number
 * @param height number
 */
const LineChart = ({ data, width, height, isLoading, timeScaleTimeOptions }: LineChartProps) => {
	const locale = useLocale();
	const [chart, setChart] = useState<Chart | null>(null);
	const canvas = useRef<HTMLCanvasElement>(null);
	const legend = useRef<HTMLUListElement>(null);
	const { theme } = useTheme();
	const darkMode = theme === "dark";
	const {
		textColor,
		gridColor,
		tooltipTitleColor,
		tooltipBodyColor,
		tooltipBgColor,
		tooltipBorderColor,
	} = chartColors;

	// Set moment locale based on the current locale
	useEffect(() => {
		if (locale === "vi") {
			moment.locale("vi");
		} else {
			moment.locale("en");
		}
	}, [locale]);

	// Create chart
	useEffect(() => {
		const ctx = canvas.current;
		if (!ctx) return;

		const newChart = new Chart(ctx, {
			type: "line",
			data: data,
			options: {
				layout: {
					padding: 20,
				},
				scales: {
					y: {
						beginAtZero: true,
						border: {
							display: false,
						},
						ticks: {
							maxTicksLimit: 5,
							callback: (value) => {
								// Format numbers according to Vietnamese or English locale
								if (locale === "vi") {
									return new Intl.NumberFormat("vi-VN").format(value as number);
								}
								return value;
							},
							color: darkMode ? textColor.dark : textColor.light,
						},
						grid: {
							color: darkMode ? gridColor.dark : gridColor.light,
						},
					},
					x: {
						type: "time",
						time: {
							...timeScaleTimeOptions,
							displayFormats: {
								month: locale === "vi" ? "MM/YYYY" : "MMM YYYY",
								day: locale === "vi" ? "DD/MM" : "MMM DD",
								hour: locale === "vi" ? "HH:mm" : "hA",
								minute: locale === "vi" ? "HH:mm" : "h:mm A",
								...timeScaleTimeOptions.displayFormats,
							},
						},
						border: {
							display: false,
						},
						grid: {
							display: false,
						},
						ticks: {
							autoSkipPadding: 48,
							maxRotation: 0,
							color: darkMode ? textColor.dark : textColor.light,
						},
					},
				},
				plugins: {
					legend: {
						display: false,
					},
					tooltip: {
						titleFont: {
							weight: 600,
						},
						callbacks: {
							label: (context) => {
								// Format tooltip values according to the locale
								if (locale === "vi") {
									return new Intl.NumberFormat("vi-VN").format(context.parsed.y);
								}
								return `${context.parsed.y}`;
							},
							title: (tooltipItems) => {
								// Format the tooltip title date according to locale
								const item = tooltipItems[0];
								const date = new Date(item.parsed.x);

								if (locale === "vi") {
									return new Intl.DateTimeFormat("vi-VN", {
										year: "numeric",
										month: "2-digit",
										day: "2-digit",
										hour: "2-digit",
										minute: "2-digit",
									}).format(date);
								}

								return item.label;
							},
						},
						titleColor: darkMode ? tooltipTitleColor.dark : tooltipTitleColor.light,
						bodyColor: darkMode ? tooltipBodyColor.dark : tooltipBodyColor.light,
						backgroundColor: darkMode ? tooltipBgColor.dark : tooltipBgColor.light,
						borderColor: darkMode ? tooltipBorderColor.dark : tooltipBorderColor.light,
					},
				},
				interaction: {
					intersect: false,
					mode: "nearest",
				},
				animation: false,
				maintainAspectRatio: false,
			},
			plugins: [
				{
					id: "htmlLegend",
					afterUpdate(c, args, options) {
						const ul = legend.current;
						if (!ul) return;
						// Remove old legend items
						while (ul.firstChild) {
							ul.firstChild.remove();
						}
						// Reuse the built-in legendItems generator
						const items = c.options.plugins?.legend?.labels?.generateLabels?.(c);
						items?.slice(0, 2).forEach((item) => {
							const li = document.createElement("li");
							// Button element
							const button = document.createElement("button");
							button.style.display = "inline-flex";
							button.style.alignItems = "center";
							button.style.opacity = item.hidden ? ".3" : "";
							button.onclick = () => {
								c.setDatasetVisibility(item.datasetIndex!, !c.isDatasetVisible(item.datasetIndex!));
								c.update();
							};
							// Color box
							const box = document.createElement("span");
							box.style.display = "block";
							box.style.width = "24px";
							box.style.height = "1px";
							box.style.borderRadius = tailwindConfig.theme.borderRadius.full;
							box.style.marginRight = tailwindConfig.theme.margin[2];
							box.style.borderWidth = "1px";
							box.style.borderColor = c.data.datasets[item.datasetIndex!].borderColor as string;
							box.style.pointerEvents = "none";
							// Label
							const label = document.createElement("span");
							label.classList.add("text-gray-500", "dark:text-gray-400");
							label.style.fontSize = tailwindConfig.theme.fontSize.sm[0];
							label.style.lineHeight = tailwindConfig.theme.fontSize.sm[1].lineHeight;
							const labelText = document.createTextNode(item.text);
							label.appendChild(labelText);
							li.appendChild(button);
							button.appendChild(box);
							button.appendChild(label);
							ul.appendChild(li);
						});
					},
				},
			],
		});
		setChart(newChart);
		return () => newChart.destroy();
	}, [data, isLoading, timeScaleTimeOptions, locale]);

	// Update chart options when theme changes
	useEffect(() => {
		if (!chart) return;

		if (darkMode) {
			chart.options.scales!.x!.ticks!.color = textColor.dark;
			chart.options.scales!.y!.ticks!.color = textColor.dark;
			chart.options.scales!.y!.grid!.color = gridColor.dark;
			chart.options.plugins!.tooltip!.titleColor = tooltipTitleColor.dark;
			chart.options.plugins!.tooltip!.bodyColor = tooltipBodyColor.dark;
			chart.options.plugins!.tooltip!.backgroundColor = tooltipBgColor.dark;
			chart.options.plugins!.tooltip!.borderColor = tooltipBorderColor.dark;
		} else {
			chart.options.scales!.x!.ticks!.color = textColor.light;
			chart.options.scales!.y!.ticks!.color = textColor.light;
			chart.options.scales!.y!.grid!.color = gridColor.light;
			chart.options.plugins!.tooltip!.titleColor = tooltipTitleColor.light;
			chart.options.plugins!.tooltip!.bodyColor = tooltipBodyColor.light;
			chart.options.plugins!.tooltip!.backgroundColor = tooltipBgColor.light;
			chart.options.plugins!.tooltip!.borderColor = tooltipBorderColor.light;
		}
		chart.update("none");
	}, [theme]);

	return (
		<>
			{isLoading ? (
				<div className="px-5 py-3" style={{ width, height }}>
					<Skeleton className="!size-full" />
				</div>
			) : (
				<>
					<div className="grow">
						<canvas ref={canvas} width={width} height={height}></canvas>
					</div>
					<div className="px-5">
						<div className="flex flex-wrap justify-between items-end gap-y-2 gap-x-4">
							<div className="grow mb-1">
								<ul ref={legend} className="flex flex-wrap gap-x-4 sm:justify-center"></ul>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default LineChart;
