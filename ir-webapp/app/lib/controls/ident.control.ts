
export type Ident = {
  type: "symbol" | "insider";
  meta: ObjectHash | null;
  name: "";
};

type IdentResponse = {
  keyword: string;
  idents: Ident[];
}

export const get = (keyword: string): Promise<IdentResponse> => {
  return fetch(`/api/ident?keyword=${keyword}`).then((res) => res.json());
};
