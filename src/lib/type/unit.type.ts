import { Param } from "./common.type";

export type Unit = {
	account_number: string;
	address: string;
	bank_name: string;
	brand_name: string;
	city: string;
	country: string;
	created_at: number;
	created_by: string;
	date_of_incorporation: string;
	domain_uuid: string;
	email: string;
	level: string;
	note: string;
	parent_unit_uuid: string;
	phone_number: string;
	status: boolean;
	tax_code: string;
	unit_basis: boolean;
	unit_code: string;
	unit_config: {
		api_url: string;
		google_api_key: string;
		is_recording: boolean;
		logo: string;
		partner: string;
		payment_cost: string;
		version: string;
		zalo_api_key: string;
	};
	unit_leader: string;
	unit_name: string;
	unit_social: {
		facebook: string;
		gmail: string;
		google: string;
		instagram: string;
		linkedin: string;
		skype: string;
		telegram: string;
		tiktok: string;
		twitter: string;
		website: string;
		youtube: string;
		zalo: string;
	};
	unit_uuid: string;
	updated_at: number;
	updated_by: string;
};

export type UnitParam = {
	parent_unit_uuid: string;
	unit_uuid: string;
	unit_name: string;
	unit_code: string;
	unit_leader: string;
	status: boolean;
	level: string;
} & Param;

export type UnitCreate = {
	unit_code: string;
	account_number: string;
	address: string;
	bank_name: string;
	brand_name: string;
	city: string;
	country: string;
	date_of_incorporation: string;
	email: string;
	note: string;
	parent_unit_uuid: string;
	phone_number: string;
	status: boolean;
	tax_code: string;
	unit_basis: boolean;
	unit_config: {
		api_url: string;
		google_api_key: string;
		is_recording: boolean;
		logo: string;
		partner: string;
		payment_cost: string;
		version: string;
		zalo_api_key: string;
	};
	unit_leader: string;
	unit_name: string;
	unit_social: {
		facebook: string;
		gmail: string;
		google: string;
		instagram: string;
		linkedin: string;
		skype: string;
		telegram: string;
		tiktok: string;
		twitter: string;
		website: string;
		youtube: string;
		zalo: string;
	};
	domain_uuid: string;
};
