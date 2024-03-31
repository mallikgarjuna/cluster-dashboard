import { Link } from "@/app/components";
import SignupForm from "@/app/components/auth/SignupForm";
import { Box, Flex, Grid, Text } from "@radix-ui/themes";
import React from "react";
import { FaUserPlus } from "react-icons/fa";

const SignupPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 place-items-center items-center gap-3">
      <Box className="md:col-span-2 flex justify-center items-center">
        <Text className="p-2 ">Already have an account?</Text>
        <Link href="/auth/signin">Sign in</Link>
      </Box>
      <SignupForm />
      <FaUserPlus size={200} />
    </div>
  );
};

export default SignupPage;
