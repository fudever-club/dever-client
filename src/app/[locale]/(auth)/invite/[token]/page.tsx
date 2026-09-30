import { Metadata } from "next";

import InviteAcceptModule from "@/components/modules/InviteAccept";

export const metadata: Metadata = {
  title: "Nhận lời mời | FU-DEVER",
};

function InviteAcceptPage() {
  return <InviteAcceptModule />;
}

export default InviteAcceptPage;
