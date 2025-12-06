export interface CategoryApiResponse {
  data: Category[];
}

export interface Category {
  id: number;
  name: string;
}

export function mapCategory(raw: any): Category {
  return {
    id: raw.id,
    name: raw.name,
  };
}

export function mapCategoryList(res: CategoryApiResponse): Category[] {
  return res.data.map(mapCategory);
}
