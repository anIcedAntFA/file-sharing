import { createRouter } from '@tanstack/react-router';

import { routeTree } from '@/route-tree.gen';
import { QUERY_CLIENT } from '../tanstack-query';

export const ROUTE_CLIENT = createRouter({
  routeTree,
  notFoundMode: 'fuzzy',
  context: {
    queryClient: QUERY_CLIENT,
  },
  defaultPreload: 'intent',
  /**
   * * Since we're using React Query, we don't want loader calls to ever be stale
   * * This will ensure that the loader always runs when the route preloads or when you visit it
   */
  defaultPreloadStaleTime: 0,
});

//* Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof ROUTE_CLIENT;
  }
}
