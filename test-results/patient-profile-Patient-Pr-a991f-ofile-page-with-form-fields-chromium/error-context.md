# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: patient\profile.spec.ts >> Patient Profile >> Navigation: opens profile page with form fields
- Location: tests\patient\profile.spec.ts:6:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('form[formGroup]')
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('form[formGroup]')

```

```yaml
- complementary:
  - text: Patient Portal
  - navigation:
    - link "Dashboard":
      - /url: /patient/dashboard
      - img:
        - img
      - text: Dashboard
    - link "Doctors":
      - /url: /patient/doctors
      - img:
        - img
      - text: Doctors
    - link "Bookings":
      - /url: /patient/bookings
      - img:
        - img
      - text: Bookings
    - text: Records
    - link "My Documents":
      - /url: /patient/documents
      - img:
        - img
      - text: My Documents
    - link "My Lab Results":
      - /url: /patient/lab-results
      - img:
        - img
      - text: My Lab Results
    - link "Medical Records":
      - /url: /patient/medical-records
      - img:
        - img
      - text: Medical Records
    - link "Prescriptions":
      - /url: /patient/prescriptions
      - img:
        - img
      - text: Prescriptions
    - link "Vaccinations":
      - /url: /patient/vaccinations
      - img
      - text: Vaccinations
    - link "Profile":
      - /url: /patient/profile
      - img:
        - img
      - text: Profile
  - button "Open Patient profile": JC Juan dela Cruz Patient Account
  - button "Logout":
    - img:
      - img
    - text: Logout
- banner:
  - text: Patient Portal
  - heading "Dashboard" [level=1]
  - button "6":
    - img:
      - img
    - text: "6"
  - button "Account options": JC Juan dela Cruz Front Desk
  - button "Log out": Logout
- main:
  - text: Patient Documents Download all clinical records One PDF with completed consultations, prescriptions, and follow-up notes.
  - link "My Documents":
    - /url: /patient/documents
  - link "My Lab Results":
    - /url: /patient/lab-results
  - button "Download All Clinical Records"
  - heading "My Profile" [level=2]
  - paragraph: Keep your patient details up to date.
  - text: Personal Information First Name
  - textbox "First Name":
    - /placeholder: ""
    - text: Juan
  - text: Middle Name
  - textbox "Middle Name":
    - /placeholder: ""
  - text: Last Name
  - textbox "Last Name":
    - /placeholder: ""
    - text: Dela Cruz
  - text: Birthdate
  - textbox "Birthdate":
    - /placeholder: ""
    - text: 1995-05-12
  - button "Male, Sex":
    - text: Male, Sex
    - button "Sex, Male"
  - button "Single, Civil Status":
    - text: Single, Civil Status
    - button "Civil Status, Single"
  - button "O+, Blood Type":
    - text: O+, Blood Type
    - button "Blood Type, O+"
  - text: Contact Number
  - textbox "Contact Number":
    - /placeholder: ""
    - text: "09171234567"
  - text: Email
  - textbox "Email" [disabled]:
    - /placeholder: ""
    - text: patient@gavino.clinic
  - text: Address Address
  - textbox "Address":
    - /placeholder: ""
    - text: 123 Sample Street
  - text: City
  - textbox "City":
    - /placeholder: ""
    - text: Manila
  - text: Zip Code
  - textbox "Zip Code":
    - /placeholder: ""
    - text: "1000"
  - text: Emergency Contact Name
  - textbox "Name":
    - /placeholder: ""
    - text: Maria Dela Cruz
  - text: Relationship
  - textbox "Relationship":
    - /placeholder: ""
    - text: Mother
  - text: Contact Number
  - textbox "Contact Number":
    - /placeholder: ""
    - text: "09170000000"
  - text: HMO / PhilHealth HMO Provider
  - textbox "HMO Provider":
    - /placeholder: ""
  - text: HMO Number
  - textbox "HMO Number":
    - /placeholder: ""
  - text: PhilHealth Number
  - textbox "PhilHealth Number":
    - /placeholder: ""
  - button "Save Changes"
  - text: Patient Consent Submitted
  - paragraph: Consent submitted
  - paragraph: "Version: v1.0"
  - paragraph: "Date: May 28, 2026, 6:55:31 AM"
  - text: Change Password Current Password
  - textbox "Current Password":
    - /placeholder: ""
  - text: New Password
  - textbox "New Password":
    - /placeholder: ""
  - text: Confirm Password
  - textbox "Confirm Password":
    - /placeholder: ""
  - button "Update Password"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { loginAsPatient, openPatientRoute, mockApiFailure, mockApiResponse, expectNoPersistentLoading, SELECTORS, ROUTES } from './patient.fixtures';
  3  | 
  4  | test.describe('Patient Profile', () => {
  5  | 
  6  |   test('Navigation: opens profile page with form fields', async ({ page }) => {
  7  |     await loginAsPatient(page);
  8  |     const responses = await openPatientRoute(page, ROUTES.profile);
  9  | 
  10 |     await expect(page.locator(SELECTORS.pageTitle)).toContainText('My Profile', { timeout: 10000 });
  11 |     // Form may load after patient API call — wait for it
> 12 |     await expect(page.locator(SELECTORS.profileForm)).toBeVisible({ timeout: 15000 });
     |                                                       ^ Error: expect(locator).toBeVisible() failed
  13 |     await expectNoPersistentLoading(page);
  14 | 
  15 |     expect(responses.some(r => r.url.includes('/api/patients/me') && r.status === 200)).toBeTruthy();
  16 |   });
  17 | 
  18 |   test('Populated State: form fields contain real patient data from API', async ({ page }) => {
  19 |     await loginAsPatient(page);
  20 |     await openPatientRoute(page, ROUTES.profile);
  21 | 
  22 |     // First name should be populated
  23 |     const firstNameInput = page.locator('ion-input[formControlName="firstName"] input');
  24 |     await expect(firstNameInput).toBeVisible({ timeout: 5000 });
  25 |     const value = await firstNameInput.inputValue().catch(() => '');
  26 |     // Should either have a value or show a fallback
  27 |     expect(typeof value).toBe('string');
  28 |   });
  29 | 
  30 |   test('API Failure: shows warning banner when patient profile fails', async ({ page }) => {
  31 |     await loginAsPatient(page);
  32 |     await mockApiFailure(page, 'patients/me');
  33 |     await page.goto(ROUTES.profile);
  34 |     await page.waitForLoadState('networkidle');
  35 |     await page.waitForTimeout(3000);
  36 | 
  37 |     await expect(page.locator(SELECTORS.warningBanner)).toBeVisible({ timeout: 10000 });
  38 |     await expectNoPersistentLoading(page);
  39 |   });
  40 | });
  41 | 
```