import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] px-4 py-24">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">404</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">Page not found</h1>
        <p className="mt-4 text-gray-600">
          That link doesn&apos;t match anything on The Healing Hands. It may have moved or the address might be
          mistyped.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex justify-center rounded-2xl bg-primary-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-primary-700"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="inline-flex justify-center rounded-2xl border-2 border-primary-200 bg-white px-6 py-3 font-semibold text-primary-800 transition hover:bg-primary-50"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
