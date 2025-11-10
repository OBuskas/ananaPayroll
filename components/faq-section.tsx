import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQSection() {
  const faqs = [
    {
      question: "How does Ananá Payroll ensure my funds are safe?",
      answer:
        "All funds are locked in audited smart contracts on the blockchain. Only the predetermined conditions can release the funds, ensuring complete security and transparency.",
    },
    {
      question: "What cryptocurrencies can I use for payroll?",
      answer:
        "We support major stablecoins like USDC, USDT, and DAI, as well as native tokens. You can pay in any supported crypto on our platform.",
    },
    {
      question: "How does the yield generation work?",
      answer:
        "Locked payroll funds are automatically deposited into trusted DeFi protocols to earn yield. The yield is shared between employer and employee based on your configuration.",
    },
    {
      question: "Can employees access funds before the payment date?",
      answer:
        "Yes! Employees can request early withdrawals if the employer enables this feature. The smart contract ensures fair terms are maintained.",
    },
    {
      question: "What blockchains does Ananá Payroll support?",
      answer:
        "We currently support Ethereum, Polygon, Arbitrum, and Base. More chains are being added regularly based on community feedback.",
    },
    {
      question: "How do I get started?",
      answer:
        "Simply sign up, create your company profile, add employees, and lock your first payroll funds. The entire process takes less than 10 minutes.",
    },
  ]

  return (
    <section className="bg-[#F2E2C4] py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2A190F] mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-[#2A190F]/70">Everything you need to know about Ananá Payroll</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-2xl border-[#2A190F]/10 px-6"
              >
                <AccordionTrigger className="text-left text-[#2A190F] font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#2A190F]/70 leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
