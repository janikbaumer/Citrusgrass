import ApplyPageClient from "./ApplyPageClient";

export async function generateStaticParams() {
  return [{ propertyId: "placeholder" }];
}

export default function ApplyPage() {
  return <ApplyPageClient />;
}
