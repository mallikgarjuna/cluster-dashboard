import ProfileDetails from "../../components/auth/ProfileDetails";

const ProfilePage = () => {
  // const session = await checkAuth();
  // const { data: session } = useSession();

  //   if un-authenticated, redirect the user to login page
  //   if (!session || !session.user) redirect("/auth/login"); //instead use middleware

  return <ProfileDetails />;
};

export default ProfilePage;
