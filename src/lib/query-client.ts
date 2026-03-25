import { QueryClient } from "@tanstack/react-query";

export const TODO_STALE_TIME = 15000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: TODO_STALE_TIME,
      retry: 1,
    },
  },
});
