import { FC } from "react";
import HelpForm from "app/components/forms/help";
import PageHeader from "../components/page-header";
import PageContainer from "app/components/page-container";

interface Props {}

const Page: FC<Props> = () => {
  return (
    <PageContainer>
      <PageHeader title="Help and Feedback"></PageHeader>
      <div className="mb-10">
        All feedback is very welcome. Please let us know if you have any issues
        using the site. We are currently in beta.
      </div>

      <div className="mb-10">
        <HelpForm />
      </div>
    </PageContainer>
  );
};

export default Page;
