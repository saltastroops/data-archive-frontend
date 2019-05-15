import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { ICartFile } from "../../util/Cart";

interface ICartFileX {
  file: ICartFile;
  id: string;
  index: number;
  observation: any;
  remove: (
    e: React.MouseEvent,
    removeFromCart: () => void,
    file: ICartFile
  ) => void;
  removeFromCart: () => void;
}

const CartFile = (props: ICartFileX) => {
  const { file, observation, remove, removeFromCart } = props;
  const firstFile: any = Array.from(observation.files)[0];
  return (
    <>
      {firstFile.id === file.id ? (
        <td className="fixed-header-rest">{observation.id}</td>
      ) : (
        <td className="fixed-header-rest" />
      )}
      <td className="fixed-header-button">
        <button
          className={"button is-danger"}
          onClick={e => remove(e, removeFromCart, file)}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </td>
      <td className="fixed-header-rest">{file.name}</td>
      <td className="fixed-header-rest">{file.targetName || ""}</td>
    </>
  );
};
export default CartFile;
