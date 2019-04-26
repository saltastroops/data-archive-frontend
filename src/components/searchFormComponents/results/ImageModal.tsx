import * as React from "react";
import Modal from "react-responsive-modal";

interface IImageModal {
  image: {
    url: string;
    alt: string;
  };
  open: boolean;
  closeModal: () => void;
}

export default (props: IImageModal) => {
  const { open, closeModal } = props;
  const { url, alt } = props.image;

  return (
    <Modal open={open} onClose={closeModal} center={true}>
      <figure className="image is-2by2">
        <img className="card-image" id="img01" src={url} alt={alt} />{" "}
        <p className={"notification"}>{alt}</p>
      </figure>
    </Modal>
  );
};
