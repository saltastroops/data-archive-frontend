import noScroll from "no-scroll";
import React from "react";
import CSSTransition from "react-transition-group/CSSTransition";
import styled from "styled-components";
import { baseAxiosClient } from "../api";

const Overlay = styled.div`
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: flex-start;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 50;
  padding: 1.2rem;
`;

const Modal = styled.div`
  max-width: 800px;
  position: relative;
  padding: 1.2rem;
  background: #ffffff;
  background-clip: padding-box;
  box-shadow: 0 12px 15px 0 rgba(0, 0, 0, 0.25);
  margin: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  border: none;
  padding: 0;
  background-color: transparent;
  display: flex;
`;

interface IJS9ViewProps {
  closeIconSize?: number;
  fitsURL: string;
  onClose: () => void;
  open: boolean;
}

interface IJS9ViewState {
  open: boolean;
}

/**
 * A modal for previewing FITS files with JS9.
 *
 * When using this component, keep the following in mind:
 *
 * - This component may only be used once. (More technically, it must only be
 *   mounted once.
 * - The component should not be included within a router component or any
 *   other component seriously meddling with the DOM.
 * - The component must be initialised with an empty string for its fitsURL
 *   property.
 *
 * You should update the component with the help of the JS9ViewContext context.
 *
 * The modal part of this component is essentially a stripped-down version of
 * react-responsive=-model
 * (https://www.npmjs.com/package/react-responsive-modal).
 */
class JS9View extends React.Component<IJS9ViewProps, IJS9ViewState> {
  static initialisedBefore = false;

  static blockScroll() {
    noScroll.on();
  }

  shouldClose: boolean | null = null;

  close = () => {
    // Close pop up windows sich as the one for displaying the header
    document
      .querySelectorAll("#dhtmlwindowholder .dhtmlwindow")
      .forEach((e) => ((e as HTMLElement).style.display = "none"));

    this.props.onClose();
  };

  handleOpen = () => {
    document.addEventListener("keydown", this.handleKeydown);
  };

  handleClose = () => {
    document.removeEventListener("keydown", this.handleKeydown);
  };

  handleClickOverlay = () => {
    if (this.shouldClose === null) {
      this.shouldClose = true;
    }

    if (!this.shouldClose) {
      this.shouldClose = null;
      return;
    }

    this.close();

    this.shouldClose = null;
  };

  handleClickCloseIcon = (event: any) => {
    this.close();
  };

  handleKeydown = (event: any) => {
    if (event.keyCode !== 27) {
      return;
    }

    this.close();
  };

  handleModalEvent = () => {
    this.shouldClose = false;
  };

  componentDidMount() {
    if (JS9View.initialisedBefore) {
      throw new Error("The JS9View component must only be used once.");
    }

    if (this.props.fitsURL) {
      throw new Error(
        "The JS9View component must be initialised with an empty string for the fitsURL property."
      );
    }

    if ((window as any).JS9) {
      (window as any).JS9.init();
    }

    window.addEventListener("keydown", this.handleKeydown);

    JS9View.initialisedBefore = true;
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeydown);
  }

  async componentDidUpdate(
    prevProps: Readonly<IJS9ViewProps>,
    prevState: Readonly<IJS9ViewState>,
    snapshot?: any
  ): Promise<void> {
    const { fitsURL } = this.props;

    if (fitsURL && fitsURL !== prevProps.fitsURL) {
      if ((window as any).JS9) {
        try {
          const fits = await baseAxiosClient({ responseType: "blob" }).get(
            fitsURL
          );
          (window as any).JS9.Load(fits.data);
        } catch (e) {
          alert(e.message);
        }
      }
    }
  }

  render() {
    const { closeIconSize, open } = this.props;

    return (
      <div data-test="wrapper" style={{ display: open ? "block" : "none" }}>
        <CSSTransition in={open} appear={true} classNames={{}} timeout={500}>
          <Overlay
            data-test="overlay"
            onKeyDown={this.handleKeydown}
            onClick={this.handleClickOverlay}
          >
            <Modal
              onMouseDown={this.handleModalEvent}
              onMouseUp={this.handleModalEvent}
              onClick={this.handleModalEvent}
              role="dialog"
              aria-modal="true"
            >
              <div className="section">
                <div className="JS9Menubar" />
                <div className="JS9" />
                <div className="JS9Colorbar" />
              </div>
              <CloseButton data-test="close" onClick={this.close}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={closeIconSize || 28}
                  height={closeIconSize || 28}
                  viewBox="0 0 36 36"
                >
                  <path d="M28.5 9.62L26.38 7.5 18 15.88 9.62 7.5 7.5 9.62 15.88 18 7.5 26.38l2.12 2.12L18 20.12l8.38 8.38 2.12-2.12L20.12 18z" />
                </svg>
              </CloseButton>
            </Modal>
          </Overlay>
        </CSSTransition>
      </div>
    );
  }
}

export default JS9View;

/**
 * A context for updating the JS9View component. It includes the following
 * properties:
 *
 * - close: Function for closing the  modal.
 * - load: Function for loading a FITS image.
 * - open: Function for opening the modal.
 *
 * A call to the load function should not automatically open the modal.
 */
export const JS9ViewContext = React.createContext({
  close: () => {
    // do nothing
  },
  load: (fitsURL: string) => {
    // do nothing
  },
  open: () => {
    // do nothing
  },
});
