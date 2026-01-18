export const useDimensions = (
  baseWidth: number,
  baseHeight: number,
  size?: number
) => {
  const scale = size ? size / baseWidth : 1;
  const width = size || baseWidth;
  const height = size ? baseHeight * scale : baseHeight;
  const viewBox = `0 0 ${baseWidth} ${baseHeight}`;

  return { width, height, viewBox };
};
