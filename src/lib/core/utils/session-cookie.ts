// Signed-in test for the browser. `connect.sid` is httpOnly and so never appears in
// document.cookie — gating on it renders signed-in visitors as guests. The sibling
// `me` cookie carries the same claims unsigned and is written and cleared alongside it.
// Anchored on a cookie boundary because a bare 'me=' also matches 'theme='.
//
// Kept import-free in its own file: the $lib/core/utils barrel re-exports the core
// package, which pulls in $app/navigation and cannot be loaded under vitest.
export const hasSessionCookie = (cookie: string) => /(^|;)\s*me=[^;]/.test(cookie)
