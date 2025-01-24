import { activateUser } from "@/lib/actions/authActions";
import axios from "axios";
import Link from "next/link";
import React from "react";

interface Props {
  params: {
    jwt: string;
  };
}

// This page was used in createUserByAdmin() SA in authActions.ts;
// When the user/admin clicks the link, this page will be rendered;
const ActivationPage = async ({ params }: Props) => {
  // const response = await axios.post(
  //   `${process.env.AUTH_URL}/api/users/activate`,
  //   {
  //     jwtUserId: params.jwt,
  //   }
  // );
  // const result = response.data;

  const result = await activateUser(params.jwt); //use server action instead of API

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">ActivationPage</h1>
      <p>Activation for {params.jwt}</p>
      <p>{result}</p>
      {result === "userNotExist" ? (
        <p className="text-2xl text-red-500">The user does not exist.</p>
      ) : result === "alreadyActivated" ? (
        <>
          <p className="text-2xl text-red-500">
            The user is already activated.
          </p>
          <Link
            href="/auth/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            prefetch={false}
          >
            <span>Log in</span>
          </Link>
        </>
      ) : result === "success" ? (
        <>
          <p className="text-2xl text-green-500">
            Success! The user is now activated.
          </p>
          <Link
            href="/auth/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            prefetch={false}
          >
            <span>Log in</span>
          </Link>
        </>
      ) : (
        <p className="text-2xl text-yellow-500">
          Oops! Something went wrong...
        </p>
      )}
    </div>
  );
};

export default ActivationPage;
