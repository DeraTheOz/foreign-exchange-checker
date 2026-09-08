import { useRouteError } from "react-router";

export function ErrorPage() {
  const error = useRouteError() as { message?: string } | undefined;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-900 px-4 text-center normal-case">
      <p className="m-0 text-xs leading-tight tracking-widest text-neutral-200">
        ERROR
      </p>
      <h1 className="m-0 text-6xl leading-none text-neutral-50">500</h1>
      <p className="m-0 max-w-127 text-sm leading-tight tracking-widest text-neutral-200">
        Something went wrong while rendering this page.
      </p>
      {error?.message ? (
        <p className="m-0 max-w-127 text-xs leading-tight tracking-widest text-error">
          {error.message}
        </p>
      ) : null}
      <a
        href="/"
        className="mt-2 inline-flex min-h-10 items-center rounded-lg bg-primary px-4 text-sm leading-tight tracking-widest text-primary-foreground">
        BACK HOME
      </a>
    </main>
  );
}
