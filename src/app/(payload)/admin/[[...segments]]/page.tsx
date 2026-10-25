import type { Metadata } from "next";
import configPromise from "@payload-config";
import { generatePageMetadata, RootPage } from "@payloadcms/next/views";
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

export default function AdminPage({ params, searchParams }: Args) {
  return (
    <RootPage
      config={configPromise}
      importMap={importMap}
      params={params}
      searchParams={searchParams}
    />
  );
}
