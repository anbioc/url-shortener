"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { signinAction, signupAction } from "@/lib/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "./ui/spinner";


type AuthType = "signin" | "signup";

const authFormSchema = (formType: AuthType) => {
  return z.object({
    email: z.string().min(4).max(50),
    password: z.string().min(2).max(50),
    fullname:
      formType === "signup" ? z.string().min(2).max(50) : z.string().optional(),
  });
};
export function AuthForm({ type }: { type: AuthType }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] =useState<string>("")
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

    async function onSubmit(values: z.infer<typeof formSchema>) {
          setLoading(true);
          if (type == "signin") {
            signin(values)
          } else {
            signup(values)
          }

    }

  async function signup(values: z.infer<typeof formSchema>) {
    try {
     const result  = await signupAction({
        email: values.email,
        password: values.password,
        fullname: values.fullname
      });

      if (result.success) {
        router.push("/sign-in")
      } else {
        toast(`Sign up failed: ${result.error}`)
      }
    } catch(e: any) {
      setMessage(e.message)
    } finally {
      setLoading(false);
    }

  }

  async function signin(values: z.infer<typeof formSchema>) {
    try {
     const result  = await signinAction({
        email: values.email,
        password: values.password,
      });

      if (result.success) {
        router.push("/")
      } else {
        toast(`Sign up failed: ${result.error}`)
      }
    } catch(e: any) {
      setMessage(e.message)
    } finally {
      setLoading(false);
    }
  }

  return (

   <div className="min-h-screen min-w-screen items-center justify-center flex flex-col">
     <div className=" p-4">
      {
        type == "signin" ?
        <h1 className="text-center text-2xl">Please Sign in</h1> :
        <h1 className="text-center text-2xl">Please sign up</h1>
      }
        <div className="my-16"/>
         <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full max-w-3xl items-center 
       justify-center space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div
                className="flex flex-col h-20 bg-slate-100
              ring-1 rounded-xl ring-slate-50 px-4 my-2 shadow-drop-1"
              >
                <FormLabel className="pt-2 w-full">Email</FormLabel>
                <FormControl>
                  <Input
                    className="w-100 border-none shadow-none p-0 mt-1 outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 "
                    type="email"
                    placeholder=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col h-20 bg-slate-100  ring-1 rounded-xl ring-slate-50 px-4 my-2">
                <FormLabel className="pt-2 w-full">Password</FormLabel>
                <FormControl>
                  <Input
                    className="w-100 border-none shadow-none p-0 mt-1 outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0  "
                    type="password"
                    placeholder="***"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {type == "signup" && (
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col h-20 bg-slate-100  ring-1 rounded-xl ring-slate-50 px-4 my-2">
                  <FormLabel className="pt-2 w-full">Fullname</FormLabel>
                  <FormControl>
                    <Input
                      className="w-100 border-none shadow-none p-0 mt-1 outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 "
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        )}
        <div className="flex w-full justify-end">
          <Button disabled={loading}
           type="submit" 
           className="w-44 text-lg">
            
            {type == "signin" ? "Sign-in" : "Sign-up"}
            {
              loading && <Spinner className="size-3 text-sky-400"/>
            }
           </Button>
        </div>
      </form>
    </Form>
    </div>

    {
      type == "signin" ? <Link href="/sign-up" className="mt-20">
        Go to <span className="font-semibold">Sign-up</span>?
      </Link>: 
      <Link href="sign-in" className="mt-20">
        Go to <span className="font-semibold">Sign-in</span>?
      </Link>
    }

    {
      message ?? 
      <h2 className="bg-red-400 py-8">{message}</h2>
    }
   </div>
  );
}
