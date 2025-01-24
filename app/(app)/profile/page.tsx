import Link from "next/link";
import ProfileDetails from "../../components/auth/ProfileDetails";

const ProfilePage = () => {
  // const session = await checkAuth();
  // const { data: session } = useSession();

  //   if un-authenticated, redirect the user to login page
  //   if (!session || !session.user) redirect("/auth/login"); //instead use middleware

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-8">
      <ProfileDetails />

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Reset password</h2>
        <Link
          href="/auth/forgotPassword"
          className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
        >
          <span>Reset your password</span>
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
