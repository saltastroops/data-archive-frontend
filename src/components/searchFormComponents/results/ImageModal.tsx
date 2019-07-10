import * as React from "react";
import { Query } from "react-apollo";
import Modal from "react-responsive-modal";
import styled from "styled-components";
import { DATA_PREVIEW_QUERY } from "../../../graphql/Query";

interface IImageModalProps {
  id: number;
  open: boolean;
  closeModal: () => void;
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
  cursor: pointer;
  display: inline;
  margin-right: 5px;
  padding: 5;
`;

const Tab = styled.p`
  font-size: 25px;
  color: ${props => props.color};
`;

const PreviewFigure = styled.figure.attrs({
  className: "image is-2by2"
})`
  && {
    margin-bottom: 10px;
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
    const { id, open, closeModal } = this.props;
    const { headerTab, imageTab } = this.state.activeTab;

    return (
      <Modal open={open} onClose={closeModal} center={true}>
        <div className="tabs">
          <ul>
            <TabList>
              <Tab
                color={imageTab ? "hsl(217, 71%, 53%)" : undefined}
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
                color={headerTab ? "hsl(217, 71%, 53%)" : undefined}
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
          variables={{ dataFileId: id }}
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

            if (imageTab) {
              return imageURIs.map((image: string) => (
                <>
                  <PreviewFigure key={image}>
                    <img
                      className="card-image"
                      id={image}
                      src={`${process.env.REACT_APP_BACKEND_URI}${image}`}
                      alt={image}
                    />
                  </PreviewFigure>
                  <hr />
                </>
              ));
            }

            if (headerTab) {
              return <pre>{fitsHeader}</pre>;
            }

            return null;
          }}
        </Query>
      </Modal>
    );
  }
}

export default ImageModal;
