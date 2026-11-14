// Reusable column type generator
export type AlignType = "left" | "center" | "right";

export interface BaseColumn<T> {
  key: keyof T | "actions" | "suspension_period";
  title: string;
  sortable?: boolean;
  width?: string;
  align?: AlignType;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

// Factory function to generate column type for any model
export const createColumns = <T>() => {
  return [] as BaseColumn<T>[];
};
