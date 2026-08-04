import Link from "next/link";

export default function ContactPage() {
  return (
    <>
      <header className="flex items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-semibold text-ink">
          Citrusgrass
        </Link>
        <nav className="flex gap-5 text-sm font-medium text-muted">
          <Link href="/about" className="hover:text-ink">
            About us
          </Link>
          <Link href="/faq" className="hover:text-ink">
            FAQ
          </Link>
          <Link href="/contact" className="text-accent">
            Contact
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <h1 className="mb-6 text-2xl font-semibold">Contact</h1>
        <p className="text-ink">
          Questions, feedback, or something not working as expected? Reach out at{" "}
          <a
            href="mailto:info@citrusgrass.com"
            className="font-medium text-accent underline underline-offset-2"
          >
            info@citrusgrass.com
          </a>
          .
        </p>
      </main>
    </>
  );
}
