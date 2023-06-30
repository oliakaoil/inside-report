import { FC } from "react";

interface Props {
  label: string;
}

const AppChip: FC<Props> = ({ label }) => {
  return (
    <div
      style={{ backgroundColor: "#8990F9", borderColor: "#5f64b1" }}
      className="inline-block p-1 rounded border text-sm app-chip"
    >
      {label}
    </div>
  );
};

export default AppChip;
