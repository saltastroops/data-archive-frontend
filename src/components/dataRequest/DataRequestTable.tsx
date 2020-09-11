import moment from "moment";
import * as React from "react";
import styled from "styled-components";
import { titleCase } from "title-case";
import { IDataRequest } from "./DataRequestsForm";
import { baseAxiosClient } from "../../api";
import fileDownload from "js-file-download";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

/**
 * Convert the name to title case
 *
 * Properties:
 * -----------
 * text:
 *    The string to be converted
 *
 * Returns:
 * --------
 * string :
 *  Title case string
 *
 */
const convertToTitleCase = (text: string) => {
  return titleCase(text.toLowerCase().replace(/_/g, " "));
};
/**
 * Properties of the data request table component.
 *
 * Properties:
 * -----------
 * dataRequest:
 *    Data request whose content is displayed.
 */
interface IDataRequestTableProps {
  dataRequest: IDataRequest;
  areDisableButtons: boolean;
  disableButtons: (areDisableButtons: boolean) => void;
}

const Table = styled.table.attrs({
  className: "table is-striped is-narrowed is-hoverable is-fullwidth",
})`
  && {
  }
`;

/**
 * The string to display for the creation date.
 *
 * The time is returned as date and time (such as "on 21 Feb 2019 at 2:16").
 *
 * Parameters
 * ----------
 * madeAt:
 *    The creation date as a string that can be parsed by MomentJS.
 */
const displayedTime = (madeAt: string) => {
  const t = moment(madeAt);
  return `on ${t.format("D MMM YYYY")} at ${t.format("k:mm")}`;
};

/**
 * A table displaying the content of a data request.
 */
class DataRequestTable extends React.Component<IDataRequestTableProps> {
  state = {
    showMessage: false,
  };
  render() {
    const { areDisableButtons, dataRequest } = this.props;
    const {
      dataFiles,
      madeAt,
      id,
      calibrationLevels,
      calibrationTypes,
    } = dataRequest;
    const { showMessage } = this.state;

    return (
      <div className="table-container notification">
        <Table>
          <thead>
            <tr>
              <th colSpan={2}>
                <p style={{ display: "inline-block" }}>
                  Requested {displayedTime(madeAt)}
                </p>
              </th>
              <th>
                <p
                  style={{
                    textAlign: "right",
                  }}
                >
                  {showMessage && (
                    <span className={"has-text-warning"}>
                      This may take a few minutes...{" "}
                    </span>
                  )}
                  {
                    <button
                      className={`button download-all is-small is-success is-rounded ${
                        showMessage && "is-loading"
                      }`}
                      disabled={areDisableButtons}
                      id={id}
                      onClick={(event) => this.downloadRequest(id)}
                    >
                      <span>
                        Download <FontAwesomeIcon icon={faDownload} />
                      </span>
                    </button>
                  }
                </p>
              </th>
            </tr>
            <tr>
              <td colSpan={3}>
                <b>Requested calibration levels:</b>{" "}
                {calibrationLevels.length
                  ? calibrationLevels
                      .map((level) => convertToTitleCase(level))
                      .join(", ")
                      .replace(/,([^,]*)$/, " and $1")
                  : "None"}
              </td>
            </tr>
            <tr>
              <td colSpan={3}>
                <b>Requested calibration types:</b>{" "}
                {calibrationTypes.length
                  ? calibrationTypes
                      .map((type) => convertToTitleCase(type))
                      .join(", ")
                      .replace(/,([^,]*)$/, " and $1")
                  : "None"}
              </td>
            </tr>
            <tr>
              <th colSpan={3}>Files</th>
            </tr>
            {dataFiles.map((file) => {
              return (
                <tr key={file.id}>
                  <td colSpan={3}>{file.name}</td>
                </tr>
              );
            })}
          </thead>
          <tbody />
        </Table>
      </div>
    );
  }

  recreateDataRequest = async (create: any) => {
    const { calibrationLevels, calibrationTypes } = this.props.dataRequest;
    const dataFileIds = this.props.dataRequest.dataFiles.map((file) =>
      parseInt(file.id, 10)
    );
    // We may assume that no calibrations are included, as the list of data
    // files is by definition the complete set of files to request (i.e. it
    // includes calibrations if the initial request included them)
    await create({
      variables: {
        dataFiles: dataFileIds,
        includedCalibrationLevels: calibrationLevels,
        includedCalibrationTypes: calibrationTypes,
      },
    });
  };

  downloadRequest = async (id: string) => {
    this.setState({
      showMessage: true,
    });
    this.props.disableButtons(true);
    const zipUrl = `${
      process.env.REACT_APP_BACKEND_URI
        ? process.env.REACT_APP_BACKEND_URI.replace(/\/+$/, "")
        : ""
    }/downloads/data-requests/${id}`;
    const response = await baseAxiosClient().get(zipUrl, {
      responseType: "blob",
    });
    await fileDownload(response.data, `ssda_data_request_${id}.zip`);
    this.props.disableButtons(false);
    this.setState({
      showMessage: false,
    });
  };
}

export default DataRequestTable;
