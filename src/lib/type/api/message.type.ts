export type Destination = {
	phone_number: string;
	list_param: Record<string, string>;
};

export type MessageBody = {
	template_id: string;
	destinations: Destination[];
};
