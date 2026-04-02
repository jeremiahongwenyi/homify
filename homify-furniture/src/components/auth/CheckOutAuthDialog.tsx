import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  emailVerificationSchema,
  loginSchema,
  registerSchema,
} from "@/schemas/auth";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp, signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/hooks";

type Step = "email" | "login" | "register";

interface CheckoutAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthenticated: () => void;
}

export function CheckOutAuthDialog({
  open,
  onOpenChange,
  onAuthenticated,
}: CheckoutAuthDialogProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [userEmail, setUserEmail] = useState("");

  const { closeCart } = useCart();

  const emailForm = useForm<z.infer<typeof emailVerificationSchema>>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: { email: "" },
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { password: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const checkEmailMutation = useMutation({
    mutationFn: (email: string) => api.checkEmail(email),
    onMutate: (variables, context) => {
      console.log("  A mutation is about to happen!");
    },
    onSuccess: (data, email) => {
      console.log("data", data, email);

      setUserEmail(email);
      if (data?.data.exists) {
        setStep("login");
      } else {
        setStep("register");
      }
    },
    onError: (error) => {
      console.log("MUTATION ERROR", error);
      toast.error("Unable to process your request. Try again later");
    },
  });

  const loginMutation = useMutation({
    mutationFn: () => logIn(),
  });

  const logIn = async () => {
    const { data, error } = await signIn.email({
      email: userEmail,
      password: loginForm.getValues("password"),
    });

    console.log("data", data);
    console.log("error", error);
    closeCart()
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Login Successful");

    // ✅ Notify parent
    onAuthenticated();

    // ✅ Optional: close dialog explicitly (parent already does it)
    onOpenChange(false);
    toast.success("Login Successful");
    router.push("/checkout");
  };

  const registerMutation = useMutation({
    mutationFn: () => register(),
  });

  const register = async () => {
    console.log(registerForm.getValues());

    try {
      const { firstName, lastName, password, phone } = registerForm.getValues();
      const { data, error } = await signUp.email({
        name: `${firstName} ${lastName}`,
        email: userEmail,
        phone_number: phone,
        password,
      });
      console.log("data", data);
      console.log("error", error);
      if (error) {
        toast.error(error.message || "Login failed");
        return;
      }
      if (!data) {
        toast.error("Something went wrong. Please try again.");
        return;
      }
      // ✅ Notify parent
      onAuthenticated();
      // ✅ Optional: close dialog explicitly (parent already does it)
      onOpenChange(false);
      toast.success("SignUp Successful");
      router.push("/checkout");
    } catch (err: any) {
      console.error("Unexpected error:", err);
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  const handleSocialLogin = (provider: string) => {};

  const handleBack = () => {
    setStep("email");
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="backdrop-blur-sm bg-black/30" />
      <DialogContent className="max-w-xs sm:max-w-xs">
        <DialogHeader className="text-center">
          <DialogTitle className="font-display text-2xl">
            Welcome to Homify Furniture
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === "email" && "Please enter your email to sign up or log in"}
            {step === "login" && "Enter your password to continue"}
            {step === "register" && "Create your account to continue"}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Email */}
        {step === "email" && (
          <div className="space-y-6">
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit((values) =>
                  checkEmailMutation.mutate(values.email),
                )}
                className="space-y-4"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="you@example.com"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={checkEmailMutation.isPending}
                >
                  {checkEmailMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Continue
                </Button>
              </form>
            </Form>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
                or continue with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialLogin("Google")}
                className="w-full"
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialLogin("GitHub")}
                className="w-full"
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>
          </div>
        )}

        {/* Step 2a: Login */}
        {step === "login" && (
          <div className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-0"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            <div className="text-sm text-muted-foreground">
              Signing in as{" "}
              <span className="font-medium text-foreground">{userEmail}</span>
            </div>

            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(() => loginMutation.mutate())}
                className="space-y-4"
              >
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Sign In
                </Button>
              </form>
            </Form>
          </div>
        )}

        {/* Step 2b: Register */}
        {step === "register" && (
          <div className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-0"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(() =>
                  registerMutation.mutate(),
                )}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={registerForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input value={userEmail} disabled className="bg-muted" />
                </FormItem>

                <FormField
                  control={registerForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+254 7XX XXX XXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Min 8 chars, 1 uppercase, 1 number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Re-enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Create Account
                </Button>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

