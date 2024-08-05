import { Link } from "react-router-dom";
import { auth } from "../../lib/supabaseClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoginSchema } from "../../schema/Auth";
import { Button } from "../../components/ui/button";
import { Provider } from "@supabase/supabase-js";

const SignInPage = () => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  // const errors = useFormState(form.control).errors;
  // console.log({ errors });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const { error } = await auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      form.setError(
        "email",
        {
          type: "custom",
          message: "Invalid email or password!",
        },
        {
          shouldFocus: true,
        }
      );
      form.setError(
        "password",
        {
          type: "custom",
          message: "Invalid email or password!",
        },
        {
          shouldFocus: true,
        }
      );
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    const { error } = await auth.signInWithOAuth({
      provider: provider,
    });
    // Handle errors gracefully
  };

  return (
    <main className="max-w-[80%] mx-auto h-screen">
      <div className="flex flex-col gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="w-[30%] m-auto">
              <CardHeader className="">
                <CardTitle>Sign in</CardTitle>
                <CardDescription>
                  Sign in using your registered email address and password!
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-8">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email:</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your registered email address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password:</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex-col">
                <Button
                  // disabled={form.control.err}
                  type="submit"
                  className="w-full"
                >
                  Login
                </Button>
                <CardDescription>
                  Don't have an account yet?{" "}
                  <Link
                    to="/auth/sign-up"
                    className="text-indigo-500 font-bold underline"
                  >
                    Sign up
                  </Link>
                </CardDescription>
              </CardFooter>
            </Card>
          </form>
        </Form>

        <Card className="w-[30%] m-auto">
          <CardHeader className="flex flex-col justify-center w-full gap-2">
            <Button
              type="button"
              variant="secondary"
              className="hover:bg-gray-300 font-semibold"
              onClick={() => signInWithProvider("google")}
            >
              Google
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="hover:bg-gray-300 font-semibold"
              onClick={() => signInWithProvider("github")}
            >
              GitHub
            </Button>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
};

export default SignInPage;
