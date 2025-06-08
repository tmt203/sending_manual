"use client";

import { createContext, Dispatch, SetStateAction, useContext, useMemo, useState } from "react";

interface ContextProps {
	sidebarOpen: boolean;
	setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const AppContext = createContext<ContextProps>({
	sidebarOpen: false,
	setSidebarOpen: (): boolean => false,
});

const AppProvider = ({ children }: { children: React.ReactNode }) => {
	const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
	const value = useMemo(() => ({ sidebarOpen, setSidebarOpen }), [sidebarOpen, setSidebarOpen]);
	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppProvider = () => useContext(AppContext);
export default AppProvider;
