import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import styled from "styled-components";
import { ICartFile } from "../../util/Cart";

interface ICartFileRowProps {
  file: ICartFile;
  id: string;
  index: number;
  obzIndex: number;
  remove: (
    e: React.MouseEvent,
    removeFromCart: () => void,
    file: ICartFile[]
  ) => void;
  removeFromCart: () => void;
}

const TableRow = styled.tr<{ even: boolean }>`
  background-color: ${props => (props.even ? "white" : "whitesmoke")};
`;

const CartFileRow = (props: ICartFileRowProps) => {
  const { file, remove, removeFromCart, obzIndex, index } = props;
  return (
    <TableRow even={obzIndex % 2 === 0}>
      <td>{index === 0 && file.observation.name}</td>
      <td>
        <button
          className={"button is-danger"}
          onClick={e => remove(e, removeFromCart, [file])}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </td>
      <td>{file.name}</td>
      <td>{file.target}</td>
    </TableRow>
  );
};
export default CartFileRow;
