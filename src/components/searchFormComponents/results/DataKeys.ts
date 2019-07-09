/**
 * Constants for data keys used in the search results table.
 *
 * In general these will be column names from the observations database.
 */
const DataKeys = {
  CART: "cart",
  DECLINATION: "Target.declination",
  FILENAME: "DataFile.dataFileName",
  HRS_ID: "HRS.hrsId",
  HRS_OBSERVATION_MODE: "HRS.observationMode",
  INSTRUMENT: "Instrument.instrumentName",
  OBSERVATION_ID: "Observation.observationId",
  OBSERVATION_NAME: "observationName",
  OBSERVATION_NIGHT: "Observation.night",
  OBSERVATION_PUBLIC_FROM: "Observation.publicFrom",
  PREVIEW_IMAGE_URL: "url",
  PROPOSAL_CODE: "Proposal.proposalCode",
  PROPOSAL_PI_FAMILY_NAME: "Proposal.principalInvestigatorFamilyName",
  PROPOSAL_TITLE: "Proposal.title",
  RIGHT_ASCENSION: "Target.rightAscension",
  RSS_DETECTOR_MODE: "RSS.detectorMode",
  RSS_EXPOSUSURE_TIME: "RSS.exposureTime",
  RSS_ID: "RSS.rssId",
  SALTICAM_DETECTOR_MODE: "Salticam.detectorMode",
  SALTICAM_ID: "Salticam.salticamId",
  START_TIME: "DataFile.startTime",
  TARGET_DECLINATION: "Target.declination",
  TARGET_NAME: "Target.targetName",
  TARGET_RIGHT_ASCENSION: "Target.rightAscension",
  TARGET_TYPE_EXPLANATION: "TargetType.explanation",
  TARGET_TYPE_NUMERIC_CODE: "TargetType.numericCode",
  TELESCOPE_NAME: "Telescope.telescopeName",
  TELESCOPE_OBSERVATION_ID: "Observation.telescopeObservationId"
};

export default DataKeys;
