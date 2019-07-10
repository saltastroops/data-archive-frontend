import * as React from "react";
import { Query } from "react-apollo";
import Modal from "react-responsive-modal";
import styled from "styled-components";
import { DATA_PREVIEW_QUERY } from "../../../graphql/Query";

interface IImageModalProps {
  closeModal: () => void;
  dataFileId: number;
  open: boolean;
}

interface IImageModalState {
  activeTab: {
    headerTab: boolean;
    imageTab: boolean;
  };
}

const TabList = styled.li`
  background-color: transparent;
  border: none;
  display: inline;
  margin-right: 10px;
  padding: 5;
`;

const Tab = styled.p<{ bold: boolean }>`
  font-size: 25px;
  font-weight: ${props => (props.bold ? "bold" : "normal")};
  cursor: ${props => props.color && "pointer"};
  color: ${props => props.color};
`;

const PreviewFigure = styled.figure.attrs({
  className: "image is-2by2"
})`
  && {
    height: 100%;
  }
`;

class ImageModal extends React.Component<IImageModalProps, IImageModalState> {
  state = {
    activeTab: {
      headerTab: false,
      imageTab: true
    }
  };

  render() {
    const { dataFileId, open, closeModal } = this.props;
    const { headerTab, imageTab } = this.state.activeTab;

    return (
      <Modal open={open} onClose={closeModal} center={true} blockScroll={false}>
        <div className="tabs">
          <ul>
            <TabList>
              <Tab
                color={imageTab ? undefined : "hsl(217, 71%, 53%)"}
                bold={imageTab}
                onClick={() =>
                  this.setState({
                    activeTab: { headerTab: false, imageTab: true }
                  })
                }
              >
                Image
              </Tab>
            </TabList>
            <TabList>
              <Tab
                color={headerTab ? undefined : "hsl(217, 71%, 53%)"}
                bold={headerTab}
                onClick={() =>
                  this.setState({
                    activeTab: { headerTab: true, imageTab: false }
                  })
                }
              >
                Header
              </Tab>
            </TabList>
          </ul>
        </div>
        <Query
          query={DATA_PREVIEW_QUERY}
          variables={{ dataFileId }}
          skip={!open}
        >
          {({ data, loading, error }: any) => {
            if (loading) {
              return <p>Loading...</p>;
            }

            if (error) {
              return (
                <p>
                  {error.message
                    .replace("Network error: ", "")
                    .replace("GraphQL error: ", "")}
                </p>
              );
            }

            if (!data) {
              return <p>Currently no data available to show.</p>;
            }

            const { fitsHeader, imageURIs } = data.dataPreview;

            return (
              <div style={{ maxHeight: 600, overflowY: "auto" }}>
                {imageTab &&
                  imageURIs.map((image: string) => (
                    <PreviewFigure key={image}>
                      <img
                        className="card-image"
                        id={image}
                        src={`${process.env.REACT_APP_BACKEND_URI}${image}`}
                        alt={image}
                      />
                    </PreviewFigure>
                  ))}
                {headerTab && <pre>{fitsHeader}</pre>}
              </div>
            );
          }}
        </Query>
      </Modal>
    );
  }
}

export default ImageModal;
