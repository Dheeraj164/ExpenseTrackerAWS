"use client";

import NewPasswordComp from "@/components/NewPsswordComp";
import { Suspense } from "react";
import React from "react";

export default function NewpasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPasswordComp />
    </Suspense>
  );
}
