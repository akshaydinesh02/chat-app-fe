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
    trigger: "How secure is my chat on Confidant?",
    content:
      "Your chat is highly secure on Confidant. We do not store any messages on our servers, ensuring complete privacy for your conversations.",
  },
  {
    trigger: "Can anyone access my chat history?",
    content:
      "No, since Confidant does not store any chat history, there is no way for anyone, including us, to access your past conversations.",
  },
  {
    trigger: "How do I get started with Confidant?",
    content:
      "Getting started is simple. Just create your account, and you can start chatting privately immediately.",
  },
  {
    trigger: "Does Confidant support multimedia messages?",
    content:
      "Currently, Confidant focuses on text-based messaging to ensure maximum privacy and lightweight performance. We are working on secure ways to handle multimedia messages in future updates.",
  },
  {
    trigger: "Is Confidant available on both mobile and web platforms?",
    content:
      "Yes, Confidant is designed to be accessible on both mobile devices and web browsers, providing a seamless experience across platforms.",
  },
  {
    trigger: "Is Confidant free to use?",
    content:
      "Yes, Confidant is completely free to use. Enjoy private and secure messaging without any cost.",
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
                  <AccordionTrigger className="px-4 bg-indigo-300 rounded-md font-normal">
                    {q.trigger}
                  </AccordionTrigger>
                  <AccordionContent className="bg-indigo-400 rounded-md p-4 text-left font-semibold">
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
