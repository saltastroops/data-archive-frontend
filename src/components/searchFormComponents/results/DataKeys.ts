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
  DETECTOR_MODE: "detector_mode.detector_mode",
  EXPOSURE_TIME: "observation_time.exposure_time",
  FILTER: "filter.name",
  HRS_MODE: "hrs_mode.hrs_mode",
  INSTRUMENT_MODE: "instrument_mode.instrument_mode",
  INSTRUMENT_NAME: "instrument.name",
  OBSERVATION_ID: "observation_group.observation_group_id",
  OBSERVATION_NAME: "observation_group.name",
  OBSERVATION_NIGHT: "observation_time.night",
  OBSERVATION_PUBLIC_FROM: "observation.data_release",
  OBSERVATION_STATUS: "status.status",
  POLARIZATION_MODE: "polarization_mode.name",
  PROPOSAL_CODE: "proposal.proposal_code",
  PROPOSAL_PI: "proposal.pi",
  PROPOSAL_TITLE: "proposal.title",
  RSS_FABRY_PEROT_MODE: "rss_fabry_perot_mode.fabry_perot_mode",
  RSS_GRATING: "rss_grating.grating",
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
