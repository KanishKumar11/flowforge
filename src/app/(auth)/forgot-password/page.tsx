"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
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
import { Loader2 } from "lucide-react";

const schema = z.object({
  email: z.email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    await authClient.forgetPassword({
      email: values.email,
      redirectTo: "/reset-password",
    });
    setIsLoading(false);
    setSent(true);
  };

  return (
    <div className="w-full max-w-md space-y-8 tech-panel p-8 rounded-none transition-colors duration-500">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold font-heading tracking-tight text-(--arch-fg) uppercase transition-colors duration-500">
          Recover_Access
        </h1>
        <p className="text-(--arch-muted) text-xs font-mono transition-colors duration-500">
          RESET_PASSWORD_KEY //
        </p>
      </div>

      {sent ? (
        <div className="space-y-4">
          <p className="text-sm font-mono text-(--arch-fg) border border-(--arch-border) p-4">
            [OK] Reset link sent. Check your inbox and follow the instructions.
          </p>
          <Link
            href="/login"
            className="block text-center text-[10px] font-mono text-(--arch-muted) hover:text-(--arch-fg) transition-colors uppercase tracking-widest"
          >
            ← RETURN_TO_LOGIN
          </Link>
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-(--arch-muted) text-[10px] font-mono uppercase tracking-widest transition-colors duration-500">
                      Registered_Email
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
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 rounded-sm text-xs font-mono uppercase tracking-widest bg-(--arch-fg) text-(--arch-bg) hover:bg-(--arch-muted) hover:text-white transition-all border border-transparent shadow-[0_0_10px_rgba(255,255,255,0.2)]"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                ) : (
                  "SEND_RESET_LINK"
                )}
              </Button>
            </form>
          </Form>

          <p className="text-center text-xs text-(--arch-muted) font-mono pt-4 border-t border-(--arch-border) transition-colors duration-500">
            <Link
              href="/login"
              className="text-(--arch-fg) hover:underline underline-offset-4 decoration-(--arch-muted)"
            >
              ← RETURN_TO_LOGIN
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
