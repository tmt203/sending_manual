import { AuditInfo, Param } from "@type/common.type";

export type TemplateQueryParams = {
	id?: string;
	name?: string;
	brand_id?: string;
} & Param;

export type TemplateBody = {
	name: string;
	content: string;
	params: string[];
	brand_id: string;
};

export type Template = TemplateBody & AuditInfo;
