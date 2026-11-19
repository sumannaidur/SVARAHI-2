import Link from "next/link";
import type { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { ActionBar } from "./action-bar";

/** Header + main + footer + mobile action bar, shared by every non-home page. */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <ActionBar />
    </>
  );
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-[0.72rem] text-ivory/55">
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="size-[4px] rotate-45 bg-gold/70" />}
            {c.href ? (
              <Link href={c.href} className="inline-flex min-h-6 items-center hover:text-gold-soft">{c.label}</Link>
            ) : (
              <span aria-current="page" className="text-ivory/85">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
