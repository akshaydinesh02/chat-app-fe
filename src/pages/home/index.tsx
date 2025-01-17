import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/Auth";
import { useRealTimeRoomData } from "../../hooks/useRealTimeRoomData";

const sellingPoints = [
  {
    header: "Complete Privacy",
    description: "Enjoy secure conversations with no message storage.",
  },
  {
    header: "Lightweight Design",
    description: "Experience swift performance and low resource consumption.",
  },
  {
    header: "User-Friendly",
    description: "Navigate effortlessly with an intuitive interface.",
  },
  {
    header: "Encryption",
    description: "Secure end-to-end encryption for all messages.",
  },
  {
    header: "Zero Retention",
    description: "Messages are never stored, ensuring ultimate privacy.",
  },
  {
    header: "Fast Setup",
    description: "Quick and simple setup for immediate use.",
  },
];

const HomePage = () => {
  // const session = useAuth().session;
  const user = useAuth().user;
  const logout = useAuth().signOut;
  const metadata = useRealTimeRoomData();
  console.log("Number of rooms", metadata);

  // const onOAuthClick = useCallback(async (provider: Provider) => {
  //   const res = await auth.signInWithOAuth({
  //     provider: provider,
  //   });
  //   console.log("res", res);
  // }, []);

  return (
    <main className="max-w-[80%] mx-auto">
      <section className="flex flex-col gap-2">
        <Card className="border-0 shadow-none w-[50%] mx-auto my-8 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
          <CardHeader className="items-center justify-center">
            <CardTitle className="text-3xl">Confidant</CardTitle>
            <CardDescription className="text-black font-medium">
              A private, lightweight, and user-friendly chat app.
            </CardDescription>
          </CardHeader>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sellingPoints.map((point, _i) => (
            <Card key={_i} className="bg-indigo-200">
              <CardHeader className="items-center justify-center">
                <CardTitle>{point.header}</CardTitle>
              </CardHeader>
              <CardContent className="text-center font-medium">
                <CardDescription className="text-black">
                  {point.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        {!user ? (
          <Link to="/auth/sign-up" className="mx-auto my-6">
            <Button className="bg-violet-300 text-black hover:bg-violet-400 font-semibold">
              Try Now
            </Button>
          </Link>
        ) : (
          <></>
        )}
        <button onClick={logout}> test logout</button>
      </section>
    </main>
  );
};

export default HomePage;
