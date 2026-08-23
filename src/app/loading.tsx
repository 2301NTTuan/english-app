export default function Loading() {
  return <div className="space-y-5" aria-busy="true" aria-label="Loading page"><div className="h-9 w-64 animate-pulse rounded-lg bg-[#dfe8e3]"/><div className="h-5 w-full max-w-xl animate-pulse rounded bg-[#e7eeea]"/><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="card h-28 animate-pulse"/>)}</div><span className="sr-only">Loading</span></div>;
}
