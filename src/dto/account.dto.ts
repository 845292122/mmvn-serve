export interface AccountDTO {
  id?: number;
  phone?: string;
  password?: string;
  status?: number;
  remark?: string;
  contact?: string;
  merchantName?: string;
  isAdmin?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
