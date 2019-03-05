import * as React from "react";

interface IObservationResults {
  id: string; // unique key
  name?: string; // Name of the data item
  startTime?: string; // obs start date
  telescope?: string; // telescope name
  proposal?: string; // proposal name/code if any

  addAll?: (e: React.MouseEvent<HTMLButtonElement>) => void; //  TODO: Method to add all files belonging to this observation
}

const ObservationResults = (props: IObservationResults) => {
  const { id, name, startTime, telescope, proposal, addAll } = props;
  return (
    <tr className="is-selected" key={`${id}+value`}>
      <td colSpan={3}>{name}</td>
      <td colSpan={2}>{proposal}</td>
      <td colSpan={2}>{telescope}</td>
      <td colSpan={2}>{startTime}</td>
      <td />
      <td>
        <button className={"button is-info"} onClick={addAll}>
          add all
        </button>
      </td>
    </tr>
  );
};
export default ObservationResults;
