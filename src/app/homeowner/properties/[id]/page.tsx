import PropertyPipelineClient from "./PropertyPipelineClient";

export async function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function PropertyPipelinePage() {
  return <PropertyPipelineClient />;
}
