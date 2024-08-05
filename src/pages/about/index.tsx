import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const faq = [
  {
    trigger: "Is it accessible?",
    content: "Yes. It adheres",
  },
  {
    trigger: "Is it doable?",
    content: "NO. It's not",
  },
];

const AboutPage = () => {
  return (
    <main className="max-w-[80%] mx-auto my-24">
      <section className="flex flex-col gap-12">
        <Card className="bg-indigo-200">
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              About Confidant
            </CardTitle>
          </CardHeader>
          <CardContent className="font-medium text-center text-lg">
            Welcome to Confidant, the ultimate solution for secure, private, and
            effortless 1 on 1 communication. Our chat app is designed with
            privacy as its cornerstone, ensuring that your messages are never
            stored anywhere and remain entirely confidential. Lightweight and
            user-friendly, Confidant provides a seamless messaging experience
            with complete peace of mind. Connect with your friends and family
            with the assurance that your conversations are secure and private.
          </CardContent>
        </Card>
        <Card className="bg-indigo-200">
          <CardHeader>
            <CardTitle className="text-center text-3xl">FAQ's</CardTitle>
          </CardHeader>
          <CardContent className="font-medium text-center text-lg">
            <Accordion
              type="single"
              className="flex flex-col gap-4"
              collapsible
            >
              {faq.map((q, _i) => (
                <AccordionItem
                  key={_i}
                  value={_i.toString()}
                  className="border-none"
                >
                  <AccordionTrigger className="px-4 bg-indigo-300 rounded-md">
                    {q.trigger}
                  </AccordionTrigger>
                  <AccordionContent className="bg-indigo-400 rounded-md p-4">
                    {q.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default AboutPage;
