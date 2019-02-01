import * as React from "react";
import DirectionInput from "./DirectionInput";

class Direction extends React.Component {
  public render() {
    return (
      <div className={"tile is-ancestor"}>
        <div className={"tile is-vertical"}>
          <div className={"tile is-parent is-vertical"}>
            <label className={"is-child"}>Unit type</label>
            <select className={"is-child"}>
              <option>deg</option>
              <option>hms</option>
              <option>dms</option>
              <option>dds</option>
            </select>
          </div>
          <div className={"tile is-parent"}>
            <DirectionInput name={"latitude"} />
            <DirectionInput name={"longitude"} />
          </div>
          <DirectionInput name={"radius"} />
        </div>
      </div>
    );
  }
}

export default Direction;
