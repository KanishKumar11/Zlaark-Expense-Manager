import React, { Suspense } from "react";
import ResetPassword from "./_components/PasswordReset";

function page() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
}

export default page;
