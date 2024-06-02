import CreateUserForm from "@/app/components/auth/CreateUserForm";
import React from "react";
import { FaUserPlus } from "react-icons/fa";

const CreateUserPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 place-items-center items-center gap-3">
      <CreateUserForm />
      <FaUserPlus size={100} />
    </div>
  );
};

export default CreateUserPage;
