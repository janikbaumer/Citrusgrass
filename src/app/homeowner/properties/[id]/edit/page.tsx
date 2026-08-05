import EditPropertyClient from "./EditPropertyClient";

export async function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function EditPropertyPage() {
  return <EditPropertyClient />;
}
