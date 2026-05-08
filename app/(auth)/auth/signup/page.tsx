import { Link } from "@/app/components";
import SignupForm from "@/app/components/auth/SignupForm";
import { Box, Text } from "@radix-ui/themes";
import React from "react";
import { FaUserPlus } from "react-icons/fa";

const SignupPage = () => {
  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-5">
      <Box className="flex items-center justify-center gap-2">
        <Text className="text-sm text-[var(--color-text-secondary)]">
          Already have an account?
        </Text>
        <Link href="/auth/login" className="indigo-link text-sm">
          Log in
        </Link>
      </Box>
      <div className="grid w-full items-start gap-8 md:grid-cols-[minmax(0,1fr)_200px]">
        <SignupForm />
        <div className="hidden justify-center md:flex">
          <div className="flex h-40 w-40 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <FaUserPlus size={72} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
