"use client";

import { EN, VI } from "@/public/svg";
import { setUserLocale } from "@/src/lib/services/locale";
import { useLocale } from "next-intl";
import Image from "next/image";
import { ReactNode, useCallback, useTransition } from "react";

export interface LanguageToggleProps {
	children?: ReactNode;
}

/**
 * Language Toggle Component
 * @props LanguageToggleProps
 */
const LanguageToggle = ({ children }: LanguageToggleProps) => {
	// Hooks
	const locale = useLocale();
	const [isPending, startTransition] = useTransition();

	/**
	 * Handle language change
	 */
	const handleLanguageChange = useCallback(() => {
		const newLocale = locale === "vi" ? "en" : "vi";
		startTransition(() => {
			setUserLocale(newLocale);
		});
	}, [locale, setUserLocale, startTransition]);

	return (
		<button
			className="flex items-center justify-between pl-4 pr-3 py-2 mb-0.5 last:mb-0"
			disabled={isPending}
			onClick={handleLanguageChange}
		>
			<div className="grow flex items-center">
				{locale === "vi" ? (
					<div className="w-4 h-4 flex items-center justify-center">
						<Image alt="vi icon" src={VI} priority />
					</div>
				) : (
					<div className="w-4 h-4 flex items-center justify-center">
						<Image alt="vi icon" src={EN} priority />
					</div>
				)}

				{children}
			</div>
		</button>
	);
};

export default LanguageToggle;
