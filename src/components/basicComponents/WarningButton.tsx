import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import styled from "styled-components";

interface IWarningButtonProps {
  toolTipMessage: string;
}

class WarningButton extends React.Component<IWarningButtonProps, any> {
  render() {
    const { toolTipMessage } = this.props;
    return (
      <FontAwesomeIcon
        icon={faExclamationTriangle}
        data-tip={`<p style="width: 200px;">${toolTipMessage}</p>`}
        data-type={"warning"}
        data-html={true}
      />
    );
  }
}
export default WarningButton;
