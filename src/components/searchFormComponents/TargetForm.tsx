import * as React from "react";
import targetPosition from "target-position";
import { ITarget } from "../../utils/ObservationQueryParameters";
import {
  isFloat,
  validateDec,
  validateName,
  validateRa
} from "../../utils/validators";
import { InnerMainGrid, MainGrid, SubGrid } from "../basicComponents/Grids";
import InputField from "../basicComponents/InputField";
import SelectField from "../basicComponents/SelectField";

class TargetForm extends React.Component<
  { target: ITarget; onChange: any },
  any
> {
  resolve = () => {
    const { target, onChange } = this.props;
    const resolver = target.resolver || "Simbad";

    targetPosition(target.name || "", [resolver])
      .then(p => {
        if (p) {
          onChange({
            ...target,
            declination: `${p.declination}`,
            rightAscension: `${p.rightAscension}`
          });
        } else {
          onChange({
            ...target,
            errors: {
              ...target.errors,
              name: `The target name ${target.name} could not be resolved.`
            }
          });
        }
      })
      .catch(err => {
        onChange({
          ...target,
          errors: {
            ...target.errors,
            name: err.message
          }
        });
      });
  };
  render() {
    const { target, onChange } = this.props;
    const targetChange = (
      e: React.FormEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
      const name = e.currentTarget.name;
      const value = e.currentTarget.value;
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
                  options={["Simbad", "NED", "VizieR"]}
                  name={"resolver"}
                  value={target.resolver || "Simbad"}
                  onChange={targetChange}
                />
              </SubGrid>
              <SubGrid>
                <br />
                <input
                  className="button is-info"
                  type="button"
                  value="resolve"
                  onClick={this.resolve}
                />
              </SubGrid>
            </InnerMainGrid>
          </SubGrid>
        </MainGrid>

        <MainGrid>
          <SubGrid>
            <p>Right ascension</p>
            <InputField
              name={"rightAscension"}
              value={target.rightAscension || ""}
              onChange={targetChange}
              error={target.errors.rightAscension}
            />
          </SubGrid>
          <SubGrid>
            <p>Declination</p>
            <InputField
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
              name={"searchConeRadius"}
              value={target.searchConeRadius || ""}
              onChange={targetChange}
              error={target.errors.searchConeRadius}
            />
          </SubGrid>
          <SubGrid>
            <p>Radius units</p>
            <SelectField
              options={["Arcseconds", "Arcminutes", "Degrees"]}
              name={"radiusUnits"}
              onChange={targetChange}
              value={target.searchConeRadiusUnits || "Arcseconds"}
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
                ? `The declination differs from that returned by ${
                    target.resolver
                  } for ${target.name}.`
                : "",
            rightAscension:
              `${p.rightAscension}` !== target.rightAscension
                ? `The right ascension differs from that returned by ${
                    target.resolver
                  } for ${target.name}.`
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
          : validateDec(target.declination || ""),
      name: validateName(target.name || ""),
      rightAscension:
        raDecChangeError && raDecChangeError.rightAscension
          ? raDecChangeError.rightAscension
          : validateRa(target.rightAscension || ""),
      searchConeRadius: isFloat(target.searchConeRadius || "")
        ? ""
        : "The search radius must be a positive number."
    }
  };
};
export default TargetForm;
