import * as React from "react";
import { IFile, IObservation } from "../../../utils/ObservationQueryParameters";

interface IObservationResults {
  cart: any;
  observation: IObservation;
  addAll: (e: React.MouseEvent<HTMLElement>, observation: IObservation) => void;
  removeAll: (
    e: React.MouseEvent<HTMLElement>,
    observation: IObservation
  ) => void;
}

const ObservationResults = (props: IObservationResults) => {
  const { observation, addAll, removeAll, cart } = props;

  return (
    <tr className="is-selected" key={`${observation.id}+value`}>
      <td colSpan={3}>{observation.name}</td>
      <td colSpan={2}>{observation.proposal}</td>
      <td colSpan={2}>{observation.telescope}</td>
      <td>{observation.startTime}</td>
      <td />
      {// show add all if not all the files are in the cart from this observation else show remove all
      !observation.files.every((item: IFile) => cart.indexOf(item) >= 0) ? (
        <>
          <td>
            <button
              name="addAll"
              className={"button is-info"}
              onClick={e => addAll(e, observation)}
            >
              add all
            </button>
          </td>
          {// show remove all if some of the files from this observation are on the cart
          observation.files.some((item: IFile) => cart.indexOf(item) >= 0) ? (
            <td>
              <button
                name="addAll"
                className={"button is-danger"}
                onClick={e => removeAll(e, observation)}
              >
                remove all
              </button>
            </td>
          ) : (
            <td colSpan={1} />
          )}
        </>
      ) : (
        <>
          <td colSpan={1} />
          <td>
            <button
              name="addAll"
              className={"button is-danger"}
              onClick={e => removeAll(e, observation)}
            >
              remove all
            </button>
          </td>
        </>
      )}
    </tr>
  );
};
export default ObservationResults;
