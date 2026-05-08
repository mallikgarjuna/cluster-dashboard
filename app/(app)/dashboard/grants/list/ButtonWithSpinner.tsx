"use client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
        onClick={handleClick}
        disabled={isLoading}
        className="w-full px-16"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {renderIcon()}
        {name}
      </Button>
    </Link>
  );
};

export default ButtonWithSpinner;
