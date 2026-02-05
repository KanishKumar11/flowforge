"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { SocialAuthButtons } from "./SocialAuthButtons";

// Password matching validation
const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    try {
      console.log("Signup with:", values);
      await authClient.signUp.email(
        {
          name: values.name,
          email: values.email,
          password: values.password,
          callbackURL: "/",
        },
        {
          onSuccess: async () => {
            router.push("/dashboard");
          },
          onError: (err) => {
            console.log(err);
            toast.error("Something went wrong");
          },
        },
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 tech-panel p-8 rounded-none transition-colors duration-500">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold font-heading tracking-tight text-(--arch-fg) uppercase transition-colors duration-500">
          New_Operator
        </h1>
        <p className="text-(--arch-muted) text-xs font-mono transition-colors duration-500">
          INITIALIZE SETTINGS //
        </p>
      </div>

      <SocialAuthButtons />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-(--arch-border) transition-colors duration-500" />
        </div>
        <div className="relative flex justify-center text-[10px] items-center">
          <span className="bg-(--arch-bg-secondary) px-2 text-(--arch-muted) font-mono uppercase tracking-widest border border-(--arch-border) transition-colors duration-500">
            OR
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-(--arch-muted) text-[10px] font-mono uppercase tracking-widest transition-colors duration-500">
                  Operator_Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    className="input-tech"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-(--arch-muted) text-[10px] font-mono uppercase tracking-widest transition-colors duration-500">
                  Email_Address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    {...field}
                    className="input-tech"
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
                <FormLabel className="text-(--arch-muted) text-[10px] font-mono uppercase tracking-widest transition-colors duration-500">
                  Set_Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      {...field}
                      className="input-tech h-10 rounded-sm hover:border-(--arch-accent) focus:border-(--arch-focus) pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-(--arch-muted) hover:text-(--arch-fg) transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-(--arch-muted) text-[10px] font-mono uppercase tracking-widest transition-colors duration-500">
                  Confirm_Key
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      {...field}
                      className="input-tech h-10 rounded-sm hover:border-(--arch-accent) focus:border-(--arch-focus) pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-(--arch-muted) hover:text-(--arch-fg) transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full h-10 rounded-sm text-xs font-mono uppercase tracking-widest bg-(--arch-fg) text-(--arch-bg) hover:bg-(--arch-muted) hover:text-white transition-all border border-transparent shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : (
              "CREATE_ACCESS"
            )}
          </Button>
        </form>
      </Form>

      <p className="text-center text-xs text-(--arch-muted) font-mono pt-4 border-t border-(--arch-border) transition-colors duration-500">
        HAS_ACCOUNT?{" "}
        <Link
          href="/login"
          className="text-(--arch-fg) hover:underline underline-offset-4 decoration-(--arch-muted)"
        >
          AUTHENTICATE
        </Link>
      </p>
    </div>
  );
}
