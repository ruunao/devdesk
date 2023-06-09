import { siteConfig } from "@/config/site";
import Head from "next/head";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function Layout({ children, title = "Home" }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{`${title} | ${siteConfig.devName}`}</title>
      </Head>
      <Header />
      <main className="py-3 px-5">{children}</main>
    </>
  );
}
