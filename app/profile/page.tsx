import { getServerSession } from "next-auth";
import React from "react";
import authOptions from "../auth/authOptions";
import { Image } from "@nextui-org/react";
import { HiOutlineUserCircle, HiUser } from "react-icons/hi";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  //   if un-authenticated, redirect the user to login page
  if (!session || !session.user) redirect("/auth/signin");

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
