import * as React from "react";
import styled from "styled-components";
import {
  CalibrationType,
  IGeneral
} from "../../utils/ObservationQueryParameters";
import { MainGrid, Span, SubGrid, SubGrid4 } from "../basicComponents/Grids";
import SelectField, { AnyOption } from "../basicComponents/SelectField";

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
    const name = e.target.name as CalibrationType;

    const updated = new Set<CalibrationType>(this.props.general.calibrations);
    if (e.target.checked) {
      updated.add(name);
    } else {
      updated.delete(name);
    }
    this.props.onChange({
      ...this.props.general,
      calibrations: updated
    });
  };

  render() {
    const { calibrations } = this.props.general;
    return (
      <>
        <MainGrid>
          <SubGrid>
            <h5 className={"title is-5"}>Include:</h5>
          </SubGrid>
        </MainGrid>
        <SubGrid4>
          <label>
            <Span>
              <LargeCheckbox
                id="arcs-checkbox"
                checked={calibrations.has("arc")}
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
                onChange={this.changeCheckbox}
                name="standard"
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
