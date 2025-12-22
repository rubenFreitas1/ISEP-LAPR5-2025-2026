export class ComplementaryTaskCategory {

    constructor(
        public id: string,
        public code: string,
        public name: string,
        public description: string,
        public duration: string | null,
        public lastUpdated: Date,
        public parentComplementaryTaskCategoryId?: string,
    ) {
        this.validateCode(code)
        this.validateName(name)
        this.validateDescription(description)
    }

    private validateCode(code: string) {
        if (!code || code.trim().length === 0) {
            throw new Error("Complementary task category code cannot be null or empty.");
        }
        if (code.length > 10) {
            throw new Error("Complementary task category code cannot exceed 10 characters.")
        }
    }

    private validateName(name: string) {
        if (!name || name.trim().length === 0) {
            throw new Error("Complementary task category name cannot be null or empty.");
        }
    }

    private validateDescription(description: string) {
        if (!description || description.trim().length === 0) {
            throw new Error("Complementary task category description cannot be null or empty.");
        }
        const words = description.trim().split(/\s+/);
        if (words.length < 2) {
            throw new Error("Complementary task category description must contain at least two words.");
        }
    }

    updateName(name: string) {
        this.validateName(name);
        this.name = name;
        this.lastUpdated = new Date();
    }

    updateDescription(description: string) {
        this.validateDescription(description);
        this.description = description;
        this.lastUpdated = new Date();
    }

    updateDuration(duration: string) {
        this.duration = duration;
        this.lastUpdated = new Date();
    }

    updateParentComplementaryTaskCategory(id?: string) {
        this.parentComplementaryTaskCategoryId = id;
        this.lastUpdated = new Date();
    }
}