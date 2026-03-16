"use client";

import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategorySection from "@/components/home/CategorySection";
import { useEffect } from "react";
import { signIn } from "@/lib/auth-client";

export default function Home() {
  useEffect(() => {
    // getTestData()
    // Login();
    checkEmail("jerr@gmail.com");
  });

  const checkEmail = async (email: string) => {
    const response = await fetch("/api/check-email", {
      method:'POST',
      body: JSON.stringify({ email }),
    });

    console.log("response", response);

    const data = await response.json();
    console.log("data", data);
  };

  const Login = async () => {
    try {
      const { data, error } = await signIn.email({
        email: "jerrmiah.ongwenyi@gmail.com",
        password: "wrwywgsv",
      });

      console.log("data", data);
      console.log("error", error);
    } catch (err) {
      (console.log("error"), err);
    }
  };

  const getTestData = async () => {
    try {
      const response = await fetch("/api/test");
      const res = await response.json();

      console.log("response", res);
    } catch (error) {
      console.log("errorstatus", error);
    }
  };

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <FeaturedProducts />
      <CategorySection />
    </>
  );
}
