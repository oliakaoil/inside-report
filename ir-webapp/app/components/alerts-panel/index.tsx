/** @format */

"use client";

import { LoadState } from "app/lib/helpers";
import React, { FC, useState } from "react";
import Panel from "../panel";
import ContactForm from "app/components/forms/contact";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AlertsPanel: FC<Props> = ({ isOpen, onClose }) => {
  const [loadState, setLoadState] = useState<LoadState>("unloaded");

  const loaded = loadState === "loaded";

  return (
    <Panel isOpen={isOpen} onClose={onClose} header="Filing Alerts" size={350}>
      <div>
        <div className="mb-10">
          Alerts are not yet available. Please enter your email below and we
          will ping you when this feature is online.
        </div>

        <div className="mb-10">
          <ContactForm
            formName="alerts-feature-request"
            successMessage="Thanks for reaching out. We will let you know as soon as alerts are available."
          />
        </div>
      </div>
    </Panel>
  );
};

export default AlertsPanel;
