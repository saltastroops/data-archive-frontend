import * as React from "react";
import { Query } from "react-apollo";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
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
  display: inline;
  margin-right: 10px;
  padding: 5;
`;

const Tab = styled.p`
  font-size: 25px;
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
    const { id, open, closeModal } = this.props;
    const { headerTab, imageTab } = this.state.activeTab;

    return (
      <Modal open={open} onClose={closeModal} center={true} blockScroll={false}>
        <div className="tabs">
          <ul>
            <TabList>
              <Tab
                color={imageTab ? undefined : "hsl(217, 71%, 53%)"}
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
              return (
                <Carousel>
                  {imageURIs.map((image: string) => (
                    <PreviewFigure key={image}>
                      <img
                        className="card-image"
                        id={image}
                        src={`${process.env.REACT_APP_BACKEND_URI}${image}`}
                        alt={image}
                      />
                    </PreviewFigure>
                  ))}
                </Carousel>
              );
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
