export function fakeSearchResults(n: number) {
  const results = [];
  for (let i = 1; i <= n; i++) {
    results.push(
      {
        files: [
          {
            id: `file-1-${i}`,
            category: "cat-5",
            dataType: "string",
            declination: "string",
            filename: "string",
            instrument: "string",
            isReduced: true,
            name: `name-1-${i}`,
            observationNight: "string",
            proposalCode: "string",
            rightAscension: "string",
            targetName: "string",
            telescope: "string",
            url: "./image0.jpg"
          }
        ],
        id: `obs1-${i}`,
        name: `obs1-${i}`,
        proposal: "2018-SCI-098",
        startTime: "2018-02-02 17:55:23",
        telescope: "SALT"
      },
      {
        files: [
          {
            id: `file-2-${i}`,
            category: "cat-1",
            dataType: "string",
            declination: "string",
            filename: "string",
            instrument: "string",
            isReduced: true,
            name: "name-2",
            observationId: `obsid1-${i}`,
            rightAscension: "string",
            targetName: "string",
            telescope: "string"
          },
          {
            id: `file-3-${i}`,
            category: "cat-2",
            dataType: "string",
            declination: "string",
            filename: "string",
            instrument: "string",
            isReduced: true,
            name: "name-4",
            observationId: `obsid1-${i}`,
            rightAscension: "string",
            targetName: "string",
            telescope: "string",
            url: "./image0.jpg"
          },
          {
            id: `file-4-${i}`,
            category: "cat-3",
            dataType: "string",
            declination: "string",
            filename: "string",
            instrument: "string",
            isReduced: true,
            name: "name-5",
            observationId: `obsid1-${i}`,
            rightAscension: "string",
            targetName: "string",
            telescope: "string",
            url: "./image4.jpg"
          }
        ],
        id: `obs2-${i}`,
        name: `obs2-${i}`,
        proposal: "2017-MLT-006",
        startTime: "2018-02-02 17:55:23",
        telescope: "SALT"
      },
      {
        files: [
          {
            id: `file-5-${i}`,
            category: "cat-4",
            dataType: "string",
            declination: "string",
            filename: "string",
            instrument: "string",
            isReduced: true,
            name: `name-3-${i}`,
            observationId: `obsid2-${i}`,
            rightAscension: "string",
            targetName: "string",
            telescope: "string"
          }
        ],
        id: `obs3-${i}`,
        name: `obs3-${i}`,
        proposal: "MLT-RSA-053",
        startTime: "2018-02-02 17:55:23",
        telescope: "Lesedi"
      }
    );
  }

  return results;
}
