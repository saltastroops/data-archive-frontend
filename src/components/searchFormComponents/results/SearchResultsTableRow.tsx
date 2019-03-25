import * as React from "react";
import { IFile } from "../../../utils/ObservationQueryParameters";
import { LargeCheckbox } from "../../basicComponents/LargeCheckbox";

interface IRow {
  cart: any;
  openModal: any;
  files: IFile;
  addFile: (e: React.ChangeEvent<HTMLInputElement>, file: IFile) => void; //  TODO: Method to add this row or content to cart
}

const checked = (name: string, cart: any) => {
  return cart.some((item: IFile) => item.name === name);
};

const SearchResultsTableRow = (props: IRow) => {
  const {
    isReduced,
    filename,
    name,
    dataType,
    targetName,
    rightAscension,
    declination,
    observationNight,
    category,
    instrument,
    url
  } = props.files;
  const { cart, openModal } = props;
  return (
    <tr key={`${name}-row-123`}>
      <td>
        <LargeCheckbox
          checked={checked(name, cart) as boolean}
          onChange={e => props.addFile(e, props.files)}
        />
      </td>
      {!url ? (
        <td>{filename}</td>
      ) : (
        <td>
          <a onClick={e => openModal(url)}>{filename}</a>
        </td>
      )}

      <td>{name}</td>
      <td>{dataType}</td>
      <td>{isReduced ? "Redused" : "Raw"}</td>
      <td>{targetName}</td>
      <td>{rightAscension}</td>
      <td>{declination}</td>
      <td>{category}</td>
      <td>{instrument}</td>
    </tr>
  );
};
export default SearchResultsTableRow;
