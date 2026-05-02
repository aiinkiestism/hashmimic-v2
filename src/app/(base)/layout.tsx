import { NavigationLayer } from "@/components";

export default function BaseLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <NavigationLayer>{children}</NavigationLayer>;
}
