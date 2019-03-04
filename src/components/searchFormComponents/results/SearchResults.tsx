import * as React from "react";
import { ISearchResults } from "../../../utils/ObservationQueryParameters";
import ObservationResults from "./Observation";
import TableHead from "./TableHead";
import SearchRow from "./SearchRow";

class SearchResults extends React.Component<{ searchResults: any }, any> {
  addAll(observation: any) {
    console.log("Adding all......");
  }
  addFile(observation: any) {
    console.log("Adding file......");
  }
  public render() {
    const { searchResults } = this.props;
    return (
      <table className={"table"}>
        {searchResults.map((r: any) => {
          return (
            <>
              {
                <ObservationResults
                  observationName={r.name}
                  addAll={this.addAll}
                />
              }
              <tbody>
                <TableHead />
                {r.files.map((f: any) => {
                  return (
                    <SearchRow key={f.name} files={f} addFile={this.addFile} />
                  );
                })}
              </tbody>
            </>
          );
        })}
      </table>
    );
  }
}

export default SearchResults;
