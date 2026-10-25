import type { Access } from "payload";

/**
 * Access rule allowing only authenticated users (logged-in CMS administrators).
 * Anonymous users are denied.
 */
export const authenticated: Access = ({ req: { user } }) => Boolean(user);
