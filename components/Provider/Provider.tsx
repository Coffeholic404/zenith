"use client";
import React, { FC, PropsWithChildren, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/app/loading";

const ProviderAuth = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const { status, data } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status]);

  // Handle refresh token error - sign out user
  useEffect(() => {
    if (data?.error === "RefreshAccessTokenError") {
      signOut({ redirect: true, callbackUrl: "/login" });
    }
  }, [data?.error]);

  if (status === "loading") return <Loader />;
  else return <>{children}</>;
};

export default ProviderAuth;

// type WithProps = {
//   hasAccess?: boolean;
// }

// export const withRole = <P extends object>(WrappedComponent: FC<P>, isComponent: boolean = false, claim: Claims | Claims[]): FC<P & WithProps> => {
//   return (props: P) => {
//     const { status, data } = useSession();
//     const claims =  data?.user.claims;
//     // Check if the user has the necessary role to access the resource
//     let hasAccessUser = false
//     if (data?.user.roles == "admin") {
//       hasAccessUser = true
//     } else {
//       if (Array.isArray(claim)) {
//         // If 'claim' is an array, check if any of those claims are included in the user's claims
//         hasAccessUser = claim.some(c => claims?.includes(c));
//       } else {
//         // If 'claim' is a single claim, check if it's included in the user's claims
//         hasAccessUser = claims?.includes(claim) ?? false;
//       }
//     }

//     if (status === 'loading') return <Loader />;
//     if (hasAccessUser || isComponent) {
//       return <WrappedComponent {...props} hasAccess={hasAccessUser} />;
//     }

//     return <div className='grid place-content-center w-full h-screen'>Not Found Page</div>;
//   };
// };

// type RoleBasedComponentProps = {
//   claim: Claims | Claims[];
//   component: React.ComponentType<any>;
// };

// const withDisabled = (Component: React.ComponentType<any>) => {
//   // implementation of withDisabled
//   return (props: any) => <Component {...props} disabled />;
// };

// export const RoleBasedComponent: React.FC<RoleBasedComponentProps> = ({ claim, component }) => {
//   const session = useSession();
//   const claims = session.data?.user.claims;

//   let hasClaims: boolean;

//   if (session.data?.user.roles == "admin") {
//     hasClaims = true
//   } else {

//     if (Array.isArray(claim)) {
//       // If 'claim' is an array, check if any of those claims are included in the user's claims
//       hasClaims = claim.some(c => claims?.includes(c));
//     } else {
//       // If 'claim' is a single claim, check if it's included in the user's claims
//       hasClaims = claims?.includes(claim) ?? false;
//     }
//   }

//   // component to render
//   const Component = component;

//   // if user does not have the required claim(s), render the disabled version of the component
//   if (!hasClaims) {
//     const DisabledComponent = withDisabled(Component);
//     return <DisabledComponent />;
//   }

//   // Render the enabled component if the user has the required claim(s)
//   return <Component />;
// };
