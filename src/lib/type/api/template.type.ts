import { AuditInfo, Param } from "@type/common.type";

export type TemplateQueryParams = {
	name?: string;
} & Param;

export type TemplateBody = {
	name: string;
	content: string;
	params: string[];
	brand_id: string;
};

export type Template = TemplateBody & AuditInfo;
