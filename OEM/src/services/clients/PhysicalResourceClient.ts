import axios from 'axios';

export interface PhysicalResourceDTO {
    id: string;
    code: string;
    name: string;
    description: string;
    kind: string;
    operationalCapacity: number;
    status: string;
    assignedArea?: string;
    qualificationCode: string;
    operationalWindow: {
        startDay: number;
        endDay: number;
        startTime: string;
        endTime: string;
    };
    setupTimeMinutes?: number;
}

export default class PhysicalResourceClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
    }

    /**
     * Get physical resource by name
     */
    public async getByName(name: string, authHeader?: string): Promise<PhysicalResourceDTO | null> {
        try {
            const url = `${this.baseUrl}/PhysicalResources/ByName/${encodeURIComponent(name)}`;
            const headers: any = {};
            if (authHeader) {
                headers['Authorization'] = authHeader;
            }

            const response = await axios.get(url, { headers });
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    }
}
