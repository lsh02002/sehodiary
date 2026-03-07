import React from "react";
import styled from "styled-components";

const ImageCard = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <ImagesField>
      <img style={{objectFit: "fill"}} width={"100%"} height={"100%"} src={imageUrl} alt="그림" />
    </ImagesField>
  );
};

export default ImageCard;

const ImagesField = styled.div`
    display: flex;
    justify-content: center;    
    box-sizing: border-box;    
    padding: 10px 0;
`;
