import { mount, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import ObservationResults from "../../../../components/searchFormComponents/results/Observation";
import { IObservation } from "../../../../utils/ObservationQueryParameters";
const addAllFiles = jest.fn();
describe("Observation results table row", () => {
  it("should render", () => {
    expect(
      mount(
        <ObservationResults
          cart={[]}
          observation={{ files: [] } as any}
          addAllFiles={addAllFiles}
        />
      )
    ).toBeDefined();
  });
  it("should always display a row if observation is given", () => {
    const observation: IObservation = {
      files: [],
      id: "Obs-ID-xxx",
      name: "observation",
      proposal: "P-CODE-XXX",
      startTime: "2019-10-10 23:00:12",
      telescope: "SALT"
    };
    const wrapper = shallow(
      <ObservationResults
        cart={[]}
        observation={observation}
        addAllFiles={addAllFiles}
      />
    );
    expect(wrapper.find("tr").length).toEqual(1);
  });
  it("should have a checkbox to add all files if there is an observation", () => {
    const observation: IObservation = {
      files: [
        {
          category: "some info",
          dataType: "some info",
          declination: "some info",
          filename: "name-XXX",
          instrument: "some info",
          isReduced: true,
          name: "some info",
          observationId: "some info",
          observationNight: "some info",
          rightAscension: "some info",
          targetName: "some info",
          telescope: "some info",
          url: "some info"
        }
      ],
      id: "Obs-ID-xxx",
      name: "observation",
      proposal: "P-CODE-XXX",
      startTime: "2019-10-10 23:00:12",
      telescope: "SALT"
    };
    const cart = [
      {
        category: "some info",
        dataType: "some info",
        declination: "some info",
        filename: "name-XXX",
        instrument: "some info",
        isReduced: true,
        name: "some info",
        observationId: "some info",
        observationNight: "some info",
        rightAscension: "some info",
        targetName: "some info",
        telescope: "some info",
        url: "some info"
      }
    ];
    const wrapper = mount(
      <ObservationResults
        cart={cart}
        observation={observation}
        addAllFiles={addAllFiles}
      />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
