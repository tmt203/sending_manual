import { ApiResponse } from "@type/api.type";
import { MessageBody } from "@type/api/message.type";
import { apiPost } from "@utils/config-api";

const SUB_PATH = "/sns/messages";

/**
 * Api create message
 * @returns ApiResponse<null>
 */
export const apiCreateMessage = async (body: MessageBody) => {
	return await apiPost<ApiResponse<null>>({
		body: JSON.stringify(body),
		token: "",
		url: SUB_PATH,
	});
};