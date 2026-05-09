"use client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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

  // a function to handle different possible types of 'IconComponent'
  const renderIcon = () => {
    if (!IconComponent) return null;
    if (React.isValidElement(IconComponent)) return IconComponent;
    if (typeof IconComponent === "function") return <IconComponent />;
    return null;
  };

  return (
    <Button asChild variant="outline" className="w-full justify-start px-4">
      <Link
        href={hrefProp}
        aria-disabled={isLoading}
        className={isLoading ? "pointer-events-none" : undefined}
        onClick={(event) => {
          if (isLoading) {
            event.preventDefault();
            return;
          }
          setIsLoading(true);
        }}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {renderIcon()}
        {name}
      </Link>
    </Button>
  );
};

export default ButtonWithSpinner;
