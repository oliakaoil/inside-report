import ContactDb, { IContact } from "../models/contact.model";

export const add = async ({
  name,
  email,
  message,
  formName,
}: IContact): Promise<IContact | null> => {
  try {
    const result = await ContactDb.create({
      name,
      email,
      formName,
      message,
      last_modified: Date.now(),
    });

    return result as IContact;
  } catch (err) {
    console.error(err);
    return null;
  }
};
