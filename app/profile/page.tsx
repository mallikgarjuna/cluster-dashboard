// "use client";

import { checkAuth } from "@/lib/server-utils";
import { Image } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { HiOutlineUserCircle } from "react-icons/hi";
import ProfileDetails from "../components/auth/ProfileDetails";

const ProfilePage = () => {
  // const session = await checkAuth();
  // const { data: session } = useSession();
  // const user = session?.user;

  //   if un-authenticated, redirect the user to login page
  //   if (!session || !session.user) redirect("/auth/login"); //instead use middleware

  return (
    <ProfileDetails />
    // <div>
    //   ProfilePage
    //   {user?.image ? (
    //     <Image
    //       height={300}
    //       width={300}
    //       src={user?.image ?? ""}
    //       alt={user.firstName ?? ""}
    //       className="rounded-full"
    //     />
    //   ) : (
    //     <HiOutlineUserCircle size={100} />
    //   )}
    //   <div className="grid grid-cols-4 gap-y-4">
    //     <p>First Name: </p> <p className="col-span-3">{user?.firstName}</p>
    //     <p>Last Name: </p> <p className="col-span-3">{user?.lastName}</p>
    //     <p>Email: </p> <p className="col-span-3">{user?.email}</p>
    //   </div>
    // </div>
  );
};

export default ProfilePage;
