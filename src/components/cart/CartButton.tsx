import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import styled from "styled-components";

interface ICartButtonProps {
  openCart: (open: boolean) => void;
  cartItemsNumber: number;
}

const ButtonContainer = styled.div.attrs({
  className: "navbar-item is-large"
})`
  && {
    padding: 10px;
  }
`;
const CartButton = (props: ICartButtonProps) => {
  const { openCart, cartItemsNumber } = props;
  const badgeNumber = cartItemsNumber >= 100 ? `${99}+` : `${cartItemsNumber}`;

  return (
    <ButtonContainer>
      <button
        className="button is-link subtitle"
        onClick={() => openCart(true)}
      >
        <span
          className={"has-badge-rounded has-badge-danger is-span"}
          data-badge={`${badgeNumber}`}
        >
          <FontAwesomeIcon icon={faShoppingCart} />
        </span>
        CART
      </button>
    </ButtonContainer>
  );
};
export default CartButton;
