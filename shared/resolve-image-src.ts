export const resolveImageSrc = (src: string) => {
  return `${process.env.NEXT_PUBLIC_IMAGE_ASSETS_SUFFIX}${src}`;
};

export const resolveAnimationSrc = (src: string) => {
  return `${process.env.NEXT_PUBLIC_IMAGE_ASSETS_SUFFIX}/animations/${src}`;
};
