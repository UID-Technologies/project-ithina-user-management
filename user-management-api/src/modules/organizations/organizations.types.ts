import { LocationType } from '../../common/enums';

export interface LocationDto {
  id: string;
  tenantId: string;
  name: string;
  type: LocationType;
  parentId: string | null;
  code?: string;
  children?: LocationDto[];
}

export interface CreateLocationDto {
  tenantId: string;
  name: string;
  type: LocationType;
  parentId?: string | null;
  code?: string;
}

export type UpdateLocationDto = Partial<Omit<CreateLocationDto, 'tenantId'>>;
