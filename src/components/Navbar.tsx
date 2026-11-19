import React from "react";
import Logo from "./Logo";
import { ThemeChanger } from "./ui/theme-changer";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center lg:px-20 px-8 py-5">
      <Logo />
      <div className="">
        <ThemeChanger />
      </div>
    </div>
  );
};

export default Navbar;
