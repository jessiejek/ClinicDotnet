export interface StaffPatient {
  id: string;
  patientCode: string;
  fullName: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  sex: string;
  contactNumber: string;
  email: string;
  userId?: string;
  isGuest: boolean;
  hasAccount?: boolean;
}

export function toStaffPatient(row: Record<string, unknown>): StaffPatient {
  const firstName = (row['firstName'] ?? row['first_name'] ?? '') as string;
  const middleName = (row['middleName'] ?? row['middle_name']) as string | undefined;
  const lastName = (row['lastName'] ?? row['last_name'] ?? '') as string;
  const id = (row['id'] ?? row['Id'] ?? '') as string;
  return {
    id,
    patientCode: (row['patientCode'] ?? row['patient_code'] ?? '') as string,
    fullName: (row['fullName'] ?? row['FullName'] ?? [firstName, middleName, lastName].filter(Boolean).join(' ')) as string,
    firstName,
    middleName,
    lastName,
    dateOfBirth: (row['dateOfBirth'] ?? row['date_of_birth'] ?? '') as string,
    sex: (row['sex'] ?? row['Sex'] ?? '') as string,
    contactNumber: (row['contactNumber'] ?? row['contact_number'] ?? '') as string,
    email: (row['email'] ?? row['contact_email'] ?? '') as string,
    userId: (row['userId'] ?? row['user_id']) as string | undefined,
    isGuest: (row['isGuest'] ?? row['is_guest'] ?? false) as boolean,
    hasAccount: !!(row['userId'] ?? row['user_id']),
  };
}
