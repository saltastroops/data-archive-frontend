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
        {/* TODO it binds to this image on render fix it */}
        <p className={"notification"}>{alt}</p>
      </figure>
    </Modal>
  );
};
