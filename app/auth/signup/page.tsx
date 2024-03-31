import { Link } from "@/app/components";
import SignupForm from "@/app/components/auth/SignupForm";
import { Box, Flex, Grid } from "@radix-ui/themes";
import React from "react";
import { FaUserPlus } from "react-icons/fa";

const SignupPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center">
      <Box className="md:col-span-2 flex justify-center items-center">
        <p className="p-2 ">Already have an account?</p>
        <Link href="/auth/signin">Sign in</Link>
      </Box>
      <SignupForm />
      <FaUserPlus size={100} />
    </div>
  );
};

export default SignupPage;
