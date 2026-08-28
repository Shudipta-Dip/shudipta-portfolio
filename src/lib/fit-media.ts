export function fitMediaInBox(
  mediaWidth: number,
  mediaHeight: number,
  boxWidth: number,
  boxHeight: number,
) {
  if (boxWidth <= 0 || boxHeight <= 0 || mediaWidth <= 0 || mediaHeight <= 0) {
    return { width: 0, height: 0 };
  }

  const mediaAspect = mediaWidth / mediaHeight;
  const boxAspect = boxWidth / boxHeight;

  if (mediaAspect > boxAspect) {
    return {
      width: boxWidth,
      height: boxWidth / mediaAspect,
    };
  }

  return {
    width: boxHeight * mediaAspect,
    height: boxHeight,
  };
}
