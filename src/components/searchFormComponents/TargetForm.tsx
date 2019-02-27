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
    this.updateLoadingStatus(false);
  };

  render() {
    const { target, onChange } = this.props;
    const { loading } = this.state;

    // Function for handling changes made to the search parameters
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

    // TODO: Replace class names with data-test
    return (
      <>
        <MainGrid>
          <SubGrid>
            <p>Target name</p>
            <InputField
              data-test="target-name-input"
              className="target-name-input"
              disabled={loading}
              name={"name"}
              value={target.name || ""}
              error={target.errors.name}
              onChange={targetChange}
            />
          </SubGrid>
          <SubGrid>
            <InnerMainGrid>
              <SubGrid>
                <p>Resolver</p>
                <SelectField
                  data-test={"resolver-select"}
                  className={"resolver-select"}
                  name={"resolver"}
                  value={target.resolver}
                  onChange={targetChange}
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
              value={target.rightAscension}
              onChange={targetChange}
              error={target.errors.rightAscension}
            />
          </SubGrid>
          <SubGrid>
            <p>Declination</p>
            <InputField
              data-test="declination-input"
              disabled={loading}
              name={"declination"}
              value={target.declination}
              onChange={targetChange}
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
              value={target.searchConeRadius}
              onChange={targetChange}
              error={target.errors.searchConeRadius}
            />
          </SubGrid>
          <SubGrid>
            <p>Radius units</p>
            <SelectField
              data-test="radius-units-select"
              name={"radiusUnits"}
              onChange={targetChange}
              value={target.searchConeRadiusUnits}
            >
              <option value="arcseconds">Arcseconds</option>
              <option value="arcminutes">Arcminutes</option>
              <option value="degrees">Degrees</option>
            </SelectField>
          </SubGrid>
        </MainGrid>
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
  // TODO: Don't enforce exact equality for floats.
  // TODO: No "Simbad" default.
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

  // Return the search parameters with the errors found
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
