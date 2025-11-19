"use client";

import VerifyAccountComp from "@/components/VerifyAccountComp";
import { Suspense } from "react";
import React from "react";

export default function VerifyAccount() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyAccountComp />
    </Suspense>
  );
}
