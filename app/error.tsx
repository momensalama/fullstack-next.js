"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <h2 className="text-2xl font-semibold text-primary-200">
        Something went wrong!
      </h2>
      <p className="text-primary-300">{error.message}</p>
      {error.digest && (
        <p className="text-sm text-primary-400">Error digest: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="px-4 py-2 bg-primary-600 text-primary-100 rounded-md hover:bg-primary-700"
      >
        Try again
      </button>
    </div>
  );
}
