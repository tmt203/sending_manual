import {
	MessageTailDark,
	MessageTailLight,
	PhoneMessage,
	SMSPreviewLight,
	SMSPreviewLightDark,
	ZNSPreviewDark,
	ZNSPreviewLight,
} from "@/public/images";
import { ZOA } from "@/public/svg";
import { formatTextToHtml } from "@utils/format-value";
import parse from "html-react-parser";
import { LucideChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo } from "react";

export interface SMSReviewProps {
	branchName?: string;
	messageContent?: string;
	channel: string;
	phoneNumber?: string;
}

/**
 * SMS Review Component
 * @props SMSReviewProps
 */

const SMSReview = ({ channel, branchName, messageContent, phoneNumber }: SMSReviewProps) => {
	// Hooks
	const t = useTranslations();

	const content = useMemo(() => {
		messageContent = formatTextToHtml(messageContent ?? "");
		return messageContent;
	}, [messageContent]);

	return (
		<div className="relative mx-auto py-1">
			{channel === "sms" ? (
				<>
					{/* Area: SMS Preview */}
					<Image priority alt="sms-preview" className="dark:hidden" src={SMSPreviewLight} />
					<Image
						priority
						alt="sms-preview"
						className="hidden dark:block"
						src={SMSPreviewLightDark}
					/>
					{branchName && (
						<div className="absolute left-0 top-[117px] w-full text-center text-sm font-semibold">
							{branchName}
						</div>
					)}
					{content && (
						<div className="absolute left-0 top-48 ml-5 mr-20 rounded-2xl bg-surface-500 dark:bg-surface-800">
							<div className="relative px-3 py-2 text-base">{parse(content)}</div>
							<Image
								priority
								alt="message-tail"
								src={MessageTailLight}
								className="absolute -bottom-[1px] -left-[5px] dark:hidden"
							/>
							<Image
								priority
								alt="message-tail"
								src={MessageTailDark}
								className="absolute -bottom-[1px] -left-[5px] hidden dark:block"
							/>
						</div>
					)}
				</>
			) : (
				<>
					{/* Area: ZNS Preview */}
					<Image priority alt="zns-preview" className="dark:hidden" src={ZNSPreviewLight} />
					<Image priority alt="zns-preview" className="hidden dark:block" src={ZNSPreviewDark} />
					{branchName && (
						<>
							{branchName && (
								<>
									<div className="absolute left-14 top-[80px] w-fit text-left text-xl font-semibold text-white">
										<div className="flex items-center gap-2">
											<div className="max-w-52 overflow-hidden text-ellipsis whitespace-nowrap">
												{branchName}
											</div>
											<Image src={ZOA} alt="ZOA" />
										</div>
									</div>
									<div className="absolute left-14 top-[108px] text-left text-sm font-normal text-white">
										{t("zns_preview.account")}
									</div>
								</>
							)}
							<div className="absolute left-1 top-[140px]">
								<div className="flex h-[630px] w-[392px] flex-col items-center gap-2 overflow-y-auto bg-slate-200 scrollbar-hide">
									{/* Area: Header section */}
									<div className="mt-10 !flex h-fit w-[352px] justify-center rounded-xl bg-white px-1 py-3 dark:bg-surface-800">
										<div className="flex items-center justify-end">
											{/* Area: Phone message icon */}
											<Image src={PhoneMessage} alt="phone" width={30} />
										</div>

										<div className="flex w-full flex-col gap-1 ps-1">
											{/* Area: Brand and phone number details */}
											<div>
												<span className="font-bold">{branchName}</span>{" "}
												<span>{t("zns_preview.message")}</span>
											</div>
											<span className="text-ellipsis font-bold">{phoneNumber}</span>
										</div>

										<div className="mx-0 my-auto flex-none text-center">
											{/* Area: Chevron icon */}
											<LucideChevronRight />
										</div>
									</div>
									{/* Area: Rendered content */}
									{content && (
										<div className="mb-10 flex w-[352px] flex-col rounded-xl bg-white py-3 dark:bg-surface-800">
											<div className="px-3">
												{/* Area: Notification card content */}
												<div>{parse(content)}</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default SMSReview;
