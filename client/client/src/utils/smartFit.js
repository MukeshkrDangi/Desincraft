// client/src/utils/smartFit.js
export const getSmartFitProps = (imageWidth, imageHeight, frameWidth, frameHeight) => {
  const scale = Math.min(frameWidth / imageWidth, frameHeight / imageHeight) * 0.7;
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  return {
    width,
    height,
    x: (frameWidth - width) / 2,
    y: (frameHeight - height) / 2,
  };
};
