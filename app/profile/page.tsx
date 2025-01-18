import { checkAuth } from "@/lib/server-utils";
import { Image } from "@nextui-org/react";
import { HiOutlineUserCircle } from "react-icons/hi";

const ProfilePage = async () => {
  const session = await checkAuth();
  const user = session?.user;

  //   if un-authenticated, redirect the user to login page
  //   if (!session || !session.user) redirect("/auth/signin"); //instead use middleware

  return (
    <div>
      ProfilePage
      {user?.image ? (
        <Image
          height={300}
          width={300}
          src={user?.image ?? ""}
          alt={user.firstName ?? ""}
          className="rounded-full"
        />
      ) : (
        <HiOutlineUserCircle size={100} />
      )}
      <div className="grid grid-cols-4 gap-y-4">
        <p>First Name: </p> <p className="col-span-3">{user?.firstName}</p>
        <p>Last Name: </p> <p className="col-span-3">{user?.lastName}</p>
        <p>Email: </p> <p className="col-span-3">{user?.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
