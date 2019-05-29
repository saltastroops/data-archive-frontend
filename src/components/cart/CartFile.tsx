import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { ICartFile } from "../../util/Cart";

interface ICartFileX {
  file: ICartFile;
  id: string;
  index: number;
  remove: (
    e: React.MouseEvent,
    removeFromCart: () => void,
    file: ICartFile[]
  ) => void;
  removeFromCart: () => void;
}

const CartFile = (props: ICartFileX) => {
  const { file, remove, removeFromCart, index } = props;
  return (
    <>
      {index !== 0 && <td className="fixed-header-rest" />}
      <td className="fixed-header-button">
        <button
          className={"button is-danger"}
          onClick={e => remove(e, removeFromCart, [file])}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </td>
      <td className="fixed-header-rest">{file.name}</td>
      <td className="fixed-header-rest">{"HD 36987"}</td>
    </>
  );
};
export default CartFile;
