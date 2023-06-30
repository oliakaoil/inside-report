/** @format */

"use client";

import { FC, useState } from "react";
import TextInput from "app/components/form/text-input";
import Button from "app/components/button";
import { LoadState, post } from "app/lib/helpers";
import { toast } from "app/components/toast";
import FormContainerPage from "app/components/form/form-container-page";

interface Props {}

interface FormState {
  name: string;
  email: string;
  message: string;
  formName: string;
}

const ZeroState: FormState = {
  name: "",
  email: "",
  message: "",
  formName: "help-feedback",
};

const Form: FC<Props> = () => {
  const [loadState, setLoadState] = useState<LoadState>("loaded");
  const [formState, setFormState] = useState<FormState>({ ...ZeroState });

  const handleReset = () => {
    setFormState({ ...ZeroState });
    setLoadState("loaded");
  };

  const handleChange = (field: string, value: string) => {
    setFormState({ ...formState, [field]: value });
  };

  const handleSubmit = () => {
    const { name, email, message } = formState;
    if (!name || !email || !message) {
      return;
    }

    setLoadState("loading");

    post("/api/contact", formState)
      .then(() => {
        handleReset();
        toast("Thanks for your message. We will respond shortly.");
      })
      .catch((err) => {
        console.error(err);
        toast("Your message was NOT sent. Please try again in a few moments.");
        setLoadState("loaded");
      });
  };

  const { name, email, message } = formState;
  const canSubmit = Boolean(name) && Boolean(email) && Boolean(message);

  return (
    <FormContainerPage>
      <div className="mb-4">
        <div className="font-bold mb-2">Name</div>
        <TextInput
          className="w-full md:w-1/2"
          onChange={(value: string) => handleChange("name", value)}
          defaultValue={formState.name}
        />
      </div>

      <div className="mb-4">
        <div className="font-bold mb-2">E-mail address</div>
        <TextInput
          className="w-full md:w-1/2"
          onChange={(value: string) => handleChange("email", value)}
          defaultValue={formState.email}
        />
      </div>

      <div className="mb-4">
        <div className="font-bold mb-2">Message</div>
        <TextInput
          className="w-full md:w-1/2 h-28"
          onChange={(value: string) => handleChange("message", value)}
          defaultValue={formState.message}
          textarea
        />
      </div>

      <div className="mb-6">
        <Button
          disabled={!canSubmit}
          label="Submit"
          onClick={handleSubmit}
          dots={loadState === "loading"}
        />
      </div>

      <div>
        <span className="font-bold">Note:</span> We will never share your info
        with a third party.
      </div>
    </FormContainerPage>
  );
};

export default Form;
