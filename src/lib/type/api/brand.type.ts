import { AuditInfo, Param } from "@type/common.type";

export type BrandQueryParams = {
	name?: string;
	channel?: string;
} & Param;

export type BrandBody = {
	name: string;
	description: string;
	channel: string;
};

export type Brand = BrandBody & AuditInfo;
