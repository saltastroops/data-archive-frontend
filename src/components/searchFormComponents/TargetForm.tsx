import * as React from "react";
import targetPosition from "target-position";
import { ITarget } from "../../utils/ObservationQueryParameters";
import { TargetType } from "../../utils/TargetType";
import {
  validateDeclination,
  validateName,
  validateRightAscension,
  validateSearchConeRadius
} from "../../utils/validators";
import {
  InnerMainGrid,
  MainGrid,
  SingleColumnGrid,
  SubGrid
} from "../basicComponents/Grids";
import InputField from "../basicComponents/InputField";
import SelectField from "../basicComponents/SelectField";
import TargetTypesSelector from "./TargetTypesSelector";

interface ITargetFormProps {
  target: ITarget;
  onChange: (value: ITarget) => any;
}

interface ITargetFormState {
  loading: boolean;
}

/**
 * A form for providing target-related search parameters for an observation
 * search.
 */
class TargetForm extends React.Component<ITargetFormProps, ITargetFormState> {
  state = { loading: false };

  // Function for updating the loading property of the state
  updateLoadingStatus = (loading: boolean) => {
    this.setState(() => ({
      loading
    }));
  };

  // Function for resolving the target name to a position
  resolve = async () => {
    const { target, onChange } = this.props;
    this.updateLoadingStatus(true);
    const resolver = target.resolver;
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
            name: `Target ${target.name} could not be resolved.`
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
    this.updateLoadingStatus(false);
  };

  render() {
    const { target, onChange } = this.props;
    const { loading } = this.state;

    // Function for handling changes made to the search parameters
    const handleChangeEvent = (
      e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
      const name = e.target.name;
      const value = e.target.value || "";
      targetChange(name, value);
    };

    // Function for handling target type changes
    const handleTargetTypeChange = (targetTypes: Set<TargetType>) => {
      targetChange("targetTypes", targetTypes);
    };

    const targetChange = (property: string, value: any) => {
      onChange({
        ...target,
        [property]: value,
        errors: {
          ...target.errors,
          [property]: ""
        }
      });
    };

    // TODO: Replace class names with data-test
    return (
      <>
        <MainGrid>
          <SubGrid>
            <p>Target name</p>
            <InputField
              data-test="target-name-input"
              disabled={loading}
              name={"name"}
              value={target.name || ""}
              error={target.errors.name}
              onChange={handleChangeEvent}
            />
          </SubGrid>
          <SubGrid>
            <InnerMainGrid>
              <SubGrid>
                <p>Resolver</p>
                <SelectField
                  data-test={"resolver-select"}
                  name={"resolver"}
                  value={target.resolver}
                  onChange={handleChangeEvent}
                >
                  <option value="Simbad">Simbad</option>
                  <option value="NED">NED</option>
                  <option value="VizieR">VizieR</option>
                </SelectField>
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
              data-test="right-ascension-input"
              disabled={loading}
              name={"rightAscension"}
              value={target.rightAscension || ""}
              onChange={handleChangeEvent}
              error={target.errors.rightAscension}
            />
          </SubGrid>
          <SubGrid>
            <p>Declination</p>
            <InputField
              data-test="declination-input"
              disabled={loading}
              name={"declination"}
              value={target.declination || ""}
              onChange={handleChangeEvent}
              error={target.errors.declination}
            />
          </SubGrid>
        </MainGrid>
        <MainGrid>
          <SubGrid>
            <p>Search radius</p>
            <InputField
              data-test="search-cone-radius-input"
              name={"searchConeRadius"}
              value={target.searchConeRadius || ""}
              onChange={handleChangeEvent}
              error={target.errors.searchConeRadius}
            />
          </SubGrid>
          <SubGrid>
            <p>Radius units</p>
            <SelectField
              data-test="radius-units-select"
              name={"radiusUnits"}
              onChange={handleChangeEvent}
              value={target.searchConeRadiusUnits}
            >
              <option value="arcseconds">Arcseconds</option>
              <option value="arcminutes">Arcminutes</option>
              <option value="degrees">Degrees</option>
            </SelectField>
          </SubGrid>
        </MainGrid>

        <SingleColumnGrid>
          <SubGrid>
            <p>Target type</p>
            <TargetTypesSelector
              onChange={handleTargetTypeChange}
              targetTypes={target.targetTypes}
            />
          </SubGrid>
        </SingleColumnGrid>
      </>
    );
  }
}

/**
 * Validate the given target-related search parameters and, if need be, add
 * error messages to them.
 */
export const validatedTarget = async (target: ITarget) => {
  // Check that the target name and any given coordinates are consistent
  let raDecChangeError;
  if (target.name && target.name !== "") {
    raDecChangeError = await targetPosition(target.name, [target.resolver])
      .then(position => {
        if (position) {
          return {
            declination:
              `${position.declination}` !== target.declination
                ? `The given target name resolves to a different declination with ${
                    target.resolver
                  }.`
                : "",
            rightAscension:
              `${position.rightAscension}` !== target.rightAscension
                ? `The given target name resolves to a different right ascension with ${
                    target.resolver
                  }.`
                : ""
          };
        }
      })
      .catch();
  }

  let targetNameError = "";
  if (target.name) {
    targetNameError = (await targetPosition(target.name, [target.resolver]))
      ? ""
      : `Target "${target.name}" Could not be resolved.`;
  }
  // Return the search parameters with the errors found
  return {
    ...target,
    errors: {
      ...target.errors,
      declination:
        raDecChangeError && raDecChangeError.declination
          ? raDecChangeError.declination
          : validateDeclination(target.declination || ""),
      name: targetNameError,
      rightAscension:
        raDecChangeError && raDecChangeError.rightAscension
          ? raDecChangeError.rightAscension
          : validateRightAscension(target.rightAscension || ""),
      searchConeRadius: validateSearchConeRadius(target.searchConeRadius || "")
    }
  };
};

export default TargetForm;
