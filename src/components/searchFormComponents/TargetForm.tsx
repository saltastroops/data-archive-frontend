import * as React from "react";
import targetPosition from "target-position";
import { ITarget } from "../../utils/ObservationQueryParameters";
import {
  validateDeclination,
  validateName,
  validateRightAscension,
  validateSearchConeRadius
} from "../../utils/validators";
import { InnerMainGrid, MainGrid, SubGrid } from "../basicComponents/Grids";
import InputField from "../basicComponents/InputField";
import SelectField from "../basicComponents/SelectField";

class TargetForm extends React.Component<
  { target: ITarget; onChange: any },
  any
> {
  state = { loading: false };
  stateSet = (loading: boolean) => {
    this.setState(() => ({
      loading
    }));
  };
  resolve = async () => {
    const { target, onChange } = this.props;
    this.stateSet(true);
    const resolver = target.resolver || "Simbad";
    onChange({
      ...target
    });

    try {
      const p = await targetPosition(target.name || "", [resolver]);
      if (p) {
        onChange({
          ...target,
          declination: `${p.declination}`,
          rightAscension: `${p.rightAscension}`
        });
      } else {
        onChange({
          ...target,
          declination: ``,
          errors: {
            ...target.errors,
            name: `Target ${target.name} Could not be resolved.`
          },
          rightAscension: ``
        });
      }
    } catch (err) {
      onChange({
        ...target,
        errors: {
          ...target.errors,
          name: err.message
        }
      });
    }
    this.stateSet(false);
  };
  render() {
    const { target, onChange } = this.props;
    const { loading } = this.state;
    const targetChange = (
      e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
      const name = e.target.name;
      const value = e.target.value || "";
      onChange({
        ...target,
        [name]: value,
        errors: {
          ...target.errors,
          [name]: ""
        }
      });
    };
    return (
      <>
        <MainGrid>
          <SubGrid>
            <p>Target name</p>
            <InputField
              className="target-name-input"
              disabled={loading}
              name={"name"}
              value={target.name || ""}
              error={target.errors.name || ""}
              onChange={targetChange}
            />
          </SubGrid>
          <SubGrid>
            <InnerMainGrid>
              <SubGrid>
                <p>Resolver</p>
                <SelectField
                  className={"resolver-select"}
                  options={["Simbad", "NED", "VizieR"]}
                  name={"resolver"}
                  value={target.resolver || "Simbad"}
                  onChange={targetChange}
                />
              </SubGrid>
              <SubGrid>
                <br />
                <button
                  className={`button is-info ${loading &&
                    "is-loading disable"}`}
                  type="button"
                  onClick={this.resolve}
                  title={`${loading ? "Loading." : ""}`}
                  disabled={loading}
                >
                  resolve
                </button>
              </SubGrid>
            </InnerMainGrid>
          </SubGrid>
        </MainGrid>

        <MainGrid>
          <SubGrid>
            <p>Right ascension</p>
            <InputField
              className="right-ascension-input"
              disabled={loading}
              name={"rightAscension"}
              value={target.rightAscension || ""}
              onChange={targetChange}
              error={target.errors.rightAscension}
            />
          </SubGrid>
          <SubGrid>
            <p>Declination</p>
            <InputField
              className="declination-input"
              disabled={loading}
              name={"declination"}
              value={target.declination || ""}
              onChange={targetChange}
              error={target.errors.declination}
            />
          </SubGrid>
        </MainGrid>
        <MainGrid>
          <SubGrid>
            <p>Search radius</p>
            <InputField
              className="search-cone-radius-input"
              name={"searchConeRadius"}
              value={target.searchConeRadius || ""}
              onChange={targetChange}
              error={target.errors.searchConeRadius}
            />
          </SubGrid>
          <SubGrid>
            <p>Radius units</p>
            <SelectField
              className={"radius-units-select"}
              options={["Arcseconds", "arc minutes", "degrees"]}
              name={"radiusUnits"}
              onChange={targetChange}
              value={target.searchConeRadiusUnits}
            />
          </SubGrid>
        </MainGrid>
      </>
    );
  }
}

/**
 */
export const validatedTarget = async (target: ITarget) => {
  let raDecChangeError;
  if (target.name && target.name !== "") {
    raDecChangeError = await targetPosition(target.name, [
      target.resolver || "Simbad"
    ])
      .then(p => {
        if (p) {
          return {
            declination:
              `${p.declination}` !== target.declination
                ? `Target name is given and resolves to different value with ${target.resolver ||
                    "Simbad"} `
                : "",
            rightAscension:
              `${p.rightAscension}` !== target.rightAscension
                ? `Target name is given and resolves to different value with ${target.resolver ||
                    "Simbad"} `
                : ""
          };
        }
      })
      .catch();
  }
  return {
    ...target,
    errors: {
      declination:
        raDecChangeError && raDecChangeError.declination
          ? raDecChangeError.declination
          : validateDeclination(target.declination || ""),
      name: validateName(),
      rightAscension:
        raDecChangeError && raDecChangeError.rightAscension
          ? raDecChangeError.rightAscension
          : validateRightAscension(target.rightAscension || ""),
      searchConeRadius: validateSearchConeRadius(target.searchConeRadius || "")
    }
  };
};
export default TargetForm;
