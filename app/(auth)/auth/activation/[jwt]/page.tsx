import { activateUser } from "@/lib/actions/authActions";
import Link from "next/link";

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
    <div className="page-shell flex min-h-screen items-center justify-center py-16">
      <div className="auth-panel flex max-w-xl flex-col items-center gap-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Account Activation
        </p>
        <h1 className="auth-heading">Activate your account</h1>
        <p className="auth-subtle-copy">
          We checked the activation link and processed the current account
          state.
        </p>
        {result === "userNotExist" ? (
          <p className="text-2xl text-red-500">The user does not exist.</p>
        ) : result === "alreadyActivated" ? (
          <>
            <p className="text-2xl text-red-500">
              The user is already activated.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-4 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-400 md:text-base"
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
              className="inline-flex items-center gap-4 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-blue-400 md:text-base"
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
    </div>
  );
};

export default ActivationPage;
