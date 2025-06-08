export type Domain = {
	domain_uuid: string;
	domain_name: string;
	version: string;
	logo: string;
	api_url: string;
	color: string;
	cdr_status: any;
	miss_call_status: any;
	setting: {
		ibk_plugin_uuid: string;
		system_key: string;
		his_integration_info: {
			api_url: string;
			org_code: string;
			vendor: string;
			username: string;
			password: string;
		};
		css_url: string;
		default_language: string;
		show_miss_call_popup: string;
		white_label: any;
	};
	created_at: string;
	updated_at: string;
};
