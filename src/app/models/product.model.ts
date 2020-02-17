export interface Product {
  _id: string;
  title: string;
  content: string;
  imagePath: string;
  likes: number;
  ownerUsername: string;
  price: number;
  isLiked: boolean;
}
