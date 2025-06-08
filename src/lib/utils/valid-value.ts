export const isValidPhoneNumber = (phone: string): boolean =>
	/^0\d{9,10}$|^\+84\d{9,10}$/.test(phone.trim());
