import * as React from "react";
import { IFile } from "../../../utils/ObservationQueryParameters";
import { LargeCheckbox } from "../../basicComponents/LargeCheckbox";

interface IRow {
  openModal: any;
  files: IFile;
}

const checked = (id: string, cart: any) => {
  return true;
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
  const { openModal } = props;
  return (
    <tr key={`${name}-row-123`}>
      <td>
        <LargeCheckbox
          checked={checked(name, {}) as boolean}
          onChange={e => () => {}}
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
