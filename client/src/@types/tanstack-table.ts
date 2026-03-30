// Type augmentation for @tanstack/react-table to allow meta.className on ColumnDef
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends unknown, TValue> {
    className?: string
  }
}

export {}
