"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { ORPCContext, orpcClient } from "~/lib/orpc";

export function Providers(props: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<ORPCContext.Provider
				value={useMemo(
					() => ({ client: orpcClient, queryClient }),
					[queryClient],
				)}
			>
				{props.children}
			</ORPCContext.Provider>
		</QueryClientProvider>
	);
}
