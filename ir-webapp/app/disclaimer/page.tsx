import { FC } from "react";
import PageContainer from "app/components/page-container";
import PageHeader from "app/components/page-header";

interface Props {}

const Page: FC<Props> = () => {
  return (
    <PageContainer>
      <PageHeader title="Disclaimer" />
      <div>
        {" "}
        Data is provided &quot;as is&quot; without any representations or
        warranties, express or implied.
        <br />
        <br />
        All content is for informational purposes only, you should not construe
        any such information or other material as legal, tax, investment,
        financial, or other advice.
        <br />
        <br />
        Not affiliated with the SEC or EDGAR System.
        <br />
        <br />
        <a href="https://ecfr.io/Title-17/" target="_blank">
          SEC CFR Title 17 of the Code of Federal Regulations
        </a>
        <br />
      </div>
    </PageContainer>
  );
};

export default Page;
