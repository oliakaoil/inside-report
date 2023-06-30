import { FC } from "react";
import PageHeader from "app/components/page-header";
import ContactForm from "app/components/forms/contact";
import PageContainer from "app/components/page-container";

interface Props {}

const Page: FC<Props> = () => {
  return (
    <PageContainer>
      <PageHeader title="Downloads"></PageHeader>
      <div className="mb-10">
        Interested in downloading a list of SEC Form 4 filings in CSV or XLS
        format? Please enter your contact info below and we will ping you when
        this feature is available.
      </div>

      <div className="mb-10">
        <ContactForm
          formName="download-feature-request"
          successMessage="Thanks for reaching out. We will let you know as soon as this feature is available."
        />
      </div>
    </PageContainer>
  );
};

export default Page;
