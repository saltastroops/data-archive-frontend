import * as React from "react";
import { IFile, IObservation } from "../../../utils/ObservationQueryParameters";
import { Span } from "../../basicComponents/Grids";
import { LargeCheckbox } from "../../basicComponents/LargeCheckbox";

interface IObservationResults {
  cart: any;
  observation: IObservation;
  addAllFiles: (
    e: React.ChangeEvent<HTMLInputElement>,
    observation: IObservation
  ) => void;
}

const ObservationResults = (props: IObservationResults) => {
  const { observation, addAllFiles, cart } = props;

  return (
    <tr className="is-selected span">
      <td>
        <label>
          <Span>
            <LargeCheckbox
              id={`Add-all-${observation.id}`}
              checked={observation.files.every(
                (item: IFile) => cart.indexOf(item) >= 0
              )}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                addAllFiles(e, observation)
              }
            />
          </Span>
          <Span className={"span"}> Add all</Span>
        </label>
      </td>
      <td colSpan={3}>
        <Span>Observation: {observation.name}</Span>
      </td>
      <td colSpan={2}>
        <Span>Telescope: {observation.telescope}</Span>
      </td>
      <td colSpan={2}>
        <Span>Proposal: {observation.proposal}</Span>
      </td>
      <td colSpan={2}>
        <Span>Stat time: {observation.startTime}</Span>
      </td>
    </tr>
  );
};
export default ObservationResults;
