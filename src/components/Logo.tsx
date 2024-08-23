import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/">
      <div className=" font-bold  rounded-full flex items-center justify-center text-muted-foreground text-2xl selection:bg-none cursor-pointer gap-4  ">
        <Image src="/logo.png" width={40} height={40} alt="" /> Zlaark
      </div>
    </Link>
  );
};

export default Logo;
