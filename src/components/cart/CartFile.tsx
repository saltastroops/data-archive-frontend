import * as React from "react";

interface ICartFile {
  file: any;
  id: string;
  index: number;
  observation: any;
}

const CartFile = (props: ICartFile) => {
  const { file, index, observation } = props;
  return (
    <tr>
      {observation.files[0] === file && (
        <td rowSpan={observation.files.length}>{observation.id}</td>
      )}
      <td>
        <button className={"button is-danger"}>
          <i className={"fa fa-trash"} />
        </button>
      </td>
      <td>{file.filename}</td>
      <td>{file.name}</td>
      <td>{file.rightAscension}</td>
      <td>{file.declination}</td>
      <td>{file.targetName}</td>
    </tr>
  );
};
export default CartFile;
