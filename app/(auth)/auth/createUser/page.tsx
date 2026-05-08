import CreateUserForm from "@/app/components/auth/CreateUserForm";
import React from "react";
import { FaUserPlus } from "react-icons/fa";

const CreateUserPage = () => {
  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-8">
      <div className="grid w-full items-start gap-8 md:grid-cols-[minmax(0,1fr)_160px]">
        <CreateUserForm />
        <div className="hidden justify-center md:flex">
          <div className="flex h-32 w-32 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <FaUserPlus size={52} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;
