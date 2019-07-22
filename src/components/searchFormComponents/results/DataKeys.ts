/**
 * Constants for data keys used in the search results table.
 *
 * In general these will be column names from the observations database.
 */
const DataKeys = {
  CART: "cart",
  DATA_FILE_FILENAME: "DataFile.dataFileName",
  DATA_FILE_ID: "DataFile.dataFileId",
  HRS_ID: "HRS.hrsId",
  HRS_OBSERVATION_MODE: "HRS.observationMode",
  INSTRUMENT_NAME: "Instrument.instrumentName",
  OBSERVATION_ID: "Observation.observationId",
  OBSERVATION_NAME: "observationName",
  OBSERVATION_NIGHT: "Observation.night",
  OBSERVATION_PUBLIC_FROM: "Observation.publicFrom",
  PROPOSAL_CODE: "Proposal.proposalCode",
  PROPOSAL_PI_FAMILY_NAME: "Proposal.principalInvestigatorFamilyName",
  PROPOSAL_TITLE: "Proposal.title",
  RSS_DETECTOR_MODE: "RSS.detectorMode",
  RSS_EXPOSUSURE_TIME: "RSS.exposureTime",
  RSS_ID: "RSS.rssId",
  RSS_FABRY_PEROT_MODE: "RssFabryPerotMode.rssFabryPerotMode",
  RSS_GRATING: "RSS.grating",
  RSS_MODE: "RssMode.rssMode",
  RSS_POLARIMETRY_PATTERN: "RSS.polarimetryProcedurePattern",
  SALTICAM_DETECTOR_MODE: "Salticam.detectorMode",
  SALTICAM_FILTER: "Salticam.filterName",
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
