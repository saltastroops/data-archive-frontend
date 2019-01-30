import gql from "graphql-tag";
import * as React from "react";
import { ChangeEvent, Component } from "react";
import { Mutation } from "react-apollo";

import styled from "styled-components";

const PaddedDiv = styled.div`
  padding: 15px;
`;

interface ISubmitButtonProps {
  loading: boolean;
}
const SubmitButton = styled.button.attrs({
  className: "button primary"
})`
  && {
    background-color: ${(props: ISubmitButtonProps) =>
      props.loading ? "lightblue" : "blue"};
    color: white;
  }
`;
const MessageTextArea = styled.textarea.attrs({
  className: "textarea"
})`
  && {
    min-width: 50%;
    width: 50%;
  }
`;

const POST_MESSAGE_MUTATION = gql`
  mutation POST_MESSAGE_MUTATION($text: String!) {
    postMessage(text: $text)
  }
`;

interface ISendMessageState {
  message: string;
}
class SendMessage extends Component<{}, ISendMessageState> {
  public state = { message: "" };

  public render() {
    const onSubmit = async (e: any) => {
      e.preventDefault();
      this.setState(() => ({
        message: ""
      }));
    };

    return (
      <Mutation
        mutation={POST_MESSAGE_MUTATION}
        variables={{ text: this.state.message }}
      >
        {(sendMessage, { loading, error }) => (
          <>
            {error && <div>{error.message}</div>}
            <form onSubmit={onSubmit}>
              <fieldset disabled={loading} aria-disabled={loading}>
                <PaddedDiv>
                  <MessageTextArea
                    name="message"
                    placeholder="Type your message"
                    onChange={this.handleChange}
                    value={this.state.message}
                  />
                </PaddedDiv>
                <PaddedDiv>
                  <SubmitButton loading={loading} type="submit">
                    {loading ? "Submitting..." : "Submit"}
                  </SubmitButton>
                </PaddedDiv>
              </fieldset>
            </form>
          </>
        )}
      </Mutation>
    );
  }

  private handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.persist();
    this.setState(
      () =>
        ({
          [e.target.name]: e.target.value
        } as any)
    );
  };
}

export default SendMessage;
