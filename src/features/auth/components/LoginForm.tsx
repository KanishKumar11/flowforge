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
import { Github, Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { SocialAuthButtons } from "./SocialAuthButtons";
// import { Spotlight } from "@/components/ui/spotlight"; // Removed for Prism Layout

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
          callbackURL: "/",
        },
        {
          onSuccess: () => {
            router.push("/dashboard");
          },
          onError: () => {
            toast.error("Invalid email or password");
            setIsLoading(false);
          },
        },
      );
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 tech-panel p-8 rounded-none transition-colors duration-500">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold font-heading tracking-tight text-(--arch-fg) uppercase transition-colors duration-500">
          Access_Control
        </h1>
        <p className="text-(--arch-muted) text-xs font-mono transition-colors duration-500">
          AUTHENTICATE TO PROCEED //
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          disabled={isLoading}
          className="w-full h-10 bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) hover:bg-(--arch-fg) hover:text-(--arch-bg) hover:border-(--arch-fg) transition-all duration-200 rounded-none font-mono text-xs uppercase"
        >
          <Github className="mr-2 h-4 w-4" />
          Gihtub
        </Button>
        <Button
          variant="outline"
          disabled={isLoading}
          className="w-full h-10 bg-(--arch-bg) border-(--arch-border) text-(--arch-fg) hover:bg-(--arch-fg) hover:text-(--arch-bg) hover:border-(--arch-fg) transition-all duration-200 rounded-none font-mono text-xs uppercase"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="currentColor"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="currentColor"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="currentColor"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="currentColor"
            />
          </svg>
          Google
        </Button>
      </div>

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-(--arch-muted) text-[10px] font-mono uppercase tracking-widest transition-colors duration-500">
                  User_Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    {...field}
                    className="input-tech h-10 rounded-sm hover:border-(--arch-accent) focus:border-(--arch-focus)"
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
                <div className="flex items-center justify-between">
                  <FormLabel className="text-(--arch-muted) text-[10px] font-mono uppercase tracking-widest transition-colors duration-500">
                    Password_Key
                  </FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-[10px] font-mono text-(--arch-muted) hover:text-(--arch-fg) transition-colors"
                  >
                    [FORGOT_KEY]
                  </Link>
                </div>
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
              "INITIATE_SESSION"
            )}
          </Button>
        </form>
      </Form>

      <p className="text-center text-xs text-(--arch-muted) font-mono pt-4 border-t border-(--arch-border) transition-colors duration-500">
        NO_ACCOUNT?{" "}
        <Link
          href="/signup"
          className="text-(--arch-fg) hover:underline underline-offset-4 decoration-(--arch-muted)"
        >
          REGISTER_NEW
        </Link>
      </p>
    </div>
  );
}
