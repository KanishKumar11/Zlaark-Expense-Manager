import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await auth();
  if (session?.user) redirect("/");
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <Card>
        <CardHeader>
          <CardTitle>Authenticate yourself</CardTitle>
          <CardDescription>
            To enter the world of Zlaark expense manager
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2  w-full ">
            {" "}
            <form
              action={async () => {
                "use server";
                await signIn("google", {
                  redirectTo: "/",
                });
              }}
              className="w-full"
            >
              <Button className="w-full" type="submit">
                <Image
                  src="/google.svg"
                  width={30}
                  height={30}
                  className="w-5 h-5 mr-3"
                  alt=""
                />{" "}
                Google
              </Button>
            </form>
            <form
              action={async () => {
                "use server";
                await signIn("github", {
                  redirectTo: "/",
                });
              }}
              className="w-full"
            >
              <Button className="w-full" type="submit">
                <Image
                  src="/google.svg"
                  width={30}
                  height={30}
                  className="w-5 h-5 mr-3"
                  alt=""
                />{" "}
                Github
              </Button>
            </form>
            {/* <Button>Github</Button> */}
          </div>
        </CardContent>
        <CardFooter>
          <CardDescription>More options will be added soon!</CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
