import { List } from "./api/list.type";

export type Campaign = {
	active: any;
	campaign_name: string;
	campaign_uuid: string;
	created_at: string;
	created_by: string;
	domain_uuid: string;
	is_user_pause: boolean;
	lists: List[];
	number_concurrency: number;
	run_lists: [
		{
			campaign_uuid: string;
			created_at: string;
			domain_uuid: string;
			id: string;
			list_uuid: string;
			param: any;
			run_uuid: string;
			updated_at: string;
		},
	];
	status: string;
	template: {
		approve_status: string;
		approved_at: string;
		content: string;
		created_at: string;
		domain_uuid: string;
		note: string;
		partition: string;
		plugin: {
			brand_name: string;
			created_at: string;
			created_by: string;
			domain_uuid: string;
			max_attempts: number;
			plugin_alias: string;
			plugin_name: string;
			plugin_uuid: string;
			setting: {
				pitel_f: {
					api_auth_url: string;
					api_oa_url: string;
					api_url: string;
					app_id_oa: string;
					client_id: string;
					client_secret: string;
					grant_type: string;
					scope: string;
					secret_key_oa: string;
					signature: string;
				};
				pitel_i: {
					api_oa_url: string;
					api_url: string;
					password: string;
					signature: string;
					username: string;
				};
			};
			status: boolean;
			updated_at: string;
			updated_by: string;
			webhook_url: [
				{
					method_action: string;
					password: string;
					signature: string;
					token: string;
					url: string;
					username: string;
				},
			];
		};
		plugin_uuid: string;
		sample_content: string;
		status: boolean;
		template_code: string;
		template_name: string;
		template_type: string;
		template_uuid: string;
		updated_at: string;
	};
	template_uuid: string;
	time_end: string;
	time_end_running: string;
	time_start: string;
	time_start_running: string;
	type: string;
	updated_at: string;
	updated_by: string;
};
