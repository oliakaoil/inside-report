/** @format */

"use client";

import { FC, useEffect, useState } from "react";
import TextInput from "app/components/form/text-input";
import Button from "app/components/button";
import { LoadState, post } from "app/lib/helpers";
import { toast } from "app/components/toast";
import FormContainerPage from "app/components/form/form-container-page";
import useDetectAutocomplete from "app/lib/hooks/use-detect-autocomplete";

interface Props {
  formName: string;
  successMessage?: string;
}

interface FormState {
  key: number;
  name: string;
  email: string;
  formName: string;
}

const ZeroState: FormState = {
  key: 0,
  name: "",
  email: "",
  formName: "",
};

const Form: FC<Props> = ({ formName, successMessage = "" }) => {
  const [loadState, setLoadState] = useState<LoadState>("loaded");
  const [formState, setFormState] = useState<FormState>({
    ...ZeroState,
    formName,
  });

  const acEvent = useDetectAutocomplete();

  useEffect(() => {
    acEvent?.preventDefault();
  }, [acEvent]);

  const handleReset = () => {
    setFormState({
      ...ZeroState,
      formName,
      key: formState.key + 1,
    });
    setLoadState("loaded");
  };

  const handleChange = (field: string, value: string) => {
    setFormState({ ...formState, [field]: value });
  };

  const handleSubmit = () => {
    const { name, email } = formState;
    if (!name || !email) {
      return;
    }

    setLoadState("loading");

    post("/api/contact", formState)
      .then(() => {
        handleReset();
        toast(
          successMessage || "Your message was sent. Thanks for reaching out."
        );
      })
      .catch((err) => {
        console.error(err);
        toast("Your message was NOT sent. Please try again in a few moments.");
        setLoadState("loaded");
      });
  };

  const { key } = formState;

  return (
    <FormContainerPage>
      <div className="mb-4">
        <div className="font-bold mb-2">Name</div>
        <TextInput
          key={`fk-${key}`}
          className="w-[250px]"
          onChange={(value: string) => handleChange("name", value)}
          defaultValue={formState.name}
        />
      </div>

      <div className="mb-4">
        <div className="font-bold mb-2">E-mail address</div>
        <TextInput
          key={`fk-${key}`}
          className="w-[250px]"
          onChange={(value: string) => handleChange("email", value)}
          defaultValue={formState.email}
        />
      </div>

      <div className="mb-6">
        <Button
          label="Submit"
          onClick={handleSubmit}
          dots={loadState === "loading"}
        />
      </div>

      <div className="text-sm mt-3">
        <span className="font-bold">Note:</span> We will{" "}
        <span className="font-bold">never</span> share your info with a third
        party.
      </div>
    </FormContainerPage>
  );
};

export default Form;
