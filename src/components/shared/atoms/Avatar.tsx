"use client";

import { Size } from "@type/common.type";
import clsx from "clsx";
import Image, { StaticImageData } from "next/image";
import { useMemo } from "react";

export interface AvatarProps {
	avatarSrc: string | StaticImageData;
	isAvatar?: boolean;
	size?: Exclude<Size, "2xs" | "xs" | "2xl" | "full">;
	color?: string;
	className?: string;
}

/**
 * Avatar Component
 * @prop AvatarProps
 */
const Avatar = ({ size = "md", color, isAvatar = true, avatarSrc, className }: AvatarProps) => {
	const iconSize = useMemo(() => {
		switch (size) {
			case "sm":
				return 28;
			case "md":
				return 32;
			case "lg":
				return 40;
			case "xl":
				return 64;
			default:
				return 32;
		}
	}, [size]);
	return (
		<>
			{isAvatar ? (
				<Image
					className={clsx(
						"box-content rounded-full border-2 border-white dark:border-gray-400/30",
						className
					)}
					src={avatarSrc}
					width={iconSize}
					height={iconSize}
					alt="Avatar"
				/>
			) : (
				<div
					className={clsx(
						"flex items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold uppercase text-white dark:bg-gray-700",
						color,
						{
							"size-7 text-sm": size === "sm",
							"size-8 text-base": size === "md",
							"size-10 text-lg": size === "lg",
							"size-16 text-xl": size === "xl",
						}
					)}
				>
					{typeof avatarSrc === "string" ? avatarSrc : "Avatar"}
				</div>
			)}
		</>
	);
};

export default Avatar;
