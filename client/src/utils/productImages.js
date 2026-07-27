import product1 from '../assets/images/001 Natural black1.png';
import product2 from '../assets/images/002 Brown black2.png';
import product3 from '../assets/images/003 Drak brown3.png';

import nb1 from '../assets/images/NATURAL BLACK/01.png';
import nb2 from '../assets/images/NATURAL BLACK/02.png';
import nb3 from '../assets/images/NATURAL BLACK/03.png';
import nb4 from '../assets/images/NATURAL BLACK/04.png';
import nb5 from '../assets/images/NATURAL BLACK/05.webp';
import nb6 from '../assets/Untitled design (3).mp4';

import bb1 from '../assets/images/02 BLACK BROWN/01.png';
import bb2 from '../assets/images/02 BLACK BROWN/02.png';
import bb3 from '../assets/images/02 BLACK BROWN/03.png';
import bb4 from '../assets/images/02 BLACK BROWN/04.png';
import bb5 from '../assets/images/02 BLACK BROWN/05.webp';
import bb6 from '../assets/Untitled design (3).mp4';

import db1 from '../assets/images/DARK BROWN/01.png';
import db2 from '../assets/images/DARK BROWN/02.png';
import db3 from '../assets/images/DARK BROWN/03.png';
import db4 from '../assets/images/DARK BROWN/04.png';
import db5 from '../assets/images/DARK BROWN/05.webp';
import db6 from '../assets/Untitled design (3).mp4';

export const listingImageMap = {
  'natural-black': product1,
  'black-brown': product2,
  'dark-brown': product3,
};

export const galleryImageMap = {
  'natural-black': [
    { type: 'image', src: nb1 },
    { type: 'image', src: nb2 },
    { type: 'image', src: nb3 },
    { type: 'image', src: nb4 },
    { type: 'image', src: nb5 },
    { type: 'video', src: nb6 },
  ],
  'black-brown': [
    { type: 'image', src: bb1 },
    { type: 'image', src: bb2 },
    { type: 'image', src: bb3 },
    { type: 'image', src: bb4 },
    { type: 'image', src: bb5 },
    { type: 'video', src: bb6 },
  ],
  'dark-brown': [
    { type: 'image', src: db1 },
    { type: 'image', src: db2 },
    { type: 'image', src: db3 },
    { type: 'image', src: db4 },
    { type: 'image', src: db5 },
    { type: 'video', src: db6 },
  ],
};

const defaultListingImage = product1;
const defaultGallery = galleryImageMap['natural-black'];

export function getProductGallery(slug) {
  return galleryImageMap[slug] || defaultGallery;
}

export function getListingImage(slug) {
  return listingImageMap[slug] || defaultListingImage;
}

export function getProductImageSrc(product) {
  if (!product) return defaultListingImage;

  if (product.image && typeof product.image === 'string') {
    return product.image;
  }

  if (product.images?.length) {
    const first = product.images[0];
    if (typeof first === 'string') return first;
    if (typeof first === 'object') {
      const firstImage = product.images.find((media) => media?.type === 'image');
      return firstImage?.src || first?.src || defaultListingImage;
    }
  }

  if (product.slug) {
    return getListingImage(product.slug);
  }

  return defaultListingImage;
}

export function normalizeProduct(product) {
  if (!product) return product;

  return {
    ...product,
    image: getProductImageSrc(product),
    images: product.images || getProductGallery(product.slug),
  };
}
