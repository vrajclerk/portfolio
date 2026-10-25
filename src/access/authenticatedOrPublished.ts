import type { Access } from "payload";

/**
 * Access rule allowing:
 * - Authenticated users to read all documents (including drafts and unpublished records).
 * - Anonymous public users to read only documents where `_status === 'published'`.
 */
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) {
    return true;
  }

  return {
    _status: {
      equals: "published",
    },
  };
};
