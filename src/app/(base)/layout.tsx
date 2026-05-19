// NavigationLayer is provided by the root layout so cross-route transitions
// (including to /not-found) don't unmount and remount it. This group layout
// is kept as a pass-through so the (base) route group still has a layout
// boundary if we ever need to add (base)-specific wrapping later.
export default function BaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
