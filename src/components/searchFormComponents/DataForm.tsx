import * as React from "react";
import styled from "styled-components";
import { IGeneral } from "../../utils/ObservationQueryParameters";
import { MainGrid, Span, SubGrid, SubGrid4 } from "../basicComponents/Grids";
import SelectField from "../basicComponents/SelectField";

const LargeCheckbox = styled.input.attrs({
  className: "checkbox",
  type: "checkbox"
})`
  && {
    width: 18px;
    height: 18px;
  }
`;

class DataForm extends React.Component<
  { data: IGeneral; onChange: (value: IGeneral) => void },
  any
> {
  /*
  event type need to be 'any' because React.FormEvent<HTMLInputElement> types does not have 'target.checked' property
  */
  changeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    // fooling type scripts
    const name = e.currentTarget.name;
    const value = e.target.checked;
    this.props.onChange({
      ...this.props.data,
      [name]: value
    });
  };
  changeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // fooling type scripts
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;

    this.props.onChange({
      ...this.props.data,
      [name]: value
    });
  };
  render() {
    const { arcs, biases, flats, standards, dataType } = this.props.data;
    return (
      <>
        <MainGrid>
          <SubGrid>
            <p>Reduce/raw</p>
            <SelectField
              options={["any", "reduced", "raw"]}
              name={"dataType"}
              onChange={this.changeSelect}
              value={dataType}
            />
          </SubGrid>
        </MainGrid>
        <MainGrid>
          <SubGrid>
            <h5 className={"title is-5"}>Include:</h5>
          </SubGrid>
        </MainGrid>
        <SubGrid4>
          <label>
            <Span>
              <LargeCheckbox
                checked={arcs || false}
                onChange={this.changeCheckbox}
                name={"arcs"}
              />
            </Span>
            <Span>Arcs</Span>
          </label>
          <label>
            <Span>
              <LargeCheckbox
                checked={biases || false}
                onChange={this.changeCheckbox}
                name={"biases"}
              />
            </Span>
            <Span>Biases</Span>
          </label>
          <label>
            <Span>
              <LargeCheckbox
                checked={flats || false}
                onChange={this.changeCheckbox}
                name={"flats"}
              />
            </Span>
            <Span>Flats</Span>
          </label>
          <label>
            <Span>
              <LargeCheckbox
                checked={standards || false}
                onChange={this.changeCheckbox}
                name={"standards"}
              />
            </Span>
            <Span>Standards</Span>
          </label>
        </SubGrid4>
      </>
    );
  }
}
export default DataForm;
