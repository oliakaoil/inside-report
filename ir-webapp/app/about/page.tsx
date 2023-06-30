import { FC } from "react";
import Link from "next/link";
import PageHeader from "../components/page-header";
import PageContainer from "app/components/page-container";

interface Props {}

const Page: FC<Props> = () => {
  return (
    <PageContainer>
      <PageHeader title="About"></PageHeader>
      <div className="mb-10">
        The SEC requires all insiders to report purchases and sales of their
        company's securities by filing SEC Form 4. We track the filing of these
        forms <i>up to the minute</i> and make them easy to search, sort and
        filter. <Link href="/alerts">Alerts</Link> and{" "}
        <Link href="/downloads">Downloads</Link> are coming soon!
      </div>

      <PageHeader title="SEC and Insider Reporting"></PageHeader>
      <div>
        The SEC require certain individuals (such as officers, directors, and
        those that hold more than 10% of any class of a company’s securities) to
        report purchases, sales, and holdings of their company's securities by
        filing forms 3, 4, and 5.
        <br />
        <br />
        In most cases, when an insider executes a transaction, he or she must
        file a Form 4. This form includes the amount purchased or sold and the
        price per share. Form 4 must be filed within two business days following
        the transaction date. Transactions in a company's common stock as well
        as derivative securities, such as options, warrants, and convertible
        securities, are reported on the form. Each transaction is coded to
        indicate the nature of the transaction.
        <br />
        <br />
        <span className="font-bold">Investopedia Article</span>
        <br />
        <a
          href="https://www.investopedia.com/terms/f/form4.asp"
          target="_blank"
          className="text-sm md:text-base"
        >
          https://www.investopedia.com/terms/f/form4.asp
        </a>
        <br />
        <br />
        <span className="font-bold">SEC Investor Bulletin:</span>
        <br />
        <a
          href="https://www.sec.gov/files/forms-3-4-5.pdf"
          target="_blank"
          className="text-sm md:text-base"
        >
          https://www.sec.gov/files/forms-3-4-5.pdf
        </a>
        <br />
        <br />
        <span className="font-bold">SEC Form 4</span>
        <br />
        <a
          href="https://www.sec.gov/files/form4.pdf"
          target="_blank"
          className="text-sm md:text-base"
        >
          https://www.sec.gov/files/form4.pdf
        </a>
      </div>
    </PageContainer>
  );
};

export default Page;
