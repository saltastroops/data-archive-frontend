import * as React from "react";
import { LargeCheckbox } from "../../basicComponents/LargeCheckbox";

interface ISearchRow {
  name?: string; // Name of the data item
  targetName?: string;
  dataType?: string;
  isRedused?: boolean;
  filename?: string;
  rightAscension?: string;
  declination?: string;
  observationNight?: string;
  category?: string; // what king of data it is galaxy, star, binary star, etc.
  telescope: string;
  instrument: string;
  proposalCode?: string;
}
interface IFiles {
  files: ISearchRow;
  key: string;
  addFile: (e: React.ChangeEvent<HTMLInputElement>) => void; //  TODO: Method to add this row or content to cart
}

const SearchRow = (props: IFiles) => {
  const {
    isRedused,
    filename,
    name,
    dataType,
    targetName,
    rightAscension,
    declination,
    observationNight,
    category,
    telescope,
    instrument,
    proposalCode
  } = props.files;
  console.log(name);
  return (
    <tr key={name}>
      <td>
        <LargeCheckbox onChange={props.addFile} />
      </td>
      <td>{filename}</td>
      <td>{name}</td>
      <td>{dataType}</td>
      <td>{isRedused ? "Redused" : "Raw"}</td>
      <td>{targetName}</td>
      <td>{rightAscension}</td>
      <td>{declination}</td>
      <td>{observationNight}</td>
      <td>{category}</td>
      <td>{telescope}</td>
      <td>{instrument}</td>
      <td>{proposalCode}</td>
    </tr>
  );
};
export default SearchRow;
