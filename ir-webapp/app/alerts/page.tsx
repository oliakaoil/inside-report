import { FC } from "react";
import ContactForm from "app/components/forms/contact";
import PageHeader from "../components/page-header";
import PageContainer from "app/components/page-container";

interface Props {}

const Page: FC<Props> = () => {
  return (
    <PageContainer>
      <PageHeader title="Alerts"></PageHeader>
      <div className="mb-10">
        Interested in receiving a real-time notification when SEC Form 4 filings
        match your filter criteria? Please enter your contact info below and we
        will ping you when this feature is available.
      </div>

      <div className="mb-10">
        <ContactForm
          formName="alerts-feature-request"
          successMessage="Thanks for reaching out. We will let you know as soon as this feature is available."
        />
      </div>
    </PageContainer>
  );
};

export default Page;
