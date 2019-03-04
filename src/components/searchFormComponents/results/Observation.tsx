import * as React from "react";
import { LargeCheckbox } from "../../basicComponents/LargeCheckbox";

interface IObservationResults {
  observationName?: string; // Name of the data item

  addAll?: (e: React.FormEvent<HTMLInputElement>) => void; //  TODO: Metho to add all files belonging to this observation
}

const ObservationResults = (props: IObservationResults) => {
  const { observationName, addAll } = props;
  return (
    <tbody>
      <tr className="is-selected" key={observationName}>
        <td colSpan={13}>{observationName}</td>
        <td>
          <input type="submit" onClick={addAll} value="add all" />
        </td>
      </tr>
    </tbody>
  );
};
export default ObservationResults;
