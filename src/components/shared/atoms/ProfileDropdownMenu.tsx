import { AvatarUser } from "@/public/images";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import clsx from "clsx";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { Action } from "../organisms/Sidebar";
import Icon from "./Icon";

export interface ProfileDropdownMenuProps {
	image?: string | StaticImport;
	name?: string;
	sidebarOpen: boolean;
	actions: Action[];
}

/**
 * Profile dropdown menu component
 * @param image string | StaticImport
 * @param name string
 * @param sidebarOpen boolean
 * @param actions Action[]
 * @returns
 */
const ProfileDropdownMenu = ({
	image = AvatarUser,
	name = "",
	sidebarOpen,
	actions,
}: ProfileDropdownMenuProps) => {
	return (
		<Popover className="relative">
			<PopoverButton className="flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-0 dark:text-gray-300 dark:hover:text-gray-100 hover:text-gray-800 ">
				{/* User image */}
				<Image alt="Avatar User" src={image} width={32} />

				{/* User name */}
				<span
					className={clsx(
						"font-medium lg:opacity-0 text-nowrap text-left lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200",
						{
							"block max-w-32 text-ellipsis overflow-hidden": sidebarOpen,
							"hidden w-0 group-hover:!block group-hover:!w-20": !sidebarOpen,
						}
					)}
				>
					{name}
				</span>
			</PopoverButton>
			<Transition
				as="div"
				className={`origin-top-right z-10 absolute top-full left-0 right-auto min-w-[14rem] bg-white dark:bg-gray-800 border border-gray-200 dark:border-surface-400/30 rounded-lg shadow-lg overflow-hidden mt-1`}
				enter="transition ease-out duration-200 transform"
				enterFrom="opacity-0 -translate-y-2"
				enterTo="opacity-100 translate-y-0"
				leave="transition ease-out duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<PopoverPanel className="flex flex-col gap-2">
					{actions.map(({ label, icon, action }, index) => {
						return (
							<button
								key={`${label}-${index}`}
								className="flex items-center gap-2 px-2 h-10 cursor-pointer"
								onClick={action}
							>
								<Icon name={icon} size={16} />
								<span className="text-sm font-medium">{label}</span>
							</button>
						);
					})}
				</PopoverPanel>
			</Transition>
		</Popover>
	);
};

export default ProfileDropdownMenu;
