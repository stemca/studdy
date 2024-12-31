import { OpenAPIServerlessHandler } from "@orpc/openapi/fetch";
import { CompositeHandler, ORPCHandler } from "@orpc/server/fetch";
import { ZodCoercer } from "@orpc/zod";

import { router } from "./router";

const openApiHandler = new OpenAPIServerlessHandler(router, {
	schemaCoercers: [new ZodCoercer()],
	onError: ({ error }) => {
		console.error(error);
	},
});

const orpcHandler = new ORPCHandler(router, {
	onError: ({ error }) => {
		console.error(error);
	},
});

const compositeHandler = new CompositeHandler([openApiHandler, orpcHandler]);

export function GET(request: Request) {
	return compositeHandler.fetch(request, {
		prefix: "/api",
	});
}

export const POST = GET;
export const PUT = GET;
export const DELETE = GET;
export const PATCH = GET;
