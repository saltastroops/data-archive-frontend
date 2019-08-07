import * as React from "react";
import styled from "styled-components";
import {
  CalibrationType,
  IGeneral
} from "../../utils/ObservationQueryParameters";
import { MainGrid, Span, SubGrid, SubGrid5 } from "../basicComponents/Grids";

const LargeCheckbox = styled.input.attrs({
  className: "checkbox",
  type: "checkbox"
})`
  && {
    width: 18px;
    height: 18px;
  }
`;

interface IDataFormProps {
  general: IGeneral;
  onChange: (value: any) => void;
}

/**
 * A form for choosing what data to include in an observation search.
 */
class DataForm extends React.Component<IDataFormProps, {}> {
  // Add or remove the calibration type corresponding to the clicked checkbox
  changeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as any;
    let { science } = this.props.general;
    const updated = new Set<CalibrationType>(this.props.general.calibrations);
    if (e.target.checked) {
      if (name === "science") {
        science = "Science";
      } else {
        updated.add(name);
      }
    } else {
      if (name === "science") {
        science = "";
      } else {
        updated.delete(name);
      }
    }
    this.props.onChange({
      ...this.props.general,
      calibrations: updated,
      science
    });
  };

  render() {
    const { calibrations, science } = this.props.general;
    return (
      <>
        <MainGrid>
          <SubGrid>
            <h5 className={"title is-5"}>Include:</h5>
          </SubGrid>
        </MainGrid>
        <SubGrid5>
          <label>
            <Span>
              <LargeCheckbox
                id="science-checkbox"
                checked={science ? true : false}
                data-test="science-checkbox"
                onChange={this.changeCheckbox}
                name="science"
              />
            </Span>
            <Span>Science</Span>
          </label>
          <label>
            <Span>
              <LargeCheckbox
                id="arcs-checkbox"
                checked={calibrations.has("arc")}
                data-test="arcs-checkbox"
                onChange={this.changeCheckbox}
                name="arc"
              />
            </Span>
            <Span>Arcs</Span>
          </label>
          <label>
            <Span>
              <LargeCheckbox
                id="biases-checkbox"
                checked={calibrations.has("bias")}
                data-test="biases-checkbox"
                onChange={this.changeCheckbox}
                name="bias"
              />
            </Span>
            <Span>Biases</Span>
          </label>
          <label>
            <Span>
              <LargeCheckbox
                id="flats-checkbox"
                checked={calibrations.has("flat")}
                data-test="flats-checkbox"
                onChange={this.changeCheckbox}
                name="flat"
              />
            </Span>
            <Span>Flats</Span>
          </label>
          <label>
            <Span>
              <LargeCheckbox
                id="standards-checkbox"
                checked={calibrations.has("standard")}
                data-test="standards-checkbox"
                onChange={this.changeCheckbox}
                name="standard"
              />
            </Span>
            <Span>Standards</Span>
          </label>
        </SubGrid5>
      </>
    );
  }
}
export default DataForm;
