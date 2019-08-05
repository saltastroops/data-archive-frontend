import { faQuestion } from "@fortawesome/free-solid-svg-icons/faQuestion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import Modal from "react-responsive-modal";
import styled from "styled-components";
import Message from "./Message";

interface IHelpButtonProps {
  message: string;
}

const Button = styled.button.attrs({
  className: "button is-rounded"
})`
  && {
  }
`;
const MessageBlock = styled.div.attrs({
  className: ""
})`
  && {
    papping-top: 30px
    margin: 30px
  }
`;

// No test will be done on it as well for the above reason

class HelpButton extends React.Component<IHelpButtonProps, any> {
  state = {
    open: false
  };
  openModal = (open: boolean) => {
    this.setState(() => ({ open }));
    console.log(this.state);
  };
  render() {
    const { message } = this.props;
    return (
      <>
        <Modal
          open={this.state.open}
          onClose={() => this.openModal(false)}
          center={true}
        >
          <MessageBlock>
            <Message message={message} />
          </MessageBlock>
        </Modal>
        <div className={"control"}>
          <Button
            className={`button is-rounded`}
            onClick={() => this.openModal(true)}
          >
            <FontAwesomeIcon icon={faQuestion} />
          </Button>
        </div>
      </>
    );
  }
}
export default HelpButton;
