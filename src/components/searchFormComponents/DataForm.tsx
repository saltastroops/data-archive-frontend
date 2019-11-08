import * as React from "react";
import styled from "styled-components";
import { IGeneral, ProductType } from "../../utils/ObservationQueryParameters";
import {
  SingleColumnGrid,
  Span,
  SubGrid,
  SubGrid5
} from "../basicComponents/Grids";

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
    let { rejected } = this.props.general;
    const updated = new Set<ProductType>(this.props.general.productTypes);
    if (e.target.checked) {
      if (name === "rejected") {
        rejected = true;
      } else {
        updated.add(name);
      }
    } else {
      if (name === "rejected") {
        rejected = false;
      } else {
        updated.delete(name);
      }
    }
    this.props.onChange({
      ...this.props.general,
      productTypes: updated,
      rejected
    });
  };

  render() {
    const { productTypes, rejected } = this.props.general;
    return (
      <>
        <SingleColumnGrid>
          <SubGrid>
            <h5 className={"title is-5"}>Data category</h5>
          </SubGrid>
        </SingleColumnGrid>
        <SingleColumnGrid>
          <SubGrid5>
            <label>
              <Span>
                <LargeCheckbox
                  id="science-checkbox"
                  checked={productTypes.has("Science")}
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
                  checked={productTypes.has("Arc")}
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
                  checked={productTypes.has("Bias")}
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
                  checked={productTypes.has("Flat")}
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
                  checked={productTypes.has("Standard")}
                  data-test="standards-checkbox"
                  onChange={this.changeCheckbox}
                  name="standard"
                />
              </Span>
              <Span>Standards</Span>
            </label>
          </SubGrid5>
        </SingleColumnGrid>

        <SingleColumnGrid>
          <SubGrid>
            <h5 className={"title is-5"}>Data status</h5>
          </SubGrid>
        </SingleColumnGrid>
        <SingleColumnGrid>
          <SubGrid>
            <label>
              <Span>
                <LargeCheckbox
                  id="rejected-checkbox"
                  checked={rejected}
                  data-test="rejected-checkbox"
                  onChange={this.changeCheckbox}
                  name="rejected"
                />
              </Span>
              <Span>Rejected</Span>
            </label>
          </SubGrid>
        </SingleColumnGrid>
      </>
    );
  }
}
export default DataForm;
