import { AuditInfo } from "./common.type";

export enum BrandNameType {
	SMS = "sms",
	ZNS = "zns",
}

export type BrandName = {
	active: boolean;
	bu_id: string;
	domain_id: string;
	name: string;
	type: string;
} & AuditInfo;

export type BrandNameQueryParam = {
	sort_by?: string;
	name?: string;
	types?: BrandNameType[];
	created_at_gte?: string;
	created_at_lte?: string;
};

export type BrandNameBody = {
	name: string;
	type: BrandNameType;
};

export type BrandNamePutBody = {
	name?: string;
	active?: boolean;
	bu_ids?: string[];
};
