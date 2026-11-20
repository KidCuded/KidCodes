import Link from "next/link";
import SiteNav from "@/app/components/nav/SiteNav";

export default function NotFound() {
  return (
    <>
      <SiteNav variant="header" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center px-4 py-20 sm:px-6">
        <p className="mb-2 font-semibold text-accent">404</p>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white">This room doesn&apos;t exist.</h1>
        <p className="mb-8 text-ink-muted">The page you were looking for isn&apos;t here. Try one of these:</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="rounded-md bg-accent px-5 py-3 font-semibold text-room-wall hover:bg-white">
            Back to room
          </Link>
          <Link href="/portfolio#projects" className="rounded-md border border-accent px-5 py-3 font-semibold text-accent hover:bg-accent/10">
            See projects
          </Link>
        </div>
      </main>
    </>
  );
}
