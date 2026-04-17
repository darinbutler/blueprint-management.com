import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center">
      <div className="container-editorial text-center">
        <p className="eyebrow">404</p>
        <h1 className="headline mt-3">This page isn't on the blueprint.</h1>
        <p className="body-lg mt-5 max-w-xl mx-auto">
          The page you're looking for has moved, been renamed, or never existed.
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <Link href="/" className="btn-primary">
            Back to home
          </Link>
          <Link href="/roster" className="btn-secondary">
            View the roster
          </Link>
        </div>
      </div>
    </section>
  );
}
