export interface StaffModel {
  id?: number;
  name?: string;
  qualificationCodes?: string[];
  email?: string;
  phone?: string;
  // Optional fields for UI convenience
  operationalWindow?: any;
  status?: number;
}
