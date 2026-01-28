"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Swords } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/services/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.actions";

type FormType = "sign-in" | "sign-up";

const getFormSchema = (type: FormType) =>
  z.object({
    name: type === "sign-up" ? z.string() : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8, "Password must be 8 char"),
  });

function AuthForm({ type }: { type: FormType }) {
  const formSchema = getFormSchema(type);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const isSignIn = type == "sign-in";

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isSignIn) {
        const { email, password } = values;

        const userCreds = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const token = await userCreds.user.getIdToken();

        if (!token) {
          toast.error("Sign In Failed");
          return;
        }

        const res = await signIn({ email, idToken: token });

        if (!res.success) {
          toast.error(res.message);
          return;
        }

        toast.success("Sign In Success");
        router.push("/");
        form.reset();
      } else {
        const { name, email, password } = values;

        const userCreds = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const { success, message } = await signUp({
          uid: userCreds.user.uid,
          name: name!,
          email,
          password,
        });

        if (!success) {
          toast.error(message);
          return;
        }

        toast.success("Account Created Now Pls Log In");
        router.push("/sign-in");
        form.reset();
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was Error ${(error as Error).message}`);
    }
  }

  return (
    <div className="w-full max-w-[500px] mx-auto">
      <div className="bg-white border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_#000] overflow-hidden">
        
        {/* Header Section */}
        <div className="pt-8 pb-4 px-8 text-center bg-white">
            <div className="flex items-center justify-center gap-3 mb-2">
                <div className="p-2 rounded-lg border-2 border-black bg-primary flex items-center justify-center">
                  <Swords className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-black text-black uppercase tracking-tight">ESPADAS</h1>
            </div>
            <h2 className="text-lg font-bold text-black">Practice Job Interviews with AI</h2>
        </div>
        
        {/* Divider */}
        <div className="w-full border-t-2 border-black"></div>

        {/* Form Section */}
        <div className="p-8 bg-white">
            <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
            >
                {!isSignIn && (
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-lg font-black text-black">Name:</FormLabel>
                        <FormControl>
                        <Input 
                            placeholder="John Doe"
                            className="text-xl font-bold placeholder:text-gray-500 placeholder:font-normal border-2 border-black rounded-lg h-14 text-black focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_#000] transition-all bg-blue-50" 
                            {...field} 
                            type="text" 
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                )}
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-lg font-black text-black">Email:</FormLabel>
                    <FormControl>
                        <Input 
                            placeholder="mail@example.com"
                            className="text-xl font-bold placeholder:text-gray-500 placeholder:font-normal border-2 border-black rounded-lg h-14 text-black focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_#000] transition-all bg-blue-50" 
                            {...field} 
                            type="email" 
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
                    <FormLabel className="text-lg font-black text-black">Password:</FormLabel>
                    <FormControl>
                        <Input 
                            placeholder="••••••••"
                            className="text-xl font-bold placeholder:text-gray-500 placeholder:font-normal border-2 border-black rounded-lg h-14 text-black focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_#000] transition-all bg-blue-50" 
                            {...field} 
                            type="password" 
                        />
                    </FormControl>

                    <FormMessage />
                    </FormItem>
                )}
                />

                <div className="flex justify-center pt-4">
                    <Button className="bg-primary text-white hover:bg-primary/90 text-lg font-bold py-6 px-12 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all" type="submit">
                         {isSignIn ? "Sign In" : "Sign Up"}
                    </Button>
                </div>
            </form>
            </Form>

            <div className="mt-8 text-center text-black font-bold text-lg">
                 {isSignIn ? "No Account Yet? " : "Have an account already? "}
                <Link
                    href={!isSignIn ? "/sign-in" : "/sign-up"}
                    className="hover:underline"
                >
                    {!isSignIn ? "Sign In" : "Sign Up"}
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
