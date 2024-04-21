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
  //   `${process.env.NEXTAUTH_URL}/api/users/activate`,
  //   {
  //     jwtUserId: params.jwt,
  //   }
  // );
  // const result = response.data;

  const result = await activateUser(params.jwt);
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1>ActivationPage</h1>
      <p>Activation for {params.jwt}</p>
      <p>{result}</p>
      {result === "userNotExist" ? (
        <p className="text-red-500 text-2xl">The user does not exist.</p>
      ) : result === "alreadyActivated" ? (
        <p className="text-red-500 text-2xl">The user is already activated.</p>
      ) : result === "success" ? (
        <p className="text-green-500 text-2xl">
          Success! The user is now activated.
        </p>
      ) : (
        <p className="text-yellow-500 text-2xl">
          Oops! Something went wrong...
        </p>
      )}
    </div>
  );
};

export default ActivationPage;
