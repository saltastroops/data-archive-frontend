import { mount, shallow } from "enzyme";
import * as React from "react";
import ObservationResults from "../../../../components/searchFormComponents/results/Observation";
import { IObservation } from "../../../../utils/ObservationQueryParameters";
const addAll = jest.fn();
const removeAll = jest.fn();
describe("Observation results table row", () => {
  it("should render", () => {
    expect(
      mount(
        <ObservationResults
          cart={[]}
          observation={{ files: [] } as any}
          addAll={addAll}
          removeAll={removeAll}
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
        addAll={addAll}
        removeAll={removeAll}
      />
    );
    expect(wrapper.find("tr").length).toEqual(1);
  });

  it("should have a button to add all if there is an observation", () => {
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
        addAll={addAll}
        removeAll={removeAll}
      />
    );

    expect(wrapper.find("button").length).toEqual(1);
  });
  it("should have a button to add all and a button to remove all if cart has file from this observation", () => {
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
        addAll={addAll}
        removeAll={removeAll}
      />
    );

    expect(wrapper.find("button").length).toEqual(1);
  });
});
