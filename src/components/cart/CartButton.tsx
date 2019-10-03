import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import styled from "styled-components";

interface ICartButtonProps {
  openCart: (open: boolean) => void;
  cartItemsNumber: number;
}

const ButtonContainer = styled.div.attrs({
  className: "navbar-item is-large is-link"
})`
  && {
    padding: 10px;
  }
  && :hover, :focus {
    
    background-color: none;
    text-decoration: none;
    background-position: 0 -15px;
    -webkit-transition: background-position .1s linear;
    -moz-transition: background-position .1s linear;
    -o-transition: background-position .1s linear;
    transition: background-position .1s linear;
`;
const ButtonSpan = styled.span.attrs({ className: "is-span" })`
  && {
    margin-left: 10px;
  }
`;
const Button = styled.span.attrs({
  className: "button title is-outlined"
})`
  && {
  color: hsl(217, 71%, 53%);
    padding: 0;
border: none;
background: none;
  }
  
}
`;
const CartButton = (props: ICartButtonProps) => {
  const { openCart, cartItemsNumber } = props;
  const badgeNumber = cartItemsNumber >= 100 ? `${99}+` : `${cartItemsNumber}`;

  return (
    <ButtonContainer>
      <Button onClick={() => openCart(true)}>
        <span
          className={"has-badge-rounded has-badge-danger is-span"}
          data-badge={`${badgeNumber}`}
        >
          <FontAwesomeIcon icon={faShoppingCart} />
        </span>
        <ButtonSpan />
      </Button>
    </ButtonContainer>
  );
};
export default CartButton;
