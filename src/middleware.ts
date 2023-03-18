export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/',
    /*
     * Match all request paths except for the ones starting with:
     */
    '/((?!api|admin|auth/signin|_next/static|_next/image|favicon.ico).*)'
  ]
};
