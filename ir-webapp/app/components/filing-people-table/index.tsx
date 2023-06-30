"use client";

import { FilingPerson } from "app/lib/controls/filing.control";
import { capitalize, startCase } from "lodash";
import { FC } from "react";
import AppCard from "../app-card";
import pluralize from "pluralize";

interface Props {
  people: FilingPerson[];
}

interface HeaderProps {
  label: string;
  width?: number;
  align?: string;
  className?: string;
}

const Header: FC<HeaderProps> = ({
  label,
  width = 2,
  align = "left",
  className = "",
}) => {
  return (
    <div
      className={`font-bold capitalize w-${width}/12 text-${align} ${className} text-sm md:text-base`}
    >
      {label}
    </div>
  );
};

interface RowProps {
  person: FilingPerson;
}

const Row: FC<RowProps> = ({ person }) => {
  const { name, relationship, buys, sells } = person;

  let actions: string[] = [];
  if (buys) {
    actions.push(`${buys} ` + pluralize("buy", buys));
  }
  if (sells) {
    actions.push(`${sells} ` + pluralize("sell", sells));
  }

  return (
    <AppCard>
      <div className="w-5/12 text-sm md:text-base">
        <a href={`/filings?keyword=name:${name}`}>
          {startCase(String(name).toLowerCase())}
        </a>
      </div>
      <div className="w-1/12 text-sm md:text-base">&nbsp;</div>
      <div className="w-4/12 text-sm md:text-base">
        {capitalize(relationship)}
      </div>
      <div className="w-2/12 text-sm md:text-base">{actions.join(", ")}</div>
    </AppCard>
  );
};

type HeaderConfig = {
  id: string;
  label: string;
  width?: number;
  align?: string;
  className?: string;
};

const headers: HeaderConfig[] = [
  { id: "name", label: "Name", width: 5 },
  { id: "spacer", label: "", width: 1 },
  { id: "relationship", label: "Relationship", width: 4 },
  { id: "action", label: "Action", width: 2 },
];

const FilingPeopleTable: FC<Props> = ({ people }) => {
  return (
    <div>
      <div className="flex mb-2 px-3">
        {headers.map(({ id, label, width, align, className }) => (
          <Header
            label={label}
            key={id}
            width={width}
            align={align}
            className={className}
          />
        ))}
      </div>
      <div>
        {people.map((person) => {
          return <Row person={person} key={person.name} />;
        })}
      </div>
    </div>
  );
};

export default FilingPeopleTable;
