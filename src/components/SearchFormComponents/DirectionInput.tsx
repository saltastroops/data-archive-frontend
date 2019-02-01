import { ChangeEvent } from "react";
import * as React from "react";
import styled from "styled-components";
import DAInput from "../basicComponents/DAInput";

interface IInput {
  name: string;
}

const DirectionInputDiv = styled.div.attrs({
  className: "tile is-parent is-vertical"
})`
  min-width: 50%;
  width: 50%;
`;

class DirectionInput extends React.Component<IInput> {
  state = {
    text: ""
  };
  handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    e.preventDefault();
    e.persist();

    this.setState(
      () =>
        ({
          [e.target.name]: e.target.value
        } as any)
    );
    console.log(this.state);
  };
  directionChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    e.persist();

    this.setState(
      () =>
        ({
          [e.target.name]: e.target.value
        } as any)
    );
  };
  public render() {
    const { name } = this.props;
    const { text } = this.state;
    return (
      <DirectionInputDiv>
        <DAInput
          name={"hello"}
          value={text}
          label={"this is it"}
          onChange={this.handleChange}
        />
        <div className={"is-child"}>{name}</div>
        <div className={"is-child"}>
          <input
            type="number"
            name="text"
            onChange={(e: any) => this.handleChange(e)}
            value={text}
          />
          {name === "latitude" ? (
            <select name={"latitudeDirection"} onChange={this.directionChange}>
              <option>N</option>
              <option>S</option>
            </select>
          ) : name === "longitude" ? (
            <select name={"longitudeDirection"} onChange={this.directionChange}>
              <option>W</option>
              <option>E</option>
            </select>
          ) : (
            <select name={"radius"} onChange={this.directionChange}>
              <option>arc seconds</option>
              <option>degrees</option>
            </select>
          )}
        </div>
      </DirectionInputDiv>
    );
  }
}

export default DirectionInput;
