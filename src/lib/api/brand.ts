import { ApiResponse } from "@type/api.type";
import { Brand, BrandBody, BrandQueryParams } from "@type/api/brand.type";
import { apiDelete, apiGet, apiPost, apiPut } from "@utils/config-api";

const SUB_PATH = "/sns/brands";

/**
 * Api get brands
 * @param params BrandQueryParams
 * @returns ApiResponse<Brand[]>
 */
export const apiGetBrands = async (params: BrandQueryParams) => {
	return await apiGet<ApiResponse<Brand[]>>({
		params,
		token: "",
		url: SUB_PATH,
	});
};

/**
 * Api create brand
 * @param body BrandBody
 * @returns ApiResponse<Brand>
 */
export const apiCreateBrand = async (body: BrandBody) => {
	return await apiPost<ApiResponse<Brand>>({
		body: JSON.stringify(body),
		token: "",
		url: SUB_PATH,
	});
};

/**
 * Api update brand
 * @param id string
 * @param body BrandBody
 * @returns ApiResponse<Brand>
 */
export const apiUpdateBrand = async (id: string, body: BrandBody) => {
	return await apiPut<ApiResponse<Brand>>({
		body: JSON.stringify(body),
		token: "",
		url: `${SUB_PATH}/${id}`,
	});
};

/**
 * Api delete brand
 * @param id string
 * @returns ApiResponse<null>
 */
export const apiDeleteBrand = async (id: string) => {
	return await apiDelete<ApiResponse<null>>({
		token: "",
		url: `${SUB_PATH}/${id}`,
	});
};
