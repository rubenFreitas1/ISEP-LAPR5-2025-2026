export interface IComplementaryTaskCategoryPersistence {
    _id: string;
    code: string;
    name: string;
    description: string;
    duration?: string | null;
    lastUpdated: Date;
    parentComplementaryTaskCategoryId?: string;
}