import * as React from "react";

interface IObservation {
  id: string;
  files: any[];
}

const CartObservation = (props: IObservation) => {
  const { id, files } = props;
  return (
    <td rowSpan={files.length + 1}>
      {id} <br />
      <a className={"button is-danger"}>
        <span>
          {" "}
          <i className={"fas fa-trash"} /> remove
        </span>
      </a>
    </td>
  );
};
export default CartObservation;
