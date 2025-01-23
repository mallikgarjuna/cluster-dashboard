import { checkAuth } from "@/lib/server-utils";

export default async function ProfileDetails() {
  // useSession() works on the client side (CC);
  // const { data: session } = useSession();

  const session = await checkAuth();
  const user = session?.user;
  // console.log("session: ", session);

  return (
    <div>
      <h1 className="my-8 text-2xl font-bold">ProfilePage</h1>

      {/* Using a react-icon will need to convert this to a CC */}

      <div className="grid grid-cols-4 gap-y-4">
        <p>First Name: </p>{" "}
        <p className="col-span-3">{session?.user?.firstName}</p>
        <p>Last Name: </p>{" "}
        <p className="col-span-3">{session?.user?.lastName}</p>
        <p>Email: </p> <p className="col-span-3">{session?.user?.email}</p>
      </div>
    </div>
  );
}
