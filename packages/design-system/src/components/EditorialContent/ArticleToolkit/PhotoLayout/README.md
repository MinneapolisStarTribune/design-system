# PhotoLayout

`PhotoLayout` is a brand-agnostic editorial component designed for immersive article templates. It supports multiple grid configurations for structured visual storytelling while remaining themeable across different brands.

This component is used by consuming brands such as StarTribune and Varsity.

---

## Features

- **Multiple Layouts**: Supports `2up`, `3up`, and `4up` grid configurations.
- **Variants**: Currently supports an `immersive` variant for full-bleed style visual treatments.
- **Theming**: Brand-themeable natively via CSS variables (e.g., border-radius).
- **Responsive**: Fully responsive CSS Grid layouts across desktop, tablet, and mobile breakpoints.
- **Captions & Credits**: Integrated support for captions and image credits.
- **Performance**: Images are lazy-loaded and asynchronously decoded by default.

## Usage

```tsx
import { PhotoLayout } from '@/components';

<PhotoLayout
  imageList={[
    { src: 'image1.jpg', altText: 'Description 1' },
    { src: 'image2.jpg', altText: 'Description 2' },
  ]}
  photoLayout="2up"
  variant="immersive"
  caption="This is a caption for the photo layout"
  imageCredit="Photographer Name / Star Tribune"
/>;
```
