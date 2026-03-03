import { ImageData, PhotoLayoutType } from '../types';

export const LAYOUT_IMAGE_COUNT: Record<PhotoLayoutType, number> = {
  '2up': 2,
  '3up': 3,
  '4up': 4,
};

export const getImageList = (images: ImageData[], layout: PhotoLayoutType): ImageData[] => {
  return images.slice(0, LAYOUT_IMAGE_COUNT[layout]);
};
