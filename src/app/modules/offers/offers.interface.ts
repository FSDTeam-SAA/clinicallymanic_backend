export interface IOffer {
  thumbnail: string;
  title: string;
  description: string;
  discount: number;
  validUntil: Date;
  status: 'active' | 'inactive';
}
