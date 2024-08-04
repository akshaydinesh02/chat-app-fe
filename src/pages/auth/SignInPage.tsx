import { useState } from "react";
import { Link } from "react-router-dom";
import { auth, supabase } from "../../lib/supabaseClient";
import { cn } from "../../lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "../../schema/Login";
import { Button } from "../../components/ui/button";
// import { useAuth } from "../../hooks/Auth";
import { useFormState } from "react-hook-form";
import { Provider } from "@supabase/supabase-js";

const SignInPage = () => {
  // ==============================
  // If user is already logged in, redirect to home
  // This logic is being repeated in SignIn and SignUp..
  // const session = useAuth().session;
  // if (session) return <Navigate to="/" />;
  // maybe we can create a wrapper component for these pages
  // just like the ./router/AuthProtectedRoute.tsx? up to you.
  // ==============================
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  // const errors = useFormState(form.control).errors;
  // console.log({ errors });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
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
  }

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
              <CardFooter>
                <Button
                  // disabled={form.control.err}
                  type="submit"
                  className="w-full"
                >
                  Login
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>

        <Card className="w-[30%] m-auto">
          <CardHeader className="flex flex-col justify-center w-full gap-2">
            <CardTitle className="text-center">Single sign on</CardTitle>
            <Button
              type="button"
              variant="secondary"
              className="hover:bg-gray-300 font-semibold"
              onClick={() => signInWithProvider("google")}
            >
              Login using Google
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="hover:bg-gray-300 font-semibold"
              onClick={() => signInWithProvider("github")}
            >
              Login using GitHub
            </Button>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
};

export default SignInPage;
