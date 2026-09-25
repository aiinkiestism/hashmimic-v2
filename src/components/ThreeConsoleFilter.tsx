"use client";

import { setConsoleFunction } from "three";

// three r183 deprecated THREE.Clock in favour of THREE.Timer, and its
// constructor now warns on every instantiation. @react-three/fiber 9 builds a
// THREE.Clock for `state.clock` on every <Canvas>, so the warning floods the
// console — and Next's "[browser]" dev-terminal forwarder — on each mount and
// route change. Instead of monkey-patching `console` (which fights Next's
// forwarder and can be bypassed by a captured reference), we route three's own
// logs through its official `setConsoleFunction` hook and drop just this one
// message, forwarding everything else untouched. The message three passes here
// already carries the "THREE." prefix, so match on the stable tail. Runs at
// client module load, before any <Canvas> constructs its Clock.
const SILENCED = "Clock: This module has been deprecated";

setConsoleFunction((method: string, message: unknown, ...params: unknown[]) => {
  if (typeof message === "string" && message.includes(SILENCED)) return;
  const fn = (console as unknown as Record<string, unknown>)[method];
  (typeof fn === "function" ? (fn as (...a: unknown[]) => void) : console.log).call(
    console,
    message,
    ...params,
  );
});

// Renders nothing; mounted once at the root purely to pull this module (and its
// setup side effect) into the client bundle.
export function ThreeConsoleFilter() {
  return null;
}
