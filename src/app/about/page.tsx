import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <header className="flex items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-semibold text-ink">
          Citrusgrass
        </Link>
        <nav className="flex gap-5 text-sm font-medium text-muted">
          <Link href="/about" className="text-accent">
            About us
          </Link>
          <Link href="/faq" className="hover:text-ink">
            FAQ
          </Link>
          <Link href="/contact" className="hover:text-ink">
            Contact
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <h1 className="mb-6 text-2xl font-semibold">About us</h1>
        <div className="space-y-4 text-ink">
          <p>
            Citrusgrass connects homeowners renting out a property with renters looking for one —
            without turning it into a public listings marketplace.
          </p>
          <p>
            A renter only ever sees a property after a homeowner shares a direct apply link for
            it. There&apos;s no browsable search across landlords, so applying always starts from
            a specific invitation rather than open shopping.
          </p>
          <p>
            Once someone applies, both sides can track where that application stands — from
            received, to reviewed, to a decision — on a shared status board.
          </p>
        </div>
      </main>
    </>
  );
}
