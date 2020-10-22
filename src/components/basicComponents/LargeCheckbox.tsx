import styled from "styled-components";

export const LargeCheckbox = styled.input.attrs({
  className: "checkbox",
  type: "checkbox",
})`
  && {
    width: 18px;
    height: 18px;
  }
`;
