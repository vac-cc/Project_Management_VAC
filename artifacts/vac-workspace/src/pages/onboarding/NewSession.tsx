import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/onboarding/OnboardingLayout";
import { useCreateSession, getGetSessionQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const GREEN = "hsl(var(--primary))";
const MUTED = "hsl(var(--muted-foreground))";
const BORDER = "hsl(var(--border))";

const schema = z.object({
  clientName: z.string().min(1, "Required"),
  clientCompany: z.string().min(1, "Required"),
  clientEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  accountManager: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof schema>;

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const, delay } },
});

const monoLabel = {
  fontFamily: "var(--app-font-mono)",
  fontSize: "0.6rem",
  letterSpacing: "0.13em",
  textTransform: "uppercase" as const,
  color: MUTED,
  fontWeight: 400,
};

export default function NewSession() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const createSession = useCreateSession();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientName: "",
      clientCompany: "",
      clientEmail: "",
      accountManager: "",
    },
  });

  function onSubmit(values: FormValues) {
    createSession.mutate(
      {
        data: {
          clientName: values.clientName,
          clientCompany: values.clientCompany,
          clientEmail: values.clientEmail || undefined,
          accountManager: values.accountManager,
        },
      },
      {
        onSuccess: (session) => {
          queryClient.invalidateQueries({ queryKey: getGetSessionQueryKey(session.id) });
          setLocation(`/onboarding/flow/${session.id}`);
        },
      }
    );
  }

  return (
    <Layout>
      <div className="max-w-xl px-14 pt-14 pb-24">
        <motion.div {...fade(0)} className="mb-12">
          <Link
            href="/onboarding"
            className="font-sans text-xs flex items-center gap-1.5 mb-8 transition-colors"
            style={{ color: MUTED }}
            data-testid="link-back-dashboard"
          >
            ← Overview
          </Link>
          <p style={{ ...monoLabel, marginBottom: "12px" }}>New Session</p>
          <h1
            className="font-brand"
            style={{ fontSize: "3rem", lineHeight: 1.05, color: "hsl(var(--foreground))" }}
          >
            Client Details
          </h1>
          <p className="font-sans text-sm mt-4 leading-relaxed" style={{ color: MUTED }}>
            A few details before we begin the discovery session.
          </p>
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <motion.div {...fade(0.08)} className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel style={monoLabel}>Client Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Alexandra Chen"
                        {...field}
                        data-testid="input-client-name"
                        className="bg-transparent border-0 border-b text-sm font-sans"
                        style={{
                          boxShadow: "none",
                          borderRadius: 0,
                          fontWeight: 400,
                          borderBottomColor: BORDER,
                          paddingLeft: 0,
                          paddingRight: 0,
                        }}
                        onFocus={(e) => { e.target.style.borderBottomColor = GREEN; }}
                        onBlur={(e) => { e.target.style.borderBottomColor = BORDER; }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientCompany"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel style={monoLabel}>Company</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Meridian Studio"
                        {...field}
                        data-testid="input-client-company"
                        className="bg-transparent border-0 border-b text-sm font-sans"
                        style={{
                          boxShadow: "none",
                          borderRadius: 0,
                          fontWeight: 400,
                          borderBottomColor: BORDER,
                          paddingLeft: 0,
                          paddingRight: 0,
                        }}
                        onFocus={(e) => { e.target.style.borderBottomColor = GREEN; }}
                        onBlur={(e) => { e.target.style.borderBottomColor = BORDER; }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div {...fade(0.14)}>
              <FormField
                control={form.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel style={monoLabel}>
                      Client Email{" "}
                      <span style={{ opacity: 0.5, textTransform: "none" as const, letterSpacing: 0, fontFamily: "var(--app-font-sans)" }}>
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="hello@meridianstudio.com"
                        type="email"
                        {...field}
                        data-testid="input-client-email"
                        className="bg-transparent border-0 border-b text-sm font-sans"
                        style={{
                          boxShadow: "none",
                          borderRadius: 0,
                          fontWeight: 400,
                          borderBottomColor: BORDER,
                          paddingLeft: 0,
                          paddingRight: 0,
                        }}
                        onFocus={(e) => { e.target.style.borderBottomColor = GREEN; }}
                        onBlur={(e) => { e.target.style.borderBottomColor = BORDER; }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div {...fade(0.2)}>
              <FormField
                control={form.control}
                name="accountManager"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel style={monoLabel}>Account Manager</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your name"
                        {...field}
                        data-testid="input-account-manager"
                        className="bg-transparent border-0 border-b text-sm font-sans"
                        style={{
                          boxShadow: "none",
                          borderRadius: 0,
                          fontWeight: 400,
                          borderBottomColor: BORDER,
                          paddingLeft: 0,
                          paddingRight: 0,
                        }}
                        onFocus={(e) => { e.target.style.borderBottomColor = GREEN; }}
                        onBlur={(e) => { e.target.style.borderBottomColor = BORDER; }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div {...fade(0.26)} className="pt-4">
              <button
                type="submit"
                data-testid="button-start-session"
                disabled={createSession.isPending}
                className="font-sans font-medium text-sm flex items-center gap-3 px-8 py-3.5 transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ background: GREEN, color: "#fff" }}
              >
                {createSession.isPending ? "Creating..." : "Begin Discovery"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </form>
        </Form>
      </div>
    </Layout>
  );
}
