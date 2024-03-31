"use client";

import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import { HiEye, HiEyeOff, HiKey, HiMail, HiUser } from "react-icons/hi";
import React, { useState } from "react";

const SignupForm = () => {
  const [isVisiblePass, setIsVisiblePass] = useState(false);
  const toggleVisiblePass = () => setIsVisiblePass((prev) => !prev);

  return (
    <form className="grid grid-cols-2 gap-3 p-2 place-self-stretch border rounded-md">
      <Input
        type="text"
        label="First Name"
        placeholder="Enter your first name"
        startContent={<HiUser />}
      />
      <Input
        type="text"
        label="Last Name"
        placeholder="Enter your last name"
        startContent={<HiUser />}
      />
      <Input
        type="email"
        label="Email"
        placeholder="Enter your email"
        startContent={<HiMail />}
        className="col-span-2"
      />
      <Input
        type={isVisiblePass ? "text" : "password"}
        label="Password"
        placeholder="Enter your password"
        startContent={<HiKey />}
        endContent={
          <Button isIconOnly variant="light" onPress={toggleVisiblePass}>
            {isVisiblePass ? <HiEyeOff /> : <HiEye />}
          </Button>
        }
        className="col-span-2"
      />
      <Input
        type={isVisiblePass ? "text" : "password"}
        label="Confirm Password"
        placeholder="Renter to confirm password"
        startContent={<HiKey />}
        className="col-span-2"
      />
      <Checkbox type="checkbox" className="col-span-2">
        I accept the <Link href="/terms"> terms and conditions</Link>.
      </Checkbox>
      <div className="col-span-2 flex justify-center">
        <Button type="submit" color="primary" className="w-48">
          Sign up
        </Button>
      </div>
    </form>
  );
};

export default SignupForm;
