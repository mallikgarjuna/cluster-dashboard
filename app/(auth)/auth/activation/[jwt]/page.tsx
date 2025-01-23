import { activateUser } from "@/lib/actions/authActions";
import axios from "axios";
import React from "react";

interface Props {
  params: {
    jwt: string;
  };
}
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
      <h1>ActivationPage</h1>
      <p>Activation for {params.jwt}</p>
      <p>{result}</p>
      {result === "userNotExist" ? (
        <p className="text-2xl text-red-500">The user does not exist.</p>
      ) : result === "alreadyActivated" ? (
        <p className="text-2xl text-red-500">The user is already activated.</p>
      ) : result === "success" ? (
        <p className="text-2xl text-green-500">
          Success! The user is now activated.
        </p>
      ) : (
        <p className="text-2xl text-yellow-500">
          Oops! Something went wrong...
        </p>
      )}
    </div>
  );
};

export default ActivationPage;
