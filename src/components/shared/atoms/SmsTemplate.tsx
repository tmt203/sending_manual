"use client";

import { BatteryMedium, Camera, ChevronLeft, Mic, Signal, Wifi } from "lucide-react";
import React from "react";
import Avatar from "@/public/images/avatar_message.png";

export interface SmsTemplateProps {
	message: string;
}

/**
 * Sms Template
 * @props SmsTemplateProps
 */
const SmsTemplate = ({ message }: SmsTemplateProps) => {
	return (
		<div className="relative rounded-[32px] bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] h-[75vh] aspect-[1/2] overflow-hidden flex flex-col">
			{/* Header */}
			<div className="h-1/5 relative -mt-2 flex flex-col items-start gap-[2px] flex-shrink-0 border-b border-gray-300 bg-gray-200 backdrop-blur-[10px] px-4 py-2 w-full rounded-t-[32px]">
				<div className="flex items-center justify-center relative w-full p-1">
					<div className="absolute left-0 text-[#0C0C0C] text-[14px] font-bold leading-normal">
						9:41
					</div>
					<div className="mx-auto w-2/5 bg-gray-900 text-gray-900 rounded-[14px] text-center flex justify-center">
						1
					</div>
					<div className="absolute right-0 flex gap-1">
						<Signal strokeWidth={4} size={16} />
						<Wifi strokeWidth={4} size={16} />
						<BatteryMedium strokeWidth={4} size={16} />
					</div>
				</div>

				<div className="relative flex items-center w-full h-full m-0 p-0">
					{/* Left Icon */}
					<div className="relative z-10">
						<ChevronLeft color="#9CA3AF" strokeWidth={2} size={20} />
					</div>

					{/* Center Avatar */}
					<div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
						<img src={Avatar.src} alt="Avatar" className="w-10 h-10 rounded-full" />
						<div className="text-[#0C0C0C] text-center font-inter text-[12px] font-medium leading-normal tracking-[0.18px]">
							TEL4VN
						</div>
					</div>
				</div>
			</div>

			{/* Content (Flex-Grow) */}
			<div className="flex-1 overflow-auto px-4">
				<div className="w-full mt-5 text-[#0C0C0C] text-center font-source-serif text-[12px] font-normal leading-normal tracking-[0.18px]">
					Today 9:41
				</div>
				<div className="m-2 space-y-3">
					<div className="relative max-w-xs p-3 bg-gray-300 rounded-lg w-5/6">
						<span className="text-[#0C0C0C] font-inter text-[14px] font-normal leading-normal tracking-[0.14px]">
							{message
								.split(/({{.*?}})/g)
								.map((part, index) =>
									RegExp(/{{.*?}}/).exec(part) ? (
										<strong key={`${part}-${index}`}>{part}</strong>
									) : (
										part
									)
								)}
						</span>
					</div>
				</div>
			</div>

			{/* Footer (Fixed at Bottom) */}
			<div className="p-2 mt-auto pb-1">
				<div className="flex gap-2 p-2 items-center pb-4">
					<Camera color="#888B90" />
					<div className="grow rounded-[18px] border border-[#888B90] w-full">
						<div className="flex justify-between items-center">
							<span className="p-1 text-[#AAAEB4] text-[14px] font-normal leading-normal tracking-[0.14px]">
								SNS/SMS
							</span>
							<div className="p-1">
								<Mic color="#AAAEB4" size={18} />
							</div>
						</div>
					</div>
				</div>
				<div className="bg-gray-900 w-1/2 h-[6px] place-self-center rounded-[10px]"></div>
			</div>
		</div>
	);
};

export default SmsTemplate;
