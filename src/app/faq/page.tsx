import { PublicHeader } from "@/components/PublicHeader";

const FAQS: { question: string; answer: string }[] = [
  {
    question: "How do I apply for a property?",
    answer:
      "You need a direct apply link from the homeowner listing it. Open that link, sign up or log in, and submit your application from there.",
  },
  {
    question: "Why can't I search or browse available properties?",
    answer:
      "Citrusgrass is invite-based by design — you always start from a specific homeowner's apply link rather than an open marketplace, so there's no public search or listing index to browse.",
  },
  {
    question: "What happens after I apply?",
    answer:
      "The homeowner sees your application on their pipeline board and moves it through stages as they review it. You can follow the same status from your own dashboard.",
  },
  {
    question: "I'm a homeowner — how do I list a property?",
    answer:
      "Sign up as a homeowner, add your property from your dashboard, and share the apply link it generates with whoever you want to be able to apply.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PublicHeader active="/faq" />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        <h1 className="mb-6 text-2xl font-semibold">Frequently asked questions</h1>
        <div className="space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.question}>
              <h2 className="font-medium text-ink">{faq.question}</h2>
              <p className="mt-1 text-muted">{faq.answer}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
