import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: 32, fontFamily: "sans-serif" }}>
      <h1>404 — Not Found</h1>
      <p>
        <Link href="/">Back to Hashmimic.com</Link>
      </p>
    </div>
  );
}
