import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

interface CardAction {
	key: string;
	label: string;
	disabled?: boolean;
	action: () => void;
}

export interface CardProps {
	title: string;
	className?: string;
	children?: ReactNode;
	description?: string;
	actions?: CardAction[];
}

const Card = ({ title, actions, children, description, className }: CardProps) => {
	const t = useTranslations();
	return (
		<div
			className={clsx(
				className,
				"flex flex-col p-4 col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-surface-300/5 shadow dark:border-none border border-gray-100 rounded-xl"
			)}
		>
			<header className="flex justify-between items-start mb-2">
				{/* Area: Title */}
				<h2 className="text-lg font-semibold mb-2">{t(title)}</h2>

				{/* Area: Action Menu button */}
				{actions?.length && (
					<Menu as="div" className="relative inline-flex">
						{({ open }) => (
							<>
								<MenuButton
									className={clsx("rounded-full", {
										"bg-gray-100 dark:bg-gray-700/60 text-gray-500 dark:text-gray-400": open,
										"text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400":
											!open,
									})}
								>
									<span className="sr-only">Menu</span>
									<svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
										<circle cx="16" cy="16" r="2" />
										<circle cx="10" cy="16" r="2" />
										<circle cx="22" cy="16" r="2" />
									</svg>
								</MenuButton>

								{/* Area: Action Menu */}
								<Transition
									as="div"
									className="origin-top-right z-10 absolute top-full min-w-[9rem] bg-white dark:bg-gray-800 border border-gray-200 dark:border-surface-400/30 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 right-0"
									enter="transition ease-out duration-200 transform"
									enterFrom="opacity-0 -translate-y-2"
									enterTo="opacity-100 translate-y-0"
									leave="transition ease-out duration-200"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
								>
									<MenuItems as="ul" className="focus:outline-none">
										{actions.map((item) => (
											<MenuItem as="li" key={item.key}>
												{({ focus }) => (
													<button
														className="font-medium text-sm flex py-1 px-3"
														onClick={item.action}
													>
														{t(item.label)}
													</button>
												)}
											</MenuItem>
										))}
									</MenuItems>
								</Transition>
							</>
						)}
					</Menu>
				)}
			</header>
			<div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">
				{description}
			</div>
			<div className="flex items-start">{children}</div>
		</div>
	);
};

export default Card;
