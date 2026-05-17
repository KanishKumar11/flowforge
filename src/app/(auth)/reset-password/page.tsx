"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
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
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  });

  const onSubmit = async (values: FormValues) => {
    if (!token) {
      toast.error("Invalid or missing reset token. Request a new link.");
      return;
    }
    setIsLoading(true);
    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token,
    });
    setIsLoading(false);
    if (error) {
      toast.error(error.message ?? "Reset failed. The link may have expired.");
    } else {
      toast.success("Password updated. You can now log in.");
      router.push("/login");
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md space-y-8 tech-panel p-8 rounded-none transition-colors duration-500">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-heading tracking-tight text-(--arch-fg) uppercase transition-colors duration-500">
            Invalid_Link
          </h1>
        </div>
        <p className="text-sm font-mono text-(--arch-muted) border border-(--arch-border) p-4">
          [ERR] No reset token found. Request a new password reset link.
        </p>
        <Link
          href="/forgot-password"
          className="block text-center text-[10px] font-mono text-(--arch-muted) hover:text-(--arch-fg) transition-colors uppercase tracking-widest"
        >
          REQUEST_NEW_LINK →
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8 tech-panel p-8 rounded-none transition-colors duration-500">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold font-heading tracking-tight text-(--arch-fg) uppercase transition-colors duration-500">
          New_Password_Key
        </h1>
        <p className="text-(--arch-muted) text-xs font-mono transition-colors duration-500">
          SET_NEW_ACCESS_KEY //
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-(--arch-muted) text-[10px] font-mono uppercase tracking-widest transition-colors duration-500">
                  New_Password_Key
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
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
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-(--arch-muted) text-[10px] font-mono uppercase tracking-widest transition-colors duration-500">
                  Confirm_Password_Key
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                      className="input-tech h-10 rounded-sm hover:border-(--arch-accent) focus:border-(--arch-focus) pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-(--arch-muted) hover:text-(--arch-fg) transition-colors"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span className="sr-only">
                        {showConfirm ? "Hide password" : "Show password"}
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
            disabled={isLoading}
            className="w-full h-10 rounded-sm text-xs font-mono uppercase tracking-widest bg-(--arch-fg) text-(--arch-bg) hover:bg-(--arch-muted) hover:text-white transition-all border border-transparent shadow-[0_0_10px_rgba(255,255,255,0.2)]"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : (
              "UPDATE_PASSWORD_KEY"
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
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
