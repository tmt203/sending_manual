import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "../services/locale";

export default getRequestConfig(async () => {
	const locale = await getUserLocale();

	const common = await import(`./locales/${locale}/common.json`);
	const brands = await import(`./locales/${locale}/brands.json`);
	const templates = await import(`./locales/${locale}/templates.json`);
	const components = await import(`./locales/${locale}/components.json`);
	const sendingManual = await import(`./locales/${locale}/sending-manual.json`);

	return {
		locale,
		messages: {
			...common,
			...brands,
			...templates,
			...components,
			...sendingManual,
		},
	};
});
