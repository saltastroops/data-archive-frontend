import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { ICartFile } from "../../util/Cart";
import styled from "styled-components";

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
      <td className="fixed-header-rest">
        {index === 0 && file.observation.name}
      </td>
      <td className="fixed-header-button">
        <button
          className={"button is-danger"}
          onClick={e => remove(e, removeFromCart, [file])}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </td>
      <td className="fixed-header-rest">{file.name}</td>
      <td className="fixed-header-rest">{file.target}</td>
    </TableRow>
  );
};
export default CartFileRow;
