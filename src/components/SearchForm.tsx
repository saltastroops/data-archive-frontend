import * as React from "react";
import {
  DataGrid,
  ParentGrid,
  ProposalGrid,
  TargetGrid,
  TelescopeGrid
} from "./basicComponents/Grids";
import { updateState, validateQuery } from "./basicComponents/util";
import DataSearchForm from "./SearchFormComponents/DataSearchForm";
import ProposalSearchForm from "./SearchFormComponents/ProposalSearchForm";
import TargetSearchForm from "./SearchFormComponents/TargetSearchForm";
import TelescopeSearchForm from "./SearchFormComponents/TelescopeSearchForm";

class SearchForm extends React.Component {
  public onChange = (
    e: React.FormEvent<HTMLSelectElement> | React.FormEvent<HTMLInputElement>
  ) => {
    // e.preventDefault();
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    const newState = updateState(this.state, name, value);
    this.setState(() => newState);
  };

  public SearchArchive = () => {
    const newState = validateQuery(this.state);
    this.setState(() => newState);
  };
  state = {
    data: {
      arcs: false,
      biases: false,
      dataType: ["any", "reduced", "raw"],
      flats: false,
      selectedDataType: "any",
      standards: false
    },
    proposal: {
      obsDate: {
        error: "",
        onChange: this.onChange,
        value: ""
      },
      pi: {
        error: "",
        name: "",
        onChange: this.onChange
      },
      proposalCode: {
        code: "",
        error: "",
        onChange: this.onChange
      },
      proposalTitle: {
        error: "",
        onChange: this.onChange,
        title: ""
      }
    },
    target: {
      dec: {
        error: "",
        onChange: this.onChange,
        value: ""
      },
      ra: {
        error: "",
        onChange: this.onChange,
        value: ""
      },
      radius: {
        error: "",
        onChange: this.onChange,
        value: ""
      },
      radiusUnits: {
        error: "",
        onChange: this.onChange,
        value: ""
      },
      resolver: {
        error: "",
        onChange: this.onChange,
        value: ""
      },
      targetName: {
        error: "",
        name: "",
        onChange: this.onChange
      }
    },
    telescope: {
      otherInstruments: ["any", "Hippo", "SHOC", "SpupMic"],
      saltInstruments: ["any", "HRS", "RSS", "BVIT", "SALTICAM"],
      selectedInstrument: "any",
      selectedTelescope: "any",
      telescopes: ["any", "SALT", "Lesedi", "1.9 inch"]
    }
  };

  public render() {
    const { target, proposal, telescope, data } = this.state;
    const instruments =
      telescope.selectedTelescope === "SALT"
        ? telescope.saltInstruments
        : telescope.otherInstruments;
    console.log(this.state);
    return (
      <>
        <ParentGrid>
          <TargetGrid>
            <TargetSearchForm
              targetName={target.targetName}
              ra={target.ra}
              dec={target.dec}
              radius={target.radius}
              radiusUnits={target.radiusUnits}
              resolver={target.resolver}
            />
          </TargetGrid>
          <ProposalGrid>
            <ProposalSearchForm
              proposalCode={proposal.proposalCode}
              proposalTitle={proposal.proposalTitle}
              pi={proposal.pi}
              obsDate={proposal.obsDate}
            />
          </ProposalGrid>
          <TelescopeGrid>
            <TelescopeSearchForm
              telescopes={telescope.telescopes}
              instruments={instruments}
              selectedInstrument={telescope.selectedInstrument}
              selectedTelescope={telescope.selectedTelescope}
              onChange={this.onChange}
            />
          </TelescopeGrid>
          <DataGrid>
            <DataSearchForm
              dataTypes={data.dataType}
              selectedDataType={data.selectedDataType}
              arcs={data.arcs}
              biases={data.biases}
              flats={data.flats}
              standards={data.standards}
              onChange={this.onChange}
            />
          </DataGrid>
        </ParentGrid>
        <input
          className="button is-primary"
          type="button"
          value="search"
          onClick={this.SearchArchive}
        />
      </>
    );
  }
}

export default SearchForm;
