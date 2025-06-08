import { AuditInfo, Param } from "@type/common.type";

export type Template = {
    name: string;
    content: string;
    params: string[];
} & AuditInfo;

export type TemplateQueryParams = {
    name?: string;
} & Param;