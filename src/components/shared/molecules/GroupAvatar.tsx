"use client";

import { Size } from "@type/common.type";
import clsx from "clsx";
import { StaticImageData } from "next/image";
import { useMemo } from "react";
import Avatar from "../atoms/Avatar";

export interface AvatarItem {
	avatarSrc: string | StaticImageData;
	isAvatar?: boolean;
}

export interface ListAvatarProps {
	avatars?: AvatarItem[];
	size?: Exclude<Size, "2xs" | "xs" | "2xl" | "full">;
	className?: string;
}

const AVATAR_BACKGROUND_COLOR = [
	"bg-secondary-500 dark:bg-secondary-400",
	"bg-primary-500 dark:bg-primary-400",
	"bg-success-500 dark:bg-success-400",
	"bg-warning-500 dark:bg-warning-400",
	"bg-danger-500 dark:bg-danger-400",
];

/**
 * Group Avatar Component
 * @prop ListAvatarProps
 */
const GroupAvatar = ({ avatars, size = "md", className }: ListAvatarProps) => {
	const listAvatar = useMemo(() => {
		const mappingList = avatars
			?.map((item) => {
				let src = item.avatarSrc;
				if (!item.isAvatar && typeof item.avatarSrc === "string") {
					const listName = item.avatarSrc.split(" ");
					const lastName = listName[listName.length - 1]?.charAt(0);
					const middleName = listName[listName.length - 2]?.charAt(0) ?? "";
					src = lastName + middleName;
				}
				return {
					...item,
					avatarSrc: src,
				};
			})
			.slice(0, 5);
		return mappingList ?? [];
	}, [avatars]);
	return (
		<div className={clsx("flex items-center gap-1 font-medium", className)}>
			<div
				className={clsx("flex items-center", {
					"-space-x-3": ["md", "sm"].includes(size),
					"-space-x-4": size === "lg",
					"-space-x-5": size === "xl",
				})}
			>
				{listAvatar.map((item, index) => (
					<Avatar
						key={`${typeof item.avatarSrc === "string" && item.avatarSrc}-${index}`}
						isAvatar={item.isAvatar}
						avatarSrc={item.avatarSrc}
						color={AVATAR_BACKGROUND_COLOR[index]}
						size={size}
					/>
				))}
			</div>
			{avatars?.length && avatars.length > 5 && <span>{`+${avatars.length - 5}`}</span>}
		</div>
	);
};

export default GroupAvatar;
