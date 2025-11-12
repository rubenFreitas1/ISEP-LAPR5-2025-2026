export interface ShippingAgentOrganizationModel {
  id?: number;
  code?: string;
  legalName?: string;
  alternativeName?: string;
  address?: string;
  taxNumber?: string;
  lastModifiedAt?: Date;
}

export interface ShippingAgentOrganizationWithRepresentativeModel {
  id?: number;
  code?: string;
  legalName?: string;
  alternativeName?: string;
  address?: string;
  taxNumber?: string;
  lastModifiedAt?: Date;
  representativeName?: string;
  representativeCitizenId?: string;
  representativeNationality?: string;
  representativeEmail?: string;
  representativePhoneNumber?: string;
}

export interface RepresentativeModel {
  id?: number;
  name?: string;
  citizenId?: string;
  nationality?: string;
  email?: string;
  phoneNumber?: string;
  organizationName?: string;
}
