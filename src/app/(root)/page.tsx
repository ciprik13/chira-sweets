import type { Metadata } from "next";

/**
 * "/" → "/ro/". On Cloudflare the redirect is done by public/_redirects (HTTP 302);
 * this page is the fallback for other static hosts and local `serve out`.
 */
export const metadata: Metadata = {
  title: "Chira Sweets",
  robots: { index: false },
  alternates: { canonical: "/ro/" },
};

export default function RootRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content="0;url=/ro/" />
      <p style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        <a href="/ro/">Chira Sweets — continuă</a>
      </p>
    </>
  );
}
