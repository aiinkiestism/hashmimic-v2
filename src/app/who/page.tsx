'use client'

import { AppBg, MainText3Ds } from "@/components";
import { Fragment } from "react";

export default function Who() {
  return (
    <AppBg>
      <MainText3Ds.who.Title />
      {MainText3Ds.who.Descriptions.map((description, i) => (
        <Fragment key={i}>
          {description()}
        </Fragment>
      ))}
      {/* links */}
    </AppBg>
  )
}