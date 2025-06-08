import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "../lib/css/style.css";
import AppProvider from "./app-provider";
import Theme from "./theme-provider";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

export const metadata = {
	title: "Pitel SNS",
	description: "Pitel SNS",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html lang={locale} className={`${inter.variable}`} suppressHydrationWarning>
			<body className="bg-gray-100 font-inter text-gray-600 antialiased dark:bg-gray-900 dark:text-gray-400">
				<NextIntlClientProvider messages={messages}>
					<Theme>
						<AppProvider>
							<ToastContainer position="top-right" autoClose={3000} hideProgressBar />
							{children}
						</AppProvider>
					</Theme>
				</NextIntlClientProvider>
			</body>
		</html>
	);
};

export default RootLayout;
