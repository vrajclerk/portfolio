import configPromise from "@payload-config";
import "@payloadcms/next/css";
import "@/styles/payload-admin.css";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import type { ServerFunctionClient } from "payload";
import React from "react";
import { importMap } from "./admin/importMap.js";

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({
    ...args,
    config: configPromise,
    importMap,
  });
};

export default function PayloadLayout({ children }: Args) {
  return (
    <RootLayout
      config={configPromise}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  );
}
