import { Metadata } from "next";

import SignUpModule from "@/components/modules/SignUp";

export const metadata: Metadata = {
  title: "Quyền truy cập thành viên | FU-DEVER",
};

function SignUpPage() {
  return <SignUpModule />;
}

export default SignUpPage;
