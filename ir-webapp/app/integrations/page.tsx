import { FC } from "react";
import ContactForm from "app/components/forms/contact";
import PageHeader from "app/components/page-header";
import PageContainer from "app/components/page-container";

interface Props {}

const Page: FC<Props> = () => {
  return (
    <PageContainer>
      <PageHeader title="Integrations"></PageHeader>
      <div className="mb-10">
        Interested in receiving Web Hooks, using a REST API, or integrating with
        our data feed in another way? Please enter your contact info below and
        we will ping you when this feature is available.
      </div>

      <div className="mb-10">
        <ContactForm
          formName="integrations-feature-request"
          successMessage="Thanks for reaching out. We will let you know as soon as this feature is available."
        />
      </div>
    </PageContainer>
  );
};

export default Page;
