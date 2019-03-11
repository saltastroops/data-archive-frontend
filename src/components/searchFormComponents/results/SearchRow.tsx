import * as React from "react";
import { LargeCheckbox } from "../../basicComponents/LargeCheckbox";

interface ISearchRow {
  name?: string; // Name of the data item
  targetName?: string;
  dataType?: string;
  isReduced?: boolean;
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
  cart: any;
  files: ISearchRow;
  addFile: (e: React.ChangeEvent<HTMLInputElement>, file: any) => void; //  TODO: Method to add this row or content to cart
}

const checked = (name: any, cart: any) => {
  return cart.some((item: any) => item.name === name);
};

const SearchRow = (props: IFiles) => {
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
    instrument
  } = props.files;
  const { cart } = props;
  return (
    <tr key={`${name}-row-123`}>
      <td>
        <LargeCheckbox
          checked={checked(name, cart) as boolean}
          onChange={e => props.addFile(e, props.files as any)}
        />
      </td>
      <td>{filename}</td>
      <td>{name}</td>
      <td>{dataType}</td>
      <td>{isReduced ? "Redused" : "Raw"}</td>
      <td>{targetName}</td>
      <td>{rightAscension}</td>
      <td>{declination}</td>
      <td>{observationNight}</td>
      <td>{category}</td>
      <td>{instrument}</td>
    </tr>
  );
};
export default SearchRow;
