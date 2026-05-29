import { PatientDetail, PatientSummary } from '../../../core/models';

type NullableString = string | null | undefined;

interface PatientRow {
  id: string;
  patient_code?: NullableString;
  first_name?: NullableString;
  middle_name?: NullableString;
  last_name?: NullableString;
  date_of_birth?: NullableString;
  sex?: NullableString;
  civil_status?: NullableString;
  address?: NullableString;
  city?: NullableString;
  zip_code?: NullableString;
  contact_number?: NullableString;
  contact_email?: NullableString;
  emergency_contact_name?: NullableString;
  emergency_contact_number?: NullableString;
  emergency_contact_relationship?: NullableString;
  blood_type?: NullableString;
  phil_health_number?: NullableString;
  hmo_provider?: NullableString;
  hmo_card_number?: NullableString;
  user_id?: NullableString;
  is_guest?: boolean | null;
  consented_at?: NullableString;
  consent_version?: NullableString;
}

function withCamelCaseFallback(raw: Record<string, unknown>): PatientRow {
  const row: Record<string, unknown> = { ...raw };
  row['patient_code'] = row['patient_code'] ?? row['patientCode'];
  row['first_name'] = row['first_name'] ?? row['firstName'];
  row['middle_name'] = row['middle_name'] ?? row['middleName'];
  row['last_name'] = row['last_name'] ?? row['lastName'];
  row['date_of_birth'] = row['date_of_birth'] ?? row['dateOfBirth'];
  row['civil_status'] = row['civil_status'] ?? row['civilStatus'];
  row['zip_code'] = row['zip_code'] ?? row['zipCode'];
  row['contact_number'] = row['contact_number'] ?? row['contactNumber'];
  row['contact_email'] = row['contact_email'] ?? row['email'];
  row['emergency_contact_name'] = row['emergency_contact_name'] ?? row['emergencyContactName'];
  row['emergency_contact_number'] = row['emergency_contact_number'] ?? row['emergencyContactNumber'];
  row['emergency_contact_relationship'] = row['emergency_contact_relationship'] ?? row['emergencyContactRelationship'];
  row['blood_type'] = row['blood_type'] ?? row['bloodType'];
  row['phil_health_number'] = row['phil_health_number'] ?? row['philHealthNumber'];
  row['hmo_provider'] = row['hmo_provider'] ?? row['hmoProvider'];
  row['hmo_card_number'] = row['hmo_card_number'] ?? row['hmoCardNumber'];
  row['user_id'] = row['user_id'] ?? row['userId'];
  row['is_guest'] = row['is_guest'] ?? row['isGuest'];
  row['consented_at'] = row['consented_at'] ?? row['consentedAt'];
  row['consent_version'] = row['consent_version'] ?? row['consentVersion'];
  return row as unknown as PatientRow;
}

export function rowToSummary(row: Record<string, unknown>): PatientSummary {
  const patientRow = withCamelCaseFallback(row);
  return {
    id: patientRow.id,
    patientCode: patientRow.patient_code ?? '',
    firstName: patientRow.first_name ?? '',
    middleName: patientRow.middle_name ?? undefined,
    lastName: patientRow.last_name ?? '',
    fullName: [patientRow.first_name, patientRow.middle_name, patientRow.last_name].filter(Boolean).join(' '),
    dateOfBirth: patientRow.date_of_birth ?? '',
    sex: patientRow.sex ?? '',
    contactNumber: patientRow.contact_number ?? undefined,
    email: patientRow.contact_email ?? undefined,
    userId: patientRow.user_id ?? undefined,
    hasAccount: !!patientRow.user_id,
    isGuest: patientRow.is_guest ?? false,
  };
}

export function rowToDetail(row: Record<string, unknown>): PatientDetail {
  const patientRow = withCamelCaseFallback(row);
  return {
    id: patientRow.id,
    patientCode: patientRow.patient_code ?? '',
    firstName: patientRow.first_name ?? '',
    middleName: patientRow.middle_name ?? undefined,
    lastName: patientRow.last_name ?? '',
    dateOfBirth: patientRow.date_of_birth ?? '',
    sex: patientRow.sex ?? '',
    civilStatus: patientRow.civil_status ?? undefined,
    address: patientRow.address ?? undefined,
    city: patientRow.city ?? undefined,
    zipCode: patientRow.zip_code ?? undefined,
    contactNumber: patientRow.contact_number ?? undefined,
    email: patientRow.contact_email ?? undefined,
    emergencyContactName: patientRow.emergency_contact_name ?? undefined,
    emergencyContactNumber: patientRow.emergency_contact_number ?? undefined,
    emergencyContactRelationship: patientRow.emergency_contact_relationship ?? undefined,
    bloodType: patientRow.blood_type ?? undefined,
    philHealthNumber: patientRow.phil_health_number ?? undefined,
    hmoProvider: patientRow.hmo_provider ?? undefined,
    hmoCardNumber: patientRow.hmo_card_number ?? undefined,
    userId: patientRow.user_id ?? undefined,
    hasAccount: !!patientRow.user_id,
    isEmailVerified: false, isGuest: patientRow.is_guest ?? false,
    consentedAt: patientRow.consented_at ?? undefined, consentVersion: patientRow.consent_version ?? undefined,
  };
}
