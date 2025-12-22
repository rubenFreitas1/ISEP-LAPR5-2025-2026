export interface ComplementaryTaskCategoryModel {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  duration?: string | null;
  lastUpdated?: Date;
  parentComplementaryTaskCategoryCode?: string;
}
