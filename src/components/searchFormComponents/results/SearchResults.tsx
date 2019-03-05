import * as React from "react";
import ObservationResults from "./Observation";
import SearchRow from "./SearchRow";
import TableHead from "./TableHead";

class SearchResults extends React.Component<{ searchResults: any }, any> {
  addAll(observation: any) {
    console.log("Adding all......");
    // TODO: add an observation to the cart
  }
  addFile(file: any) {
    console.log("Adding file......");
    // TODO: add a file to the cart
  }
  public render() {
    const { searchResults } = this.props;
    return (
      <table className={"table"}>
        <tbody>
          <tr className="notification">
            <th colSpan={3}>Name</th>
            <th colSpan={2}>Proposal</th>
            <th colSpan={2}>Telescope</th>
            <th colSpan={2}>Start time</th>
            <td />
            <td />
          </tr>
          {searchResults.map((r: any) => {
            return (
              <>
                {
                  <ObservationResults
                    name={r.name}
                    id={r.id}
                    startTime={r.startTime}
                    telescope={r.telescope}
                    proposal={r.proposal}
                    addAll={this.addAll}
                  />
                }

                <TableHead />
                {r.files.map((f: any) => {
                  return (
                    <SearchRow key={f.name} files={f} addFile={this.addFile} />
                  );
                })}
              </>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default SearchResults;
