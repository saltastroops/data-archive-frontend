import { generalWhereConstraints } from "../util/observationQueryInput";

describe("generalWhereConstraint", () => {
  const useInvalidObservationNightFormat = () => {
    generalWhereConstraints({ errors: {}, observationNight: "invaliddate" });
  };

  const useInvalidObservationNight = () => {
    generalWhereConstraints({ errors: {}, observationNight: "2019-02-29" });
  };

  it("should map an observation night to a greater than and less than constraint spanning one night", () => {
    expect(
      generalWhereConstraints({ errors: {}, observationNight: "2019-02-17" })
    ).toMatchSnapshot();
  });

  it("should raise an error for an invalid observation night format", () => {
    expect(useInvalidObservationNightFormat).toThrow(/invaliddate.*valid/);
  });

  it("should raise an error for an invalid observation night", () => {
    expect(useInvalidObservationNight).toThrow(/2019-02-29.*valid/);
  });

  it("should map a Principal Investigator to a contains constraint", () => {
    expect(
      generalWhereConstraints({ errors: {}, principalInvestigator: "Doe" })
    ).toMatchSnapshot();
  });

  it("should map a proposal code to a contains constraint", () => {
    expect(
      generalWhereConstraints({ errors: {}, proposalCode: "2-SCI" })
    ).toMatchSnapshot();
  });

  it("should map input data correctly", () => {
    expect(
      generalWhereConstraints({
        errors: {},
        observationNight: "2019-05-13",
        principalInvestigator: "Sipho",
        proposalCode: "2019-1-SCI-042"
      })
    ).toMatchSnapshot();
  });
});

describe("parseTargetPosition", () => {});
