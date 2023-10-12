import styled from "@emotion/styled";
import { Space } from "antd";

const CotainerPage = styled.div`
  display: flex;
  flex-direction: row; // To layout children side by side
  align-items: center; // To vertically center align items
  justify-content: center; // To horizontally center align items
  padding: 24px;
  height: 100vh;
`;

const SpacedStyle = styled(Space)`
  margin-bottom: 16px;
  margin-top: 16px;
  display: flex;
  justify-content: space-between;

  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

const ImageContainer = styled.div`
  width: 50%;
  padding-left: 20px;
  position: relative;

  &::before {
    content: "";
    display: block;
    padding-top: 56.25%; // for 16:9 aspect ratio. Adjust if you want a different ratio.
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover; // This ensures the image covers the entire container without stretching.
  }

  @media (max-width: 768px) {
    display: none; // Hides the container on mobile screens
  }
`;

const StyledFormContainer = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: #ffffff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  display: flex;
  gap: 40px;
  @media (min-width: 768px) {
    padding: 64px;
  }
`;

export { CotainerPage, SpacedStyle, ImageContainer, StyledFormContainer };
