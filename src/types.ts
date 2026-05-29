export type ArtworkType = "Paper Print" | "Canvas Print";

export interface ArtworkSize {
  label: string;
  price: number;
  formattedPrice?: string;
  sku?: string;
  choices: {
    Size: string;
    FRAME: string;
    Passepartout: string;
  };
  widthCm: number;
  heightCm: number;
}

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  price: number;
  imageUrl: string;
  type: ArtworkType;
  width: number;
  height: number;
  slug: string;
  sizes: ArtworkSize[];
}

export interface WallPlacement {
  id: string;
  artwork: Artwork;
  x: number;
  y: number;
  rotation: number;
  selectedSizeIndex: number;
}
