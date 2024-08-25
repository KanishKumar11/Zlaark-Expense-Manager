import React, { Suspense } from "react";
import Verify from "./_components/Verify";

function page() {
  return (
    <Suspense>
      <Verify />
    </Suspense>
  );
}

export default page;
