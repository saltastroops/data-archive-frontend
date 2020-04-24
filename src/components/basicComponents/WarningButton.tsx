import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";

interface IWarningTooltipProps {
  toolTipMessage: string;
}

class WarningTooltip extends React.Component<IWarningTooltipProps, any> {
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
export default WarningTooltip;
