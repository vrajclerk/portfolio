import type { Metadata } from "next";
import configPromise from "@payload-config";
import {
  generatePageMetadata,
  NotFoundPage,
} from "@payloadcms/next/views";
import { importMap } from "../importMap.js";

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export const generateMetadata = ({
  params,
  searchParams,
}: Args): Promise<Metadata> =>
  generatePageMetadata({
    config: configPromise,
    params,
    searchParams,
  });

export default function NotFound({ params, searchParams }: Args) {
  return (
    <NotFoundPage
      config={configPromise}
      importMap={importMap}
      params={params}
      searchParams={searchParams}
    />
  );
}
