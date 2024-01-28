'use client'

import { MainText3Ds } from "@/components";
import { Fragment } from "react";

export default function Who() {
  return (
    <>
      <MainText3Ds.who.Title />
      {MainText3Ds.who.Descriptions.map((description, i) => (
        <Fragment key={i}>
          {description()}
        </Fragment>
      ))}
      {/* links */}
    </>
  )
}