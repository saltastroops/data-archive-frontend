/**
 * Constants for data keys used in the search results table.
 *
 * In general these will be column names from the observations database.
 */
const DataKeys = {
  CART: "cart",
  DATA_CATEGORY: "product_type.product_type",
  DATA_FILE_FILENAME: "artifact.name",
  DATA_FILE_ID: "artifact.artifact_id",
  HRS_OBSERVATION_MODE: "hrs_mode.hrs_mode",
  INSTRUMENT_NAME: "instrument.name",
  OBSERVATION_ID: "observation_group.observation_group_id",
  OBSERVATION_NAME: "observation_group.name",
  OBSERVATION_NIGHT: "observation_time.night",
  OBSERVATION_PUBLIC_FROM: "observation.data_release",
  OBSERVATION_STATUS: "status.status",
  PROPOSAL_CODE: "proposal.proposal_code",
  PROPOSAL_PI: "proposal.pi",
  PROPOSAL_TITLE: "proposal.title",
  RSS_DETECTOR_MODE: "RSS.detectorMode",
  RSS_EXPOSUSURE_TIME: "RSS.exposureTime",
  RSS_FABRY_PEROT_MODE: "RssFabryPerotMode.rssFabryPerotMode",
  RSS_GRATING: "RSS.grating",
  RSS_MODE: "RssMode.rssMode",
  RSS_POLARIMETRY_PATTERN: "RSS.polarimetryProcedurePattern",
  SALTICAM_DETECTOR_MODE: "Salticam.detectorMode",
  SALTICAM_FILTER: "Salticam.filterName",
  START_TIME: "observation_time.start_time",
  TARGET_DECLINATION: "position.dec",
  TARGET_NAME: "target.name",
  TARGET_RIGHT_ASCENSION: "position.ra",
  TARGET_TYPE_EXPLANATION: "target_type.description",
  TARGET_TYPE_NUMERIC_CODE: "target_type.numeric_code",
  TELESCOPE_NAME: "telescope.name",
  TELESCOPE_OBSERVATION_ID: "observation_group.observation_group_id"
};

export default DataKeys;
