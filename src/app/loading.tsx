export default function Loading() {
  return <div className="space-y-5" aria-busy="true" aria-label="Loading page"><div className="skeleton h-9 w-64"/><div className="skeleton h-5 w-full max-w-xl"/><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="skeleton h-28"/>)}</div><span className="sr-only">Loading</span></div>;
}
