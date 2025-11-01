import React from "react";
import { ClusterContainer, ClusterItem, PageContainer } from "./index";

export default function Page() {
  return (
    <PageContainer>
      <ClusterContainer>
        <ClusterItem linkHref="/wa-status/notes" />
        <ClusterItem linkHref="/wa-status/notes" />
      </ClusterContainer>
    </PageContainer>
  );
}
