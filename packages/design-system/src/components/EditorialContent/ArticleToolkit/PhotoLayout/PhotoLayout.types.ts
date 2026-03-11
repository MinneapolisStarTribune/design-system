import type { ArticleToolkitBaseProps, ImageData, PhotoLayoutType } from '../types';

export interface PhotoLayoutProps extends ArticleToolkitBaseProps {
  caption?: string;
  imageList: ImageData[];
  photoLayout?: PhotoLayoutType;
  imageCredit?: string;
  imgixParams?: string;
  variant?: 'immersive'; // Restricting variant to 'immersive' for now, can be expanded in the future if needed
  expandable?: boolean;
}
