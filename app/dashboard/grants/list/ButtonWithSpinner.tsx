"use client";
import { Button, Spinner } from "@nextui-org/react";
// import { Spinner } from "@/app/components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ComponentType, ReactElement, useState } from "react";

interface Props {
  hrefProp: string;
  name: string;
  iconComponent?: ReactElement | ComponentType<any>;
}
const ButtonWithSpinner = ({
  hrefProp,
  name,
  iconComponent: IconComponent,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // a function to handle different possible types of 'IconComponent'
  const renderIcon = () => {
    if (!IconComponent) return null;
    if (React.isValidElement(IconComponent)) return IconComponent;
    if (typeof IconComponent === "function") return <IconComponent />;
    return null;
  };

  // This way. clicking anywhere on the button will
  // trigger the loading spinner and navigation
  const handleClick = () => {
    setIsLoading(true);
    router.push(hrefProp);
  };

  return (
    <Link href={hrefProp}>
      <Button
        // onClick={() => setIsLoading(true)}
        onClick={handleClick}
        disabled={isLoading}
        isLoading={isLoading}
        spinner={<Spinner color="white" size="sm" />}
        spinnerPlacement="start"
        color="primary"
        className="px-16"
      >
        {/* {isLoading && <Spinner size="sm" />} */}
        {renderIcon()}
        {name}
        {/* <Link href={hrefProp}>{name}</Link> */}
      </Button>
    </Link>
  );
};

export default ButtonWithSpinner;
