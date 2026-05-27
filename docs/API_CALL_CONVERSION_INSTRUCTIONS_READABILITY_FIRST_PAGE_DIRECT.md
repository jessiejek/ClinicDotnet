# Angular API Call Page-Direct ApiService Conversion Instructions

Generated from the uploaded project zip. This is a **per API call** conversion plan. It traces each backend call and gives instructions to convert the project to the requested **Page/Component → ApiService** style. Feature services such as `AuthService`, `BookingService`, and other domain services must not remain as API-call wrappers after a selected flow is migrated.

## Executive summary

- Total TypeScript files scanned: **234**
- Total backend `ApiService` calls found: **178**
- API method counts: `delete`=8, `get`=90, `getBlob`=7, `patch`=6, `post`=36, `postFormData`=4, `put`=27
- Location counts: `page/component`=24, `service`=154
- Direct `HttpClient`/`fetch` usage outside `ApiService`: **0 issue(s) after ignoring Angular provider config**
- Page/component direct calls already present: **24**
- Moveable thin service wrappers found: **17**
- Calls requiring review before flattening: **73**

### Most API-heavy files

- `src/app/core/services/booking.service.ts` — 26 call(s)
- `src/app/core/services/medical-records.service.ts` — 19 call(s)
- `src/app/core/services/patient-documents.service.ts` — 17 call(s)
- `src/app/portals/doctor/services/doctor.service.ts` — 13 call(s)
- `src/app/core/services/auth.service.ts` — 10 call(s)
- `src/app/portals/public/services/public.service.ts` — 10 call(s)
- `src/app/portals/admin/services/admin-doctors.service.ts` — 9 call(s)
- `src/app/portals/admin/services/admin-services.service.ts` — 8 call(s)
- `src/app/core/services/patient-state.service.ts` — 6 call(s)
- `src/app/portals/admin/announcements/announcements.page.ts` — 5 call(s)
- `src/app/portals/admin/dashboard/dashboard.page.ts` — 5 call(s)
- `src/app/portals/admin/services/admin-patients.service.ts` — 5 call(s)
- `src/app/portals/admin/booking-detail/booking-detail.page.ts` — 4 call(s)
- `src/app/portals/admin/services/admin-reports.service.ts` — 4 call(s)
- `src/app/portals/admin/staff/staff.page.ts` — 4 call(s)

## Target architecture requested

Use one centralized `ApiService` as the only HTTP wrapper, and make pages/components call it directly.

The target flow is:

```txt
Page / Component
→ ApiService
→ Angular HttpClient
→ Backend
```

The old flow below is **not** the target and must be removed one selected flow at a time:

```txt
Page / Component
→ AuthService / BookingService / FeatureService
→ ApiService
→ Angular HttpClient
→ Backend
```

Pages/components should inject `ApiService` directly and call `get/post/put/patch/delete/getBlob/postBlob/postFormData/putFormData` from the page/component code.

```ts
private readonly apiService = inject(ApiService);

this.apiService.get<ResponseDto>('endpoint').subscribe(...);
this.apiService.post<ResponseDto>('endpoint', payload).subscribe(...);
```

Feature services may remain only for **non-HTTP state/helper behavior** after migration, for example current-user state, token storage helpers, formatting helpers, or shared pure mapping helpers. They must not remain as the place that performs backend HTTP calls for the migrated flow.


## Readability-first rule for this project

This project was built quickly and the priority now is **traceability and readability**. The architecture should make it easy to answer this question during debugging:

```txt
Which page triggered this backend call, what endpoint did it call, what payload did it send, and what did it do with the response?
```

Use this rule as the main architecture decision:

```txt
Simple page-owned API = Page calls ApiService directly.

Shared business/state/session logic = helper service, but helper service must NOT call backend.

Only ApiService talks to backend.
```

### What this means

- A page/component that owns the screen action should perform the backend request directly through `ApiService`.
- A helper/state/session/mapper service may still exist, but it must be non-HTTP only.
- Do not keep backend calls hidden inside `AuthService`, `BookingService`, `DoctorService`, `PatientService`, or other feature services for migrated flows.
- If token storage, user state, formatting, mapping, or reusable validation is needed, call a helper after the direct `ApiService` response.
- The goal is not textbook enterprise layering. The goal is a readable codebase where API behavior is easy to trace from the page.

### Correct target example

```ts
private readonly apiService = inject(ApiService);
private readonly tokenService = inject(TokenService);
private readonly authState = inject(AuthStateService);

this.apiService.post<AuthSessionDto>('auth/login', payload).pipe(
  tap((res) => this.tokenService.storeTokens(res.accessToken, res.refreshToken)),
  tap((res) => this.authState.setUser(res.user)),
  finalize(() => this.loading = false)
).subscribe({
  next: () => this.router.navigateByUrl('/patient/dashboard'),
  error: (error) => this.errorMessage = extractApiErrorMessage(error, 'Login failed.')
});
```

### Wrong target example

```ts
this.authService.login(email, password).subscribe(...);
```

The wrong example still hides the backend call inside `AuthService`, which makes tracing harder.

## Non-negotiable conversion rules

- Do **not** change endpoint strings unless the current import/path is broken.
- Do **not** change payload shape, DTO names, return type, response mapping, loading logic, `finalize`, `catchError`, `tap`, `map`, or side effects.
- Do **not** add NgRx.
- The final target is direct page/component calls to `ApiService`. Do **not** keep `Page → FeatureService → ApiService` as the final result for a migrated flow.
- For simple page-owned API calls, the page/component must call `ApiService` directly.
- For shared business/state/session logic, use helper/state services only if those services do **not** call the backend.
- Only `ApiService` may talk to the backend. No migrated feature service should remain an HTTP wrapper.
- If a feature-service method has state/session/mapping/cache logic, preserve that behavior by moving the required logic to the page/component or to a **non-HTTP helper/state method**. The actual backend call must still be performed directly from the page/component.
- If a flow is too risky to flatten safely, stop and report it as `BLOCKED`; do not silently keep the old service wrapper.
- Keep `HttpClient` only inside `src/app/core/services/api.service.ts`.
- Standardize injected variable name to `apiService` when touching a file. Existing `api` works, but your preferred readable style is `apiService`.
- Blob calls must use `getBlob` / `postBlob`; uploads must use `postFormData` / `putFormData`. Do not force `application/json` headers for `FormData`.

## Direct-page migration rule

This file must be interpreted in **DIRECT PAGE MODE**.

For every selected service/page section, the AI agent must aim to remove the feature-service API call path and make the page/component call `ApiService` directly.

The agent must not finish a section by saying “kept in service because it is stateful” unless it marks the flow as `BLOCKED` and explains exactly what behavior prevents safe migration.

When a service method currently contains important behavior, the agent must preserve it by one of these approaches:

1. Copy the exact `pipe(...)` chain into the page/component call.
2. Move pure mapping code into a helper function with no HTTP call.
3. Move state-only behavior into a state service method with no HTTP call.
4. Keep token/session storage helpers if needed, but the page/component must still call `ApiService` directly for the backend request.

### Auth-specific rule

For auth, the target must not be:

```txt
LoginPage/RegisterPage/AuthCallbackPage/ProfilePage
→ AuthService or AuthStateService
→ ApiService
```

The target must be:

```txt
LoginPage/RegisterPage/AuthCallbackPage/ProfilePage
→ ApiService directly
→ optional token/state helper after response
```

Example target style:

```ts
this.apiService.post<AuthSessionDto>('auth/login', payload).pipe(
  tap((res) => this.storeTokensOrCallHelper(res)),
  map((res) => this.toAuthUserOrCallHelper(res.user, res.accessToken))
).subscribe(...);
```

`AuthService` must not remain the class that performs `auth/login`, `auth/register`, `auth/me`, `auth/change-password`, `auth/logout`, `auth/google`, or `auth/facebook` API calls after the selected auth flow is migrated.

## Mandatory execution mode — one service/file section at a time

This instruction file is intentionally grouped by top-level code section:

```txt
## `src/app/core/services/auth.service.ts`
## `src/app/core/services/booking.service.ts`
## `src/app/portals/admin/announcements/announcements.page.ts`
...
```

Treat each `## \`path\`` section as one checkpoint unit.

### Hard stop rule

The AI agent must process only **one** selected section per run.

Do **not** convert the whole project in one run.

Do **not** continue automatically to the next service/page section.

Do **not** batch multiple services together.

Do **not** make broad cleanup changes outside the selected section.

The user must explicitly approve before the next service/page section is processed.

### Required execution flow per run

1. Ask for or use the selected section path.
2. Read only that selected section from this file.
3. Inspect the selected source file and its detected direct callers.
4. Apply only the instructions for API calls inside that selected section.
5. Edit only:
   - the selected source file
   - direct caller files listed under that selected section, only when required
   - imports needed for those exact changes
6. Preserve all endpoint strings, payloads, DTOs, response mapping, loading logic, error handling, `tap`, `map`, `switchMap`, `catchError`, `finalize`, and subscription behavior.
7. Run build/typecheck.
8. Print the service checkpoint report.
9. Stop.

### Service checkpoint report format

After each service/page section, the AI agent must print this exact report format:

```txt
SERVICE CHECKPOINT: [selected service/page file path]

Changed files:
- [file path]
- [file path]

API calls processed:
- API CALL #: [number]
  Method: [GET/POST/PUT/PATCH/DELETE/BLOB/FORM_DATA]
  Endpoint: [endpoint]
  Status: MIGRATED / BLOCKED / UNUSED / ALREADY OK
  Final call path: PAGE → APISERVICE / BLOCKED / ALREADY PAGE-DIRECT

What changed:
- [short summary]

What was preserved:
- endpoint strings
- payload shape
- DTO/response type
- response mapping
- loading behavior
- error handling
- RxJS pipe behavior
- subscribe/firstValueFrom behavior
- UI behavior

Build/typecheck result:
PASS / FAIL

Remaining risks:
- [risk list or none]

STOP HERE.
Do not continue to the next service/page section until the user approves.
```

### Status meaning

- **MIGRATED** means the backend call was safely converted to direct `ApiService` usage in the page/component or selected direct caller. The final call path must be `Page/Component → ApiService`, not `Page/Component → FeatureService → ApiService`.
- **BLOCKED** means the flow could not be safely converted without risking behavior; the report must explain the exact blocker and stop.
- **UNUSED** means no reachable caller was found after checking the codebase; do not edit unused code unless the user approves cleanup.
- **ALREADY OK** means the call already lives directly in a page/component and calls `ApiService` without a feature-service API wrapper.


## Direct HTTP / fetch findings outside ApiService

- None found. The project already avoids direct `HttpClient` usage outside the central wrapper.

## ApiService import path items to verify first

- `src/app/portals/admin/services/doctor-state.service.ts:12` imports ApiService from `./api.service`, but that relative path did not resolve in the scanned zip. Fix this before API migration.

## Recommended implementation phases

Use these phases, but execute them **one selected service/page section at a time**.

Do not treat a phase as permission to edit many files at once.

1. **Safety pass per selected section**
   - Fix broken `ApiService` imports only inside the selected section and direct callers needed for that section.
   - Rename `private readonly api = inject(ApiService)` to `apiService` only in files touched for the selected section.
   - Do not change behavior.

2. **Direct page migration for selected section**
   - For each API call in the selected service section, find the actual page/component caller.
   - Move the backend call to the page/component so the page/component injects and calls `ApiService` directly.
   - Preserve endpoint, payload, DTOs, mapping, `pipe(...)`, loading, error handling, `finalize`, toasts, navigation, and `subscribe`/`firstValueFrom` behavior exactly.

3. **State/helper preservation**
   - If the old service method handled tokens, current user state, cache updates, or mapping, preserve that behavior as helper/state-only code.
   - The helper/state code must not perform the backend HTTP call.
   - The actual backend call must remain in the page/component.

4. **Unknown callers**
   - If the scan says `SERVICE-ONLY / UNKNOWN CALLERS`, search the codebase for the method name.
   - If a page/component caller is found, migrate that caller to direct `ApiService`.
   - If only internal service callers are found, trace upward until the page/component entry point is found, then migrate from that entry point.
   - If no reachable caller exists, mark `UNUSED`; do not delete unless the user approves cleanup.

5. **Blob/FormData calls**
   - The page/component must call `apiService.getBlob`, `apiService.postBlob`, `apiService.postFormData`, or `apiService.putFormData` directly.
   - Do not force `application/json` headers for `FormData`.
   - Preserve file naming, download behavior, upload progress/loading behavior, and error handling exactly.

6. **Build/typecheck checkpoint**
   - Run `npm run build` or `ionic build` after each selected section.
   - Print the required service checkpoint report.
   - Stop and wait for user approval.

## Copy-paste implementation prompt for the AI agent

Use this prompt when implementing one section:

```txt
You are working on an Angular/Ionic project.

Read docs/API_CALL_MIGRATION_INSTRUCTIONS.md.

Target architecture:
Page/Component -> ApiService -> HttpClient -> Backend

Do NOT implement Page/Component -> FeatureService -> ApiService.

Process only this selected section now:
[PASTE ONE SECTION PATH HERE]

Rules:
- Edit only the selected section file and its direct callers needed for that section.
- The page/component must inject ApiService directly for the migrated backend call.
- Do not leave the migrated backend call inside AuthService, BookingService, DoctorService, PatientService, AdminService, or any other feature service.
- Feature/state services may remain only for non-HTTP helper/state behavior.
- Preserve endpoint strings exactly.
- Preserve payload shape exactly.
- Preserve DTOs and response types exactly.
- Preserve response mapping exactly.
- Preserve loading behavior exactly.
- Preserve error handling exactly.
- Preserve tap/map/switchMap/catchError/finalize behavior exactly.
- Preserve subscribe/firstValueFrom behavior exactly.
- Do not add NgRx.
- Do not refactor UI.
- Do not change business logic.

For auth flows:
- Login/Register/Callback/Profile pages must call ApiService directly.
- AuthService/AuthStateService must not perform backend API calls for migrated auth flows.
- Token/session/state behavior must still be preserved after the direct ApiService response.

After finishing this selected section:
1. Run build/typecheck.
2. Print the checkpoint report.
3. STOP.
4. Wait for my approval before continuing.

Checkpoint report format:

SERVICE CHECKPOINT: [selected service/page file path]

Changed files:
- [file path]

API calls processed:
- API CALL #: [number]
  Method: [GET/POST/PUT/PATCH/DELETE/BLOB/FORM_DATA]
  Endpoint: [endpoint]
  Status: MIGRATED / BLOCKED / UNUSED / ALREADY OK

What changed:
- [summary]

What was preserved:
- endpoint strings
- payload shape
- DTO/response type
- response mapping
- loading behavior
- error handling
- RxJS pipe behavior
- subscribe/firstValueFrom behavior
- UI behavior

Build/typecheck result:
PASS / FAIL

Remaining risks:
- [risk list or none]

STOP HERE. DO NOT CONTINUE TO THE NEXT SERVICE/PAGE SECTION.
```

# Per API call instructions


## `src/app/core/services/auth.service.ts`

**Auth migration target:** login/register/session/profile pages must call `ApiService` directly. `AuthService` and `AuthStateService` may keep non-HTTP token/state/helper behavior only, but they must not remain the API-call layer for migrated auth endpoints.


### API CALL 1 — `AuthService.login` line 38

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `AuthSessionDto`
- **Endpoint expression:** `'auth/login'`
- **Payload/params expression:** `{
      email: email.trim(),
      password
    }`
- **Risk flags:** `RxJS pipe mapping/error/finalize, state/session side effect`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/core/services/auth-state.service.ts:48` — `AuthStateService.login` calls `return this.authService.login(email, password).pipe(`

**Current API call:**
```ts
return this.api.post<AuthSessionDto>('auth/login', {
      email: email.trim(),
      password
    }).pipe(
      tap((res) => this.storeTokens(res.accessToken, res.refreshToken)),
      map((res) => this.toAuthUser(res.user, res.accessToken))
    );
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<AuthSessionDto>('auth/login', {
      email: email.trim(),
      password
    })
```

### API CALL 2 — `AuthService.registerPatient` line 80

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `AuthSessionDto`
- **Endpoint expression:** `'auth/register'`
- **Payload/params expression:** `{
      firstName: firstName.trim(),
      middleName: middleName?.trim() || undefined,
      lastName: lastName.trim(),
      email: email.trim(),
      password
    }`
- **Risk flags:** `RxJS pipe mapping/error/finalize, state/session side effect`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/core/services/auth-state.service.ts:96` — `AuthStateService.register` calls `return this.authService.registerPatient(firstName, middleName, lastName, email, password).pipe(`

**Current API call:**
```ts
return this.api.post<AuthSessionDto>('auth/register', {
      firstName: firstName.trim(),
      middleName: middleName?.trim() || undefined,
      lastName: lastName.trim(),
      email: email.trim(),
      password
    }).pipe(
      tap((res) => this.storeTokens(res.accessToken, res.refreshToken)),
      map((res) => this.toAuthUser(res.user, res.accessToken))
    );
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<AuthSessionDto>('auth/register', {
      firstName: firstName.trim(),
      middleName: middleName?.trim() || undefined,
      lastName: lastName.trim(),
      email: email.trim(),
      password
    })
```

### API CALL 3 — `AuthService.refreshTokens` line 98

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `RefreshTokenDto`
- **Endpoint expression:** `'auth/refresh-token'`
- **Payload/params expression:** `{ refreshToken }`
- **Risk flags:** `RxJS pipe mapping/error/finalize, state/session side effect`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.post<RefreshTokenDto>('auth/refresh-token', { refreshToken }).pipe(
      tap((res) => this.storeTokens(res.accessToken, res.refreshToken)),
      map(() => void 0),
      catchError((error: unknown) => {
        this.clearSession();
        return throwError(() => error);
      })
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<RefreshTokenDto>('auth/refresh-token', { refreshToken })
```

### API CALL 4 — `AuthService.restoreSession` line 115

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `AuthUserDto`
- **Endpoint expression:** `'auth/me'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/auth/callback/auth-callback.page.ts:49` — `AuthCallbackPage.if` calls `const user = await firstValueFrom(this.authService.restoreSession());`
  - `src/app/auth/callback/auth-callback.page.ts:58` — `AuthCallbackPage.(top-level/class field)` calls `const user2 = await firstValueFrom(this.authService.restoreSession());`
  - `src/app/core/services/auth-state.service.ts:30` — `AuthStateService.restoreSession` calls `return this.authService.restoreSession().pipe(`

**Current API call:**
```ts
return this.api.get<AuthUserDto>('auth/me').pipe(
      map((user) => this.toAuthUser(user, this.tokenService.getAccessToken() ?? undefined)),
      catchError((error: unknown) => {
        this.clearSession();
        return throwError(() => error);
      })
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<AuthUserDto>('auth/me')
```

### API CALL 5 — `AuthService.setPassword` line 129

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `AuthUserDto`
- **Endpoint expression:** `'auth/set-password'`
- **Payload/params expression:** `{ newPassword, confirmPassword }`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/core/services/auth-state.service.ts:110` — `AuthStateService.setPassword` calls `return this.authService.setPassword(newPassword, confirmPassword).pipe(`

**Current API call:**
```ts
return this.api.post<AuthUserDto>('auth/set-password', { newPassword, confirmPassword }).pipe(
      map((user) => this.toAuthUser(user, this.tokenService.getAccessToken() ?? undefined))
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<AuthUserDto>('auth/set-password', { newPassword, confirmPassword })
```

### API CALL 6 — `AuthService.changePassword` line 135

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `void`
- **Endpoint expression:** `'auth/change-password'`
- **Payload/params expression:** `{
      currentPassword,
      newPassword,
      confirmPassword
    }`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/doctor/profile/doctor-profile.page.ts:460` — `DoctorProfilePage.changePassword` calls `this.authService.changePassword(currentPassword, newPassword, confirmPassword)`
  - `src/app/portals/patient/profile/patient-profile.page.ts:512` — `PatientProfilePage.changePassword` calls `this.authService.changePassword(currentPassword, newPassword, confirmPassword)`
  - `src/app/portals/staff/profile/staff-profile.page.ts:181` — `StaffProfilePage.changePassword` calls `this.authService.changePassword(currentPassword, newPassword, confirmPassword)`

**Current API call:**
```ts
return this.api.post<void>('auth/change-password', {
      currentPassword,
      newPassword,
      confirmPassword
    }).pipe(
      tap(() => {
        // Password changed successfully on server
      })
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<void>('auth/change-password', {
      currentPassword,
      newPassword,
      confirmPassword
    })
```

### API CALL 7 — `AuthService.(top-level/class field)` line 147

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `AuthUserDto`
- **Endpoint expression:** `'auth/me'`
- **Payload/params expression:** `payload`
- **Risk flags:** `RxJS pipe mapping/error/finalize, state/session side effect`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.put<AuthUserDto>('auth/me', payload).pipe(
      tap((user) => {
        const current = this.getStoredUser();
        if (current) {
          this.persistUser({
            ...current,
            fullName: user.fullName,
            avatarUrl: user.avatarUrl ?? undefined,
            phoneNumber: user.phoneNumber ?? undefined
          });
        }
      })
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put<AuthUserDto>('auth/me', payload)
```

### API CALL 8 — `AuthService.logout` line 165

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'auth/logout'`
- **Payload/params expression:** `{ refreshToken }`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/core/services/auth-state.service.ts:121` — `AuthStateService.logout` calls `this.authService.logout();`

**Current API call:**
```ts
? this.api.post('auth/logout', { refreshToken }).pipe(catchError(() => of(void 0)))
      : of(void 0);
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post('auth/logout', { refreshToken })
```

### API CALL 9 — `AuthService.(top-level/class field)` line 309

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `AuthSessionDto`
- **Endpoint expression:** `'auth/google'`
- **Payload/params expression:** `{
      provider: 'Google',
      idToken: tokens.idToken ?? null,
      accessToken: tokens.accessToken
    }`
- **Risk flags:** `RxJS pipe mapping/error/finalize, state/session side effect`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.post<AuthSessionDto>('auth/google', {
      provider: 'Google',
      idToken: tokens.idToken ?? null,
      accessToken: tokens.accessToken
    }).pipe(
      tap((res) => this.storeTokens(res.accessToken, res.refreshToken)),
      map((res) => this.toAuthUser(res.user, res.accessToken))
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<AuthSessionDto>('auth/google', {
      provider: 'Google',
      idToken: tokens.idToken ?? null,
      accessToken: tokens.accessToken
    })
```

### API CALL 10 — `AuthService.postFacebookToken` line 347

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `AuthSessionDto`
- **Endpoint expression:** `'auth/facebook'`
- **Payload/params expression:** `{
      accessToken,
      userId
    }`
- **Risk flags:** `RxJS pipe mapping/error/finalize, state/session side effect`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.post<AuthSessionDto>('auth/facebook', {
      accessToken,
      userId
    }).pipe(
      tap((res) => this.storeTokens(res.accessToken, res.refreshToken)),
      map((res) => this.toAuthUser(res.user, res.accessToken))
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<AuthSessionDto>('auth/facebook', {
      accessToken,
      userId
    })
```

## `src/app/core/services/booking.service.ts`


### API CALL 11 — `BookingService.getPendingVerification` line 395

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'bookings/pending-verification'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize, state/session side effect`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.apiService.get<any[]>('bookings/pending-verification').pipe(
        map((rows) => ((rows ?? []) as Record<string, unknown>[])
          .map((row) => this.normalizeBooking(mapBookingViewRow(row)))
          .filter((b): b is Booking => Boolean(b))),
        tap((bookings) => this.mergeBookings(bookings)),
        catchError((error: unknown) =>
          throwError(() => new Error(extractApiErrorMessage(error, 'Failed to load pending verifications.')))
        ),
        finalize(() => this.endLoading())
      );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('bookings/pending-verification')
```

### API CALL 12 — `BookingService.getDoctorPatients` line 431

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'bookings/doctor/patients'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/doctor/patients/doctor-patients.page.ts:121` — `DoctorPatientsPage.loadPatients` calls `this.bookingService.getDoctorPatients().pipe(`

**Current API call:**
```ts
return this.apiService.get<any[]>('bookings/doctor/patients').pipe(
        map((rows) => {
          const records = (rows ?? []) as Record<string, unknown>[];
          const patientMap = new Map<string, Record<string, unknown>>();
          for (const row of records) {
            const patientId = trimOptionalString(row['patient_id']);
            if (!patientId || patientMap.has(patientId)) continue;
            patientMap.set(patientId, row);
          }
          return Array.from(patientMap.values()).map((row) => ({
            patientId: trimOptionalString(row['patient_id']) ?? '',
            patientName: trimOptionalString(row['patient_name']) ?? 'Patient',
            patientCode: trimOptionalString(row['patient_code']),
            latestDate: normalizeDateOnly(row['appointment_date']),
            latestTime: normalizeTimeOnly(row['slot_start_time']),
            services: normalizeBookingServices(row['services']).map((s) => s.name).filter(Boolean).join(', '),
            status: normalizeBookingStatus(row['booking_status']) ?? 'Pending',
            queueNumber: normalizeNullableNumber(row['queue_number']),
            latestBookingId: trimOptionalString(row['booking_id']) ?? ''
          }));
        }),
        catchError((err) => {
          console.warn('Failed to load doctor patients from API:', err);
          return of([]);
        }),
        finalize(() => this.endLoading())
      );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('bookings/doctor/patients')
```

### API CALL 13 — `BookingService.getMyBookings` line 466

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'bookings?page=' + currentPage + '&pageSize=' + safePageSize`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize, state/session side effect`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/portals/patient/bookings/patient-bookings.page.ts:393` — `PatientBookingsPage.loadBookings` calls `this.bookingService`
  - `src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:256` — `PatientMediaPanelComponent.if` calls `: this.bookingService.getMyBookings(1, 100).pipe(`

**Current API call:**
```ts
return this.apiService.get<any>('bookings?page=' + currentPage + '&pageSize=' + safePageSize).pipe(
        map((data: any) => {
          const rows = (data?.items ?? data ?? []) as Record<string, unknown>[];
          const items = rows
            .map((row) => this.normalizeBooking(mapBookingViewRow(row)))
            .filter((booking): booking is Booking => Boolean(booking));
          return { items, totalCount: data?.totalCount ?? items.length, page: currentPage, pageSize: safePageSize };
        }),
        tap((result) => this.mergeBookings(result.items)),
        catchError((error: unknown) =>
          throwError(() => new Error(extractApiErrorMessage(error, 'Failed to load bookings from API.')))
        ),
        finalize(() => this.endLoading())
      );
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('bookings?page=' + currentPage + '&pageSize=' + safePageSize)
```

### API CALL 14 — `BookingService.getDoctorTodaySummary` line 486

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'bookings/doctor/today'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize, state/session side effect`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/portals/doctor/appointments/doctor-appointments.page.ts:365` — `DoctorAppointmentsPage.loadSummary` calls `this.bookingService.getDoctorTodaySummary().subscribe({`
  - `src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:259` — `DoctorDashboardPage.loadDashboard` calls `summary: this.bookingService.getDoctorTodaySummary().pipe(catchError(() => of(null))),`

**Current API call:**
```ts
return this.apiService.get<any[]>('bookings/doctor/today').pipe(
        switchMap((todayData) => {
          const queue = ((todayData ?? []) as Record<string, unknown>[])
            .map((row) => this.normalizeBooking(mapBookingViewRow(row)))
            .filter((booking): booking is Booking => Boolean(booking));
          return this.apiService.get<any>('bookings/doctor/today-summary').pipe(
            map((summaryResponse) => {
              const row = (summaryResponse ?? {}) as Record<string, unknown>;
              return {
                bookedToday: normalizeNumber(row['today_total'], queue.length),
                checkedIn: normalizeNumber(row['checked_in_count']),
                waiting: normalizeNumber(row['checked_in_count']) + normalizeNumber(row['in_progress_count']),
                completed: normalizeNumber(row['completed_count']),
                noShow: normalizeNumber(row['no_show_count']),
                cancelled: 0,
                items: queue
              } as DoctorTodaySummary;
            })
          );
        }),
        tap((summary) => this.mergeBookings(summary.items)),
        catchError((error: unknown) =>
          throwError(() => new Error(extractApiErrorMessage(error, 'Failed to load today summary from API.')))
        ),
        finalize(() => this.endLoading())
      );
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('bookings/doctor/today')
```

### API CALL 15 — `BookingService.getDoctorTodaySummary` line 491

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'bookings/doctor/today-summary'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/doctor/appointments/doctor-appointments.page.ts:365` — `DoctorAppointmentsPage.loadSummary` calls `this.bookingService.getDoctorTodaySummary().subscribe({`
  - `src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:259` — `DoctorDashboardPage.loadDashboard` calls `summary: this.bookingService.getDoctorTodaySummary().pipe(catchError(() => of(null))),`

**Current API call:**
```ts
return this.apiService.get<any>('bookings/doctor/today-summary').pipe(
            map((summaryResponse) => {
              const row = (summaryResponse ?? {}) as Record<string, unknown>;
              return {
                bookedToday: normalizeNumber(row['today_total'], queue.length),
                checkedIn: normalizeNumber(row['checked_in_count']),
                waiting: normalizeNumber(row['checked_in_count']) + normalizeNumber(row['in_progress_count']),
                completed: normalizeNumber(row['completed_count']),
                noShow: normalizeNumber(row['no_show_count']),
                cancelled: 0,
                items: queue
              } as DoctorTodaySummary;
            })
          );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('bookings/doctor/today-summary')
```

### API CALL 16 — `BookingService.(top-level/class field)` line 520

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'bookings/staff/today?page=' + page + '&pageSize=' + pageSize`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize, state/session side effect`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.apiService.get<any>('bookings/staff/today?page=' + page + '&pageSize=' + pageSize).pipe(
        map((data: any) => {
          const rows = (data?.items ?? []) as Record<string, unknown>[];
          const items = rows
            .map((row) => this.normalizeBooking(mapBookingViewRow(row)))
            .filter((booking): booking is Booking => Boolean(booking));
          return { items, totalCount: data?.totalCount ?? items.length, page, pageSize };
        }),
        tap((result) => this.mergeBookings(result.items)),
        catchError((error: unknown) =>
          throwError(() => new Error(extractApiErrorMessage(error, 'Failed to load today bookings from API.')))
        ),
        finalize(() => this.endLoading())
      );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('bookings/staff/today?page=' + page + '&pageSize=' + pageSize)
```

### API CALL 17 — `BookingService.(top-level/class field)` line 542

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'bookings/staff/all?page=' + page + '&pageSize=' + pageSize`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize, state/session side effect`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.apiService.get<any>('bookings/staff/all?page=' + page + '&pageSize=' + pageSize).pipe(
        map((data: any) => {
          const rows = (data?.items ?? []) as Record<string, unknown>[];
          const items = rows
            .map((row) => this.normalizeBooking(mapBookingViewRow(row)))
            .filter((booking): booking is Booking => Boolean(booking));
          return { items, totalCount: data?.totalCount ?? items.length, page, pageSize };
        }),
        tap((result) => this.mergeBookings(result.items)),
        catchError((error: unknown) =>
          throwError(() => new Error(extractApiErrorMessage(error, 'Failed to load bookings from API.')))
        ),
        finalize(() => this.endLoading())
      );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('bookings/staff/all?page=' + page + '&pageSize=' + pageSize)
```

### API CALL 18 — `BookingService.getStaffForPayment` line 564

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'bookings/staff/for-payment?page=' + currentPage + '&pageSize=' + safePageSize`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/staff/payments/staff-payments.page.ts:464` — `StaffPaymentsPage.loadQueue` calls `this.bookingService.getStaffForPayment(this.currentPage, this.pageSize).subscribe({`

**Current API call:**
```ts
return this.apiService.get<any>('bookings/staff/for-payment?page=' + currentPage + '&pageSize=' + safePageSize).pipe(
        map((data: any) => {
          const rows = (data?.items ?? data ?? []) as Record<string, unknown>[];
          const items = rows
            .map((row) => this.normalizeStaffForPaymentViewRow(row))
            .filter((item): item is StaffForPaymentItem => Boolean(item));
          return { items, totalCount: data?.totalCount ?? items.length, page: currentPage, pageSize: safePageSize };
        }),
        catchError((error: unknown) =>
          throwError(() => new Error(extractApiErrorMessage(error, 'Failed to load payment queue from API.')))
        ),
        finalize(() => this.endLoading())
      );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('bookings/staff/for-payment?page=' + currentPage + '&pageSize=' + safePageSize)
```

### API CALL 19 — `BookingService.submitProof` line 594

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `any`
- **Endpoint expression:** ``bookings/${bookingId}/proof``
- **Payload/params expression:** `dto`
- **Risk flags:** `RxJS pipe mapping/error/finalize, dynamic endpoint`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.apiService.post<any>(`bookings/${bookingId}/proof`, dto).pipe(
        map((row) => this.normalizeBooking(mapBookingViewRow(row as Record<string, unknown>)) as Booking),
        tap((booking) => this.upsertBooking(booking)),
        catchError((error: unknown) =>
          throwError(() => new Error(extractApiErrorMessage(error, 'Failed to submit proof.')))
        ),
        finalize(() => this.endLoading())
      );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<any>(`bookings/${bookingId}/proof`, dto)
```

### API CALL 20 — `BookingService.fetchConsultationRecordByBookingId` line 662

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'bookings/' + bookingId + '/consultation-record'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/doctor/consultation/doctor-consultation.page.ts:2745` — `DoctorConsultationPage.loadConsultationRecord$` calls `return this.bookingService.fetchConsultationRecordByBookingId(booking.id).pipe(catchError(() => of(null)));`
  - `src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:485` — `DoctorPatientDetailPage.loadPrescriptionsFromConsultationRecords` calls `this.bookingService.fetchConsultationRecordByBookingId(bookingId).pipe(`

**Current API call:**
```ts
return this.apiService.get<any>('bookings/' + bookingId + '/consultation-record').pipe(
        map((data) => {
          if (!data) {
            return {
              bookingId,
              patientId: this.getBookingById(bookingId)?.patientId ?? '',
              doctorId: this.getBookingById(bookingId)?.doctorId ?? '',
              bookingStatus: this.getBookingById(bookingId)?.status ?? 'CheckedIn',
              diagnoses: [],
              labOrders: []
            } as ConsultationRecordResponse;
          }
          return mapConsultationRecordRow(data as Record<string, unknown>);
        }),
        catchError((error: unknown) =>
          throwError(() => new Error(extractApiErrorMessage(error, 'Failed to load consultation record from API.')))
        ),
        finalize(() => this.endLoading())
      );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('bookings/' + bookingId + '/consultation-record')
```

### API CALL 21 — `BookingService.updateConsultationRecord` line 690

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `any`
- **Endpoint expression:** `'bookings/' + bookingId + '/consultation-record'`
- **Payload/params expression:** `dto`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/doctor/consultation/doctor-consultation.page.ts:1508` — `DoctorConsultationPage.saveDraft` calls `await firstValueFrom(this.bookingService.updateConsultationRecord(vm.booking.id, payload));`
  - `src/app/portals/doctor/consultation/doctor-consultation.page.ts:1586` — `DoctorConsultationPage.syncQueuedDrafts` calls `this.bookingService.updateConsultationRecord(this.currentVm!.booking.id, this.buildConsultationRecordUpdatePayload())`
  - `src/app/portals/doctor/consultation/doctor-consultation.page.ts:1771` — `DoctorConsultationPage.saveAmendment` calls `await firstValueFrom(this.bookingService.updateConsultationRecord(vm.booking.id, payload));`

**Current API call:**
```ts
return this.apiService.post<any>('bookings/' + bookingId + '/consultation-record', dto).pipe(
        switchMap(() => this.apiService.get<any>('bookings/' + bookingId + '/consultation-record')),
        map((data) => data ? mapConsultationRecordRow(data as Record<string, unknown>) : {
          bookingId,
          patientId: this.getBookingById(bookingId)?.patientId ?? '',
          doctorId: this.getBookingById(bookingId)?.doctorId ?? '',
          bookingStatus: this.getBookingById(bookingId)?.status ?? 'CheckedIn',
          diagnoses: [],
          labOrders: []
        } as ConsultationRecordResponse),
        catchError((error: unknown) =>
          throwError(() => new Error(extractApiErrorMessage(error, 'Failed to save consultation amendment.')))
        ),
        finalize(() => this.endLoading())
      );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<any>('bookings/' + bookingId + '/consultation-record', dto)
```

### API CALL 22 — `BookingService.updateConsultationRecord` line 691

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'bookings/' + bookingId + '/consultation-record'`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **DIRECT PAGE MIGRATION — page/component must inject ApiService and call endpoint directly.**
- **Detected caller trace:**
  - `src/app/portals/doctor/consultation/doctor-consultation.page.ts:1508` — `DoctorConsultationPage.saveDraft` calls `await firstValueFrom(this.bookingService.updateConsultationRecord(vm.booking.id, payload));`
  - `src/app/portals/doctor/consultation/doctor-consultation.page.ts:1586` — `DoctorConsultationPage.syncQueuedDrafts` calls `this.bookingService.updateConsultationRecord(this.currentVm!.booking.id, this.buildConsultationRecordUpdatePayload())`
  - `src/app/portals/doctor/consultation/doctor-consultation.page.ts:1771` — `DoctorConsultationPage.saveAmendment` calls `await firstValueFrom(this.bookingService.updateConsultationRecord(vm.booking.id, payload));`

**Current API call:**
```ts
switchMap(() => this.apiService.get<any>('bookings/' + bookingId + '/consultation-record')),
        map((data) => data ? mapConsultationRecordRow(data as Record<string, unknown>) : {
          bookingId,
          patientId: this.getBookingById(bookingId)?.patientId ?? '',
          doctorId: this.getBookingById(bookingId)?.doctorId ?? '',
          bookingStatus: this.getBookingById(bookingId)?.status ?? 'CheckedIn',
          diagnoses: [],
          labOrders: []
        } as ConsultationRecordResponse),
        catchError((error: unknown) =>
          throwError(() => new Error(extractApiErrorMessage(error, 'Failed to save consultation amendment.')))
        ),
        finalize(() => this.endLoading())
      );
```

**Instruction for AI agent:**
- For every detected caller above, inject `ApiService` directly into that page/component and replace the feature-service API call path with the target `apiService` call below.
- After all callers for the selected section are migrated and compile passes, remove only unused API wrapper methods/imports. Do not delete non-HTTP helper/state code if still used.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('bookings/' + bookingId + '/consultation-record')
```

### API CALL 23 — `BookingService.cancelBooking` line 720

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `patch`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'bookings/' + bookingId + '/cancel'`
- **Payload/params expression:** `{ reason }`
- **Risk flags:** `none`
- **Conversion mode:** **DIRECT PAGE MIGRATION — page/component must inject ApiService and call endpoint directly.**
- **Detected caller trace:**
  - `src/app/portals/admin/booking-detail/booking-detail.page.ts:376` — `BookingDetailPage.switch` calls `await this.bookingService.cancelBooking(bookingId, reason || 'Rejected by admin');`
  - `src/app/portals/admin/booking-detail/booking-detail.page.ts:392` — `BookingDetailPage.switch` calls `await this.bookingService.cancelBooking(bookingId, reason || 'Cancelled by admin');`
  - `src/app/portals/admin/services/admin-bookings.service.ts:24` — `AdminBookingsService.switch` calls `this.bookingService.cancelBooking(id, 'Updated booking status.');`
  - `src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:306` — `PatientBookingDetailPage.confirmCancel` calls `this.bookingService.cancelBooking(this.booking.id, 'Cancelled by patient.');`
  - `src/app/portals/patient/bookings/patient-bookings.page.ts:299` — `PatientBookingsPage.confirmCancel` calls `this.bookingService.cancelBooking(this.bookingToCancel.id, 'Cancelled by patient.');`

**Current API call:**
```ts
this.apiService.patch('bookings/' + bookingId + '/cancel', { reason })
    );
```

**Instruction for AI agent:**
- For every detected caller above, inject `ApiService` directly into that page/component and replace the feature-service API call path with the target `apiService` call below.
- After all callers for the selected section are migrated and compile passes, remove only unused API wrapper methods/imports. Do not delete non-HTTP helper/state code if still used.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.patch('bookings/' + bookingId + '/cancel', { reason })
```

### API CALL 24 — `BookingService.getReceipt` line 827

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'payments/' + paymentId + '/receipt'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:335` — `PatientBookingDetailPage.openReceipt` calls `this.receiptData = await firstValueFrom(this.bookingService.getReceipt(this.booking.payment.id));`
  - `src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:680` — `StaffBookingDetailPage.if` calls `this.bookingService.getReceipt(paymentId).subscribe({`

**Current API call:**
```ts
return this.apiService.get<any>('payments/' + paymentId + '/receipt').pipe(
        switchMap((paymentData) => {
          const payment = paymentData ? this.normalizePayment(mapPaymentRow(paymentData as Record<string, unknown>)) : undefined;
          if (!payment) {
            return of(this.buildEmptyReceipt());
          }
          const bookingId = payment.bookingId;
          return (bookingId ? this.apiService.get<any>('bookings/' + bookingId) : of(undefined)).pipe(
            map((bookingData) => {
              const booking = bookingData ? this.normalizeBooking(mapBookingViewRow(bookingData as Record<string, unknown>)) : undefined;
              return this.buildReceiptFromPaymentAndBooking(payment, booking);
            })
          );
        }),
        catchError((error: unknown) =>
          throwError(() => new Error(extractApiErrorMessage(error, 'Failed to load receipt.')))
        ),
        finalize(() => this.endLoading())
      );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('payments/' + paymentId + '/receipt')
```

### API CALL 25 — `BookingService.getReceipt` line 834

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'bookings/' + bookingId`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/patient/booking-detail/patient-booking-detail.page.ts:335` — `PatientBookingDetailPage.openReceipt` calls `this.receiptData = await firstValueFrom(this.bookingService.getReceipt(this.booking.payment.id));`
  - `src/app/portals/staff/booking-detail/staff-booking-detail.page.ts:680` — `StaffBookingDetailPage.if` calls `this.bookingService.getReceipt(paymentId).subscribe({`

**Current API call:**
```ts
return (bookingId ? this.apiService.get<any>('bookings/' + bookingId) : of(undefined)).pipe(
            map((bookingData) => {
              const booking = bookingData ? this.normalizeBooking(mapBookingViewRow(bookingData as Record<string, unknown>)) : undefined;
              return this.buildReceiptFromPaymentAndBooking(payment, booking);
            })
          );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('bookings/' + bookingId)
```

### API CALL 26 — `BookingService.requestBookings` line 939

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'bookings'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize, state/session side effect`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.apiService.get<any>('bookings').pipe(
        map((data: any) => {
          const rows = (data?.items ?? data ?? []) as Record<string, unknown>[];
          return rows
            .map((row) => this.normalizeBooking(row))
            .filter((b): b is Booking => Boolean(b));
        }),
        tap((bookings) => {
          if (replaceCache) {
            this.replaceBookings(bookings);
          } else {
            this.mergeBookings(bookings);
          }
        }),
        catchError((error: unknown) => {
          console.error('Failed to load bookings.', error);
          return of([]);
        }),
        finalize(() => this.endLoading())
      );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('bookings')
```

### API CALL 27 — `BookingService.requestPaymentByBookingId` line 1046

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'payments/booking/' + bookingId`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.apiService.get<any>('payments/booking/' + bookingId).pipe(
        map((data) => data ? this.normalizePayment(mapPaymentRow(data as Record<string, unknown>)) : undefined),
        catchError((error: unknown) => {
          console.error(`Failed to load payment for booking ${bookingId} from API.`, error);
          return of(undefined);
        }),
        finalize(() => this.endLoading())
      );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('payments/booking/' + bookingId)
```

### API CALL 28 — `BookingService.createBooking$` line 1068

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `any`
- **Endpoint expression:** `'bookings'`
- **Payload/params expression:** `{}`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.apiService.post<any>('bookings', {}).pipe(
      switchMap((bookResult) => {
        const createdRow = (bookResult ?? undefined) as Record<string, unknown> | undefined;
        const bookingId = trimOptionalString(createdRow?.['booking_id']);

        if (!bookingId) {
          return throwError(() => new Error('API create_booking did not return a booking id.'));
        }

        return this.fetchBookingByIdObservable(bookingId).pipe(
          map((fetched) => {
            if (fetched) return fetched;

            const fallback = this.normalizeBooking({
              bookingId,
              doctorId: dto.doctorId,
              serviceId: resolvedServiceIds[0],
              serviceIds: resolvedServiceIds,
              appointmentDate: dto.appointmentDate,
              slotStartTime: normalizeTime(dto.slotStartTime),
              slotEndTime: normalizeTime(dto.slotEndTime),
              status: trimOptionalString(createdRow?.['status']) ?? 'Confirmed',
              paymentStatus: trimOptionalString(createdRow?.['payment_status']) ?? 'Unpaid',
              paymentMode: 'PayAtClinic',
              queueNumber: normalizeNullableNumber(createdRow?.['queue_number']),
              totalFee: 0,
              consultationFeeSnapshot: 0,
              serviceFeeSnapshot: 0,
              isWalkIn: false,
              createdAt: new Date().toISOString(),
              notes: dto.notes
            });

            if (!fallback) {
              throw new Error('Unable to normalize created booking.');
            }

            return fallback;
          })
        );
// ...statement truncated in report; preserve full source in codebase.
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<any>('bookings', {})
```

### API CALL 29 — `BookingService.createWalkInBooking$` line 1115

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'bookings/' + booking.id`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
this.apiService.get<any>('bookings/' + booking.id).pipe(
          map((refreshed) => (refreshed as Booking) ?? { ...booking, isWalkIn: true, paymentMode: dto.paymentMode ?? 'PayAtClinic' })
        )
      )
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('bookings/' + booking.id)
```

### API CALL 30 — `BookingService.runBookingAction$` line 1132

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `patch`
- **Response type/generic:** `Booking`
- **Endpoint expression:** `endpoint`
- **Payload/params expression:** `{}`
- **Risk flags:** `none`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.apiService.patch<Booking>(endpoint, {});
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.patch<Booking>(endpoint, {})
```

### API CALL 31 — `BookingService.saveConsultationAndComplete$` line 1137

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `patch`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'bookings/' + bookingId + '/doctor-complete'`
- **Payload/params expression:** `dto`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
? this.apiService.patch('bookings/' + bookingId + '/doctor-complete', dto).pipe(
          switchMap(() => this.apiService.patch('payments/' + bookingId + '/waive', {
            reason: dto.professionalFeeWaivedReason ?? 'Professional fee waived.'
          }))
        )
      : this.apiService.patch('bookings/' + bookingId + '/doctor-complete', dto);
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.patch('bookings/' + bookingId + '/doctor-complete', dto)
```

### API CALL 32 — `BookingService.saveConsultationAndComplete$` line 1138

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `patch`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'payments/' + bookingId + '/waive'`
- **Payload/params expression:** `{
            reason: dto.professionalFeeWaivedReason ?? 'Professional fee waived.'
          }`
- **Risk flags:** `none`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
switchMap(() => this.apiService.patch('payments/' + bookingId + '/waive', {
            reason: dto.professionalFeeWaivedReason ?? 'Professional fee waived.'
          }))
        )
      : this.apiService.patch('bookings/' + bookingId + '/doctor-complete', dto);
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.patch('payments/' + bookingId + '/waive', {
            reason: dto.professionalFeeWaivedReason ?? 'Professional fee waived.'
          })
```

### API CALL 33 — `BookingService.saveConsultationAndComplete$` line 1142

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `patch`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'bookings/' + bookingId + '/doctor-complete'`
- **Payload/params expression:** `dto`
- **Risk flags:** `none`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
: this.apiService.patch('bookings/' + bookingId + '/doctor-complete', dto);
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.patch('bookings/' + bookingId + '/doctor-complete', dto)
```

### API CALL 34 — `BookingService.recordPayment$` line 1156

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `patch`
- **Response type/generic:** `ReceiptData`
- **Endpoint expression:** ``payments/${bookingId}/confirm``
- **Payload/params expression:** `{
          p_booking_id: bookingId,
          p_amount: dto.amountReceived,
          p_payment_method: dto.paymentMethod,
          p_reference_number: trimOptionalString(dto.referenceNumber) ?? null,
          p_or_number: null
        }`
- **Risk flags:** `RxJS pipe mapping/error/finalize, dynamic endpoint`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
this.apiService.patch<ReceiptData>(`payments/${bookingId}/confirm`, {
          p_booking_id: bookingId,
          p_amount: dto.amountReceived,
          p_payment_method: dto.paymentMethod,
          p_reference_number: trimOptionalString(dto.referenceNumber) ?? null,
          p_or_number: null
        })
      ),
      switchMap((payResult) => {
        const row = (payResult ?? {}) as unknown as Record<string, unknown>;
        return this.fetchBookingByIdObservable(id).pipe(
          map((booking) => buildReceiptFromBooking(booking, dto, row))
        );
      })
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.patch<ReceiptData>(`payments/${bookingId}/confirm`, {
          p_booking_id: bookingId,
          p_amount: dto.amountReceived,
          p_payment_method: dto.paymentMethod,
          p_reference_number: trimOptionalString(dto.referenceNumber) ?? null,
          p_or_number: null
        })
```

### API CALL 35 — `BookingService.resolveBookingIdForPaymentObservable` line 1179

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'bookings/' + id + '/payment'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.apiService.get<any>('bookings/' + id + '/payment').pipe(
      map((byPaymentId) => {
        const record = byPaymentId as Record<string, unknown> | undefined;
        return record && record['bookingId'] ? String(record['bookingId']) : id;
      })
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('bookings/' + id + '/payment')
```

### API CALL 36 — `BookingService.fetchBookingByIdObservable` line 1188

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'bookings/' + id`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.apiService.get<any>('bookings/' + id).pipe(
      map((data) => data ? this.normalizeBooking(mapBookingViewRow(data as Record<string, unknown>)) : undefined)
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('bookings/' + id)
```

## `src/app/core/services/clinic-settings.service.ts`


### API CALL 37 — `ClinicSettingsService.getSettings` line 21

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'settings'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize, state/session side effect`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/app.component.ts:22` — `AppComponent.ngOnInit` calls `void this.clinicSettingsService.getSettings().subscribe({ error: () => undefined });`
  - `src/app/portals/admin/settings/settings.page.ts:246` — `SettingsPage.ngOnInit` calls `this.clinicSettingsService`

**Current API call:**
```ts
return this.apiService.get<any>('settings').pipe(
      map((data) => data ? this.mapRow(data) : this.settingsSubject.value),
      tap((settings) => this.settingsSubject.next(settings)),
      finalize(() => this.loadingSubject.next(false))
    );
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('settings')
```

### API CALL 38 — `ClinicSettingsService.updateSettings` line 30

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `any`
- **Endpoint expression:** `'settings'`
- **Payload/params expression:** `data`
- **Risk flags:** `RxJS pipe mapping/error/finalize, state/session side effect`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/portals/admin/settings/settings.page.ts:315` — `SettingsPage.saveSettings` calls `this.clinicSettingsService.updateSettings(this.cloneSettings(this.draft));`

**Current API call:**
```ts
return this.apiService.put<any>('settings', data).pipe(
      map((updated) => updated ? this.mapRow(updated) : this.settingsSubject.value),
      tap((settings) => this.settingsSubject.next(settings)),
      finalize(() => this.loadingSubject.next(false))
    );
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put<any>('settings', data)
```

## `src/app/core/services/doctor-state.service.ts`


### API CALL 39 — `DoctorStateService.loadDoctorsFromApi` line 69

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'doctors'`
- **Payload/params expression:** `none`
- **Risk flags:** `state/session side effect`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/portals/patient/dashboard/patient-dashboard.page.ts:330` — `PatientDashboardPage.ngOnInit` calls `this.doctorState.loadDoctorsFromApi();`
  - `src/app/portals/staff/doctor-status/doctor-status.page.ts:88` — `DoctorStatusPage.loadDoctors` calls `this.doctorState.loadDoctorsFromApi();`

**Current API call:**
```ts
this.api.get<any[]>('doctors').subscribe({
      next: (data: any[]) => {
        try {
          const doctors: Doctor[] = (data ?? [])
            .map((row: any) => this.normalizeDoctor(row))
            .filter((d: Doctor | undefined): d is Doctor => !!d && !!d.id);
          this.doctorsSubject.next(doctors);
        } finally {
          this.loadingSubject.next(false);
        }
      },
      error: (err: any) => {
        console.warn('Failed to load doctors:', err);
        this.loadingSubject.next(false);
      }
    });
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('doctors')
```

### API CALL 40 — `DoctorStateService.loadTodayDoctorStatus` line 89

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `DoctorDayStatus`
- **Endpoint expression:** `'doctor-day-status/' + doctorUserId`
- **Payload/params expression:** `none`
- **Risk flags:** `state/session side effect`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
this.api.get<DoctorDayStatus>('doctor-day-status/' + doctorUserId).subscribe({
      next: (status: DoctorDayStatus | null) => {
        this.todayStatusSubject.next(status);
      },
      error: (err: any) => {
        console.warn('Failed to load today status:', err);
      }
    });
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<DoctorDayStatus>('doctor-day-status/' + doctorUserId)
```

### API CALL 41 — `DoctorStateService.updateDayStatus` line 101

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `DoctorDayStatus`
- **Endpoint expression:** `'doctor-day-status/' + doctorUserId + '/status'`
- **Payload/params expression:** `status`
- **Risk flags:** `state/session side effect`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
this.api.post<DoctorDayStatus>('doctor-day-status/' + doctorUserId + '/status', status).subscribe({
      next: (updated: DoctorDayStatus) => {
        this.todayStatusSubject.next(updated);
      },
      error: (err: any) => {
        console.warn('Failed to update day status:', err);
      }
    });
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<DoctorDayStatus>('doctor-day-status/' + doctorUserId + '/status', status)
```

## `src/app/core/services/drug-interaction.service.ts`


### API CALL 42 — `DrugInteractionService.checkAllergyConflict` line 57

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `UnknownAllergyCheckResponse`
- **Endpoint expression:** `'/drug-interactions/allergy-check'`
- **Payload/params expression:** `{
        drugName,
        allergies
      }`
- **Risk flags:** `RxJS pipe mapping/error/finalize, state/session side effect`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/portals/doctor/components/prescription-form/prescription-form.component.ts:408` — `PrescriptionFormComponent.attemptSaveMedicine` calls `const localConflict = await firstValueFrom(this.interactionService.checkAllergyConflict(name, this.allergies)).catch(() => null);`

**Current API call:**
```ts
this.api.post<UnknownAllergyCheckResponse>('/drug-interactions/allergy-check', {
        drugName,
        allergies
      })
    ).pipe(
      map((response) => {
        const normalized = normalizeAllergyResponse(response);
        this.allergyCache.set(cacheKey, normalized);
        return normalized;
      }),
      catchError(() =>
        of<DrugAllergyConflict>({
          conflict: false,
          unavailable: true,
          source: 'api',
          message: 'Drug-allergy check unavailable - verify manually before prescribing'
        })
      )
    );
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<UnknownAllergyCheckResponse>('/drug-interactions/allergy-check', {
        drugName,
        allergies
      })
```

### API CALL 43 — `DrugInteractionService.checkDrugInteractions` line 100

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `UnknownInteractionCheckResponse`
- **Endpoint expression:** `'/drug-interactions/check'`
- **Payload/params expression:** `{
        drugs: items.map((item) => ({
          medicineName: item.medicineName,
          genericName: item.genericName ?? null,
          strength: item.strength ?? null,
          route: item.route ?? null,
          frequency: item.frequency ?? null
        }))
      }`
- **Risk flags:** `RxJS pipe mapping/error/finalize, state/session side effect`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/portals/doctor/components/prescription-form/prescription-form.component.ts:421` — `PrescriptionFormComponent.attemptSaveMedicine` calls `const warningState = await firstValueFrom(this.interactionService.checkDrugInteractions(nextItems)).catch(() => null);`
  - `src/app/portals/doctor/components/prescription-form/prescription-form.component.ts:548` — `PrescriptionFormComponent.refreshInteractionWarnings` calls `this.interactionService.checkDrugInteractions(this.medicines).subscribe((result) => {`

**Current API call:**
```ts
this.api.post<UnknownInteractionCheckResponse>('/drug-interactions/check', {
        drugs: items.map((item) => ({
          medicineName: item.medicineName,
          genericName: item.genericName ?? null,
          strength: item.strength ?? null,
          route: item.route ?? null,
          frequency: item.frequency ?? null
        }))
      })
    ).pipe(
      map((response) => {
        const result = normalizeInteractionResponse(response, items);
        this.interactionCache.set(cacheKey, result);
        return result;
      }),
      catchError(() =>
        of<DrugInteractionResult>({
          unavailable: true,
          warnings: [],
          source: 'api'
        })
      )
    );
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<UnknownInteractionCheckResponse>('/drug-interactions/check', {
        drugs: items.map((item) => ({
          medicineName: item.medicineName,
          genericName: item.genericName ?? null,
          strength: item.strength ?? null,
          route: item.route ?? null,
          frequency: item.frequency ?? null
        }))
      })
```

## `src/app/core/services/medical-records.service.ts`


### API CALL 44 — `MedicalRecordsService.getConsultationByBookingId` line 120

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'medical-records/consultations?patientId=' + bookingId`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.get<any[]>('medical-records/consultations?patientId=' + bookingId).pipe(
      map((rows) => {
        const items = (rows ?? []) as Record<string, unknown>[];
        return items.length > 0 ? mapConsultationRow(items[0]) : undefined;
      })
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('medical-records/consultations?patientId=' + bookingId)
```

### API CALL 45 — `MedicalRecordsService.getConsultationsByPatientId` line 129

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'medical-records/consultations?patientId=' + patientId`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/core/services/patient-clinical-history.service.ts:28` — `PatientClinicalHistoryService.getPatientClinicalHistory` calls `consultations: this.medicalRecords.getConsultationsByPatientId(patientId).pipe(catchError(() => of([] as Consultation[]))),`
  - `src/app/portals/admin/patient-detail/patient-detail.page.ts:199` — `PatientDetailPage.loadSupportingData` calls `this.medicalRecords.getConsultationsByPatientId(id).subscribe((consultations) => (this.consultations = consultations));`
  - `src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:337` — `DoctorPatientDetailPage.buildClinicalHistory` calls `consultations: this.medicalRecords.getConsultationsByPatientId(patientId),`
  - `src/app/portals/patient/dashboard/patient-dashboard.page.ts:279` — `PatientDashboardPage.(top-level/class field)` calls `this.medicalRecords.getConsultationsByPatientId(patient.id),`

**Current API call:**
```ts
return this.api.get<any[]>('medical-records/consultations?patientId=' + patientId).pipe(
      map((rows) => ((rows ?? []) as Record<string, unknown>[]).map(mapConsultationRow))
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('medical-records/consultations?patientId=' + patientId)
```

### API CALL 46 — `MedicalRecordsService.getPrescriptionsByPatientId` line 135

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'medical-records/prescriptions?patientId=' + patientId`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/core/services/patient-clinical-history.service.ts:29` — `PatientClinicalHistoryService.getPatientClinicalHistory` calls `prescriptions: this.medicalRecords.getPrescriptionsByPatientId(patientId).pipe(catchError(() => of([] as Prescription[]))),`
  - `src/app/portals/admin/patient-detail/patient-detail.page.ts:200` — `PatientDetailPage.loadSupportingData` calls `this.medicalRecords.getPrescriptionsByPatientId(id).subscribe((prescriptions) => (this.prescriptions = prescriptions));`
  - `src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:338` — `DoctorPatientDetailPage.buildClinicalHistory` calls `prescriptions: this.medicalRecords.getPrescriptionsByPatientId(patientId),`
  - `src/app/portals/patient/dashboard/patient-dashboard.page.ts:280` — `PatientDashboardPage.(top-level/class field)` calls `this.medicalRecords.getPrescriptionsByPatientId(patient.id),`

**Current API call:**
```ts
return this.api.get<any[]>('medical-records/prescriptions?patientId=' + patientId).pipe(
      map((rows) => ((rows ?? []) as Record<string, unknown>[]).map(mapPrescriptionRow))
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('medical-records/prescriptions?patientId=' + patientId)
```

### API CALL 47 — `MedicalRecordsService.getAllergiesByPatientId` line 141

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'medical-records/allergies?patientId=' + patientId`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/admin/patient-detail/patient-detail.page.ts:201` — `PatientDetailPage.loadSupportingData` calls `this.medicalRecords.getAllergiesByPatientId(id).subscribe((allergies) => (this.allergies = allergies));`

**Current API call:**
```ts
return this.api.get<any[]>('medical-records/allergies?patientId=' + patientId).pipe(
      map((rows) => ((rows ?? []) as Record<string, unknown>[]).map(mapAllergyRow))
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('medical-records/allergies?patientId=' + patientId)
```

### API CALL 48 — `MedicalRecordsService.getLabRequestsByPatientId` line 147

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'medical-records/lab-orders?patientId=' + patientId`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.get<any[]>('medical-records/lab-orders?patientId=' + patientId).pipe(
      map((rows) => ((rows ?? []) as Record<string, unknown>[]).map(mapLabOrderRow))
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('medical-records/lab-orders?patientId=' + patientId)
```

### API CALL 49 — `MedicalRecordsService.getLabResultsByPatientId` line 153

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'medical-records/lab-results?patientId=' + patientId`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/core/services/patient-clinical-history.service.ts:30` — `PatientClinicalHistoryService.getPatientClinicalHistory` calls `labResults: this.medicalRecords.getLabResultsByPatientId(patientId).pipe(catchError(() => of([] as LabResult[]))),`
  - `src/app/portals/admin/patient-detail/patient-detail.page.ts:202` — `PatientDetailPage.loadSupportingData` calls `this.medicalRecords.getLabResultsByPatientId(id).subscribe((labResults) => (this.labResults = labResults));`
  - `src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:339` — `DoctorPatientDetailPage.buildClinicalHistory` calls `labResults: this.medicalRecords.getLabResultsByPatientId(patientId),`

**Current API call:**
```ts
return this.api.get<any[]>('medical-records/lab-results?patientId=' + patientId).pipe(
      map((rows) => ((rows ?? []) as Record<string, unknown>[]).map(mapLabResultViewRow))
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('medical-records/lab-results?patientId=' + patientId)
```

### API CALL 50 — `MedicalRecordsService.getVaccinationsByPatientId` line 159

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'medical-records/vaccinations?patientId=' + patientId`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/core/services/patient-clinical-history.service.ts:31` — `PatientClinicalHistoryService.getPatientClinicalHistory` calls `vaccinations: this.medicalRecords.getVaccinationsByPatientId(patientId).pipe(catchError(() => of([] as VaccinationRecord[]))),`
  - `src/app/portals/admin/patient-detail/patient-detail.page.ts:203` — `PatientDetailPage.loadSupportingData` calls `this.medicalRecords.getVaccinationsByPatientId(id).subscribe((vaccinations) => (this.vaccinations = vaccinations));`
  - `src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:340` — `DoctorPatientDetailPage.buildClinicalHistory` calls `vaccinations: this.medicalRecords.getVaccinationsByPatientId(patientId),`

**Current API call:**
```ts
return this.api.get<any[]>('medical-records/vaccinations?patientId=' + patientId).pipe(
      map((rows) => ((rows ?? []) as Record<string, unknown>[]).map(mapVaccinationRow))
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('medical-records/vaccinations?patientId=' + patientId)
```

### API CALL 51 — `MedicalRecordsService.getFollowUpsByPatientId` line 165

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'medical-records/follow-ups?patientId=' + patientId`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/core/services/patient-clinical-history.service.ts:32` — `PatientClinicalHistoryService.getPatientClinicalHistory` calls `followUps: this.medicalRecords.getFollowUpsByPatientId(patientId).pipe(catchError(() => of([] as FollowUp[])))`
  - `src/app/portals/admin/patient-detail/patient-detail.page.ts:204` — `PatientDetailPage.loadSupportingData` calls `this.medicalRecords.getFollowUpsByPatientId(id).subscribe((followUps) => (this.followUps = followUps));`
  - `src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts:341` — `DoctorPatientDetailPage.buildClinicalHistory` calls `followUps: this.medicalRecords.getFollowUpsByPatientId(patientId)`

**Current API call:**
```ts
return this.api.get<any[]>('medical-records/follow-ups?patientId=' + patientId).pipe(
      map((rows) => ((rows ?? []) as Record<string, unknown>[]).map(mapFollowUpRow))
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('medical-records/follow-ups?patientId=' + patientId)
```

### API CALL 52 — `MedicalRecordsService.createAllergy` line 173

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `any`
- **Endpoint expression:** `'medical-records/allergies'`
- **Payload/params expression:** `allergy`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.post<any>('medical-records/allergies', allergy).pipe(map(mapAllergyRow));
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<any>('medical-records/allergies', allergy)
```

### API CALL 53 — `MedicalRecordsService.updateAllergy` line 177

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `any`
- **Endpoint expression:** `'medical-records/allergies/' + id`
- **Payload/params expression:** `allergy`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.put<any>('medical-records/allergies/' + id, allergy).pipe(map(mapAllergyRow));
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put<any>('medical-records/allergies/' + id, allergy)
```

### API CALL 54 — `MedicalRecordsService.deleteAllergy` line 185

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `delete`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'medical-records/allergies/' + id`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.delete('medical-records/allergies/' + id);
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.delete('medical-records/allergies/' + id)
```

### API CALL 55 — `MedicalRecordsService.createLabResult` line 189

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `any`
- **Endpoint expression:** `'medical-records/lab-results'`
- **Payload/params expression:** `result`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.post<any>('medical-records/lab-results', result).pipe(map(mapLabResultViewRow));
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<any>('medical-records/lab-results', result)
```

### API CALL 56 — `MedicalRecordsService.deleteLabResult` line 197

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `delete`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'medical-records/lab-results/' + id`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.delete('medical-records/lab-results/' + id);
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.delete('medical-records/lab-results/' + id)
```

### API CALL 57 — `MedicalRecordsService.createVaccination` line 201

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `any`
- **Endpoint expression:** `'medical-records/vaccinations'`
- **Payload/params expression:** `record`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.post<any>('medical-records/vaccinations', record).pipe(map(mapVaccinationRow));
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<any>('medical-records/vaccinations', record)
```

### API CALL 58 — `MedicalRecordsService.updateVaccination` line 205

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `any`
- **Endpoint expression:** `'medical-records/vaccinations/' + id`
- **Payload/params expression:** `record`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.put<any>('medical-records/vaccinations/' + id, record).pipe(map(mapVaccinationRow));
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put<any>('medical-records/vaccinations/' + id, record)
```

### API CALL 59 — `MedicalRecordsService.deleteVaccination` line 213

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `delete`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'medical-records/vaccinations/' + id`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.delete('medical-records/vaccinations/' + id);
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.delete('medical-records/vaccinations/' + id)
```

### API CALL 60 — `MedicalRecordsService.createFollowUp` line 217

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `any`
- **Endpoint expression:** `'medical-records/follow-ups'`
- **Payload/params expression:** `followUp`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.post<any>('medical-records/follow-ups', followUp).pipe(map(mapFollowUpRow));
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<any>('medical-records/follow-ups', followUp)
```

### API CALL 61 — `MedicalRecordsService.updateFollowUp` line 221

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `any`
- **Endpoint expression:** `'medical-records/follow-ups/' + id`
- **Payload/params expression:** `followUp`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.put<any>('medical-records/follow-ups/' + id, followUp).pipe(map(mapFollowUpRow));
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put<any>('medical-records/follow-ups/' + id, followUp)
```

### API CALL 62 — `MedicalRecordsService.deleteFollowUp` line 225

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `delete`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'medical-records/follow-ups/' + id`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.delete('medical-records/follow-ups/' + id);
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.delete('medical-records/follow-ups/' + id)
```

## `src/app/core/services/notification.service.ts`


### API CALL 63 — `NotificationService.markRead` line 126

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** ``notifications/${id}/read``
- **Payload/params expression:** `{}`
- **Risk flags:** `dynamic endpoint`
- **Conversion mode:** **DIRECT PAGE MIGRATION — page/component must inject ApiService and call endpoint directly.**
- **Detected caller trace:**
  - `src/app/shared/components/notification-panel/notification-panel.component.ts:104` — `NotificationPanelComponent.openNotification` calls `this.notificationService.markRead(notification.id);`

**Current API call:**
```ts
this.apiService.put(`notifications/${id}/read`, {}).subscribe({
      error: (err) => console.warn('[NotificationService] Failed to mark notification as read:', err)
    });
```

**Instruction for AI agent:**
- For every detected caller above, inject `ApiService` directly into that page/component and replace the feature-service API call path with the target `apiService` call below.
- After all callers for the selected section are migrated and compile passes, remove only unused API wrapper methods/imports. Do not delete non-HTTP helper/state code if still used.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put(`notifications/${id}/read`, {})
```

### API CALL 64 — `NotificationService.markAllRead` line 140

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'notifications/read-all'`
- **Payload/params expression:** `{}`
- **Risk flags:** `none`
- **Conversion mode:** **DIRECT PAGE MIGRATION — page/component must inject ApiService and call endpoint directly.**
- **Detected caller trace:**
  - `src/app/shared/components/notification-panel/notification-panel.component.ts:100` — `NotificationPanelComponent.markAllRead` calls `this.notificationService.markAllRead(userId);`

**Current API call:**
```ts
this.apiService.put('notifications/read-all', {}).subscribe({
      error: (err) => console.warn('[NotificationService] Failed to mark all as read:', err)
    });
```

**Instruction for AI agent:**
- For every detected caller above, inject `ApiService` directly into that page/component and replace the feature-service API call path with the target `apiService` call below.
- After all callers for the selected section are migrated and compile passes, remove only unused API wrapper methods/imports. Do not delete non-HTTP helper/state code if still used.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put('notifications/read-all', {})
```

### API CALL 65 — `NotificationService.fetchNotifications` line 146

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `NotificationDto[]`
- **Endpoint expression:** `'notifications'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.apiService.get<NotificationDto[]>('notifications').pipe(
      map((data) => (data ?? []).map(dtoToNotification))
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<NotificationDto[]>('notifications')
```

## `src/app/core/services/patient-clinical-history.service.ts`


### API CALL 66 — `PatientClinicalHistoryService.getPatientClinicalHistory` line 25

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'patients/' + patientId`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/doctor/consultation/doctor-consultation.page.ts:941` — `DoctorConsultationPage.openPatientClinicalHistory` calls `this.patientClinicalHistoryService.getPatientClinicalHistory(vm.patient.id).pipe(take(1)).subscribe((history) => {`

**Current API call:**
```ts
patientRow: this.api.get<any>('patients/' + patientId).pipe(catchError(() => of(null))),
      bookingRows: this.api.get<any[]>('bookings?patientId=' + patientId + '&pageSize=50').pipe(catchError(() => of([]))),
      records: forkJoin({
        consultations: this.medicalRecords.getConsultationsByPatientId(patientId).pipe(catchError(() => of([] as Consultation[]))),
        prescriptions: this.medicalRecords.getPrescriptionsByPatientId(patientId).pipe(catchError(() => of([] as Prescription[]))),
        labResults: this.medicalRecords.getLabResultsByPatientId(patientId).pipe(catchError(() => of([] as LabResult[]))),
        vaccinations: this.medicalRecords.getVaccinationsByPatientId(patientId).pipe(catchError(() => of([] as VaccinationRecord[]))),
        followUps: this.medicalRecords.getFollowUpsByPatientId(patientId).pipe(catchError(() => of([] as FollowUp[])))
      })
    }).pipe(
      map(({ patientRow, bookingRows, records }) => {
        const patient: PatientClinicalHistoryPatientDto = {
          id: patientId,
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('patients/' + patientId)
```

### API CALL 67 — `PatientClinicalHistoryService.getPatientClinicalHistory` line 26

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'bookings?patientId=' + patientId + '&pageSize=50'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/doctor/consultation/doctor-consultation.page.ts:941` — `DoctorConsultationPage.openPatientClinicalHistory` calls `this.patientClinicalHistoryService.getPatientClinicalHistory(vm.patient.id).pipe(take(1)).subscribe((history) => {`

**Current API call:**
```ts
bookingRows: this.api.get<any[]>('bookings?patientId=' + patientId + '&pageSize=50').pipe(catchError(() => of([]))),
      records: forkJoin({
        consultations: this.medicalRecords.getConsultationsByPatientId(patientId).pipe(catchError(() => of([] as Consultation[]))),
        prescriptions: this.medicalRecords.getPrescriptionsByPatientId(patientId).pipe(catchError(() => of([] as Prescription[]))),
        labResults: this.medicalRecords.getLabResultsByPatientId(patientId).pipe(catchError(() => of([] as LabResult[]))),
        vaccinations: this.medicalRecords.getVaccinationsByPatientId(patientId).pipe(catchError(() => of([] as VaccinationRecord[]))),
        followUps: this.medicalRecords.getFollowUpsByPatientId(patientId).pipe(catchError(() => of([] as FollowUp[])))
      })
    }).pipe(
      map(({ patientRow, bookingRows, records }) => {
        const patient: PatientClinicalHistoryPatientDto = {
          id: patientId,
          patientCode: trimStr(patientRow?.patientCode) || patientId,
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('bookings?patientId=' + patientId + '&pageSize=50')
```

## `src/app/core/services/patient-documents.service.ts`


### API CALL 68 — `PatientDocumentsService.getPatientDocuments` line 16

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `PatientDocument[]`
- **Endpoint expression:** `endpoint`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **DIRECT PAGE MIGRATION — page/component must inject ApiService and call endpoint directly.**
- **Detected caller trace:**
  - `src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:611` — `PatientMediaPanelComponent.if` calls `? this.documentsService.getPatientDocuments(this.patientId, bookingFilter)`

**Current API call:**
```ts
return this.apiService.get<PatientDocument[]>(endpoint);
```

**Instruction for AI agent:**
- For every detected caller above, inject `ApiService` directly into that page/component and replace the feature-service API call path with the target `apiService` call below.
- After all callers for the selected section are migrated and compile passes, remove only unused API wrapper methods/imports. Do not delete non-HTTP helper/state code if still used.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<PatientDocument[]>(endpoint)
```

### API CALL 69 — `PatientDocumentsService.getPatientLabResults` line 22

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `PatientLabResult[]`
- **Endpoint expression:** `endpoint`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **DIRECT PAGE MIGRATION — page/component must inject ApiService and call endpoint directly.**
- **Detected caller trace:**
  - `src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:639` — `PatientMediaPanelComponent.loadRecords` calls `? this.documentsService.getPatientLabResults(this.patientId, bookingFilter)`

**Current API call:**
```ts
return this.apiService.get<PatientLabResult[]>(endpoint);
```

**Instruction for AI agent:**
- For every detected caller above, inject `ApiService` directly into that page/component and replace the feature-service API call path with the target `apiService` call below.
- After all callers for the selected section are migrated and compile passes, remove only unused API wrapper methods/imports. Do not delete non-HTTP helper/state code if still used.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<PatientLabResult[]>(endpoint)
```

### API CALL 70 — `PatientDocumentsService.getMyDocuments` line 28

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `PatientDocument[]`
- **Endpoint expression:** `endpoint`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **DIRECT PAGE MIGRATION — page/component must inject ApiService and call endpoint directly.**
- **Detected caller trace:**
  - `src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:612` — `PatientMediaPanelComponent.if` calls `: this.documentsService.getMyDocuments(bookingFilter);`

**Current API call:**
```ts
return this.apiService.get<PatientDocument[]>(endpoint);
```

**Instruction for AI agent:**
- For every detected caller above, inject `ApiService` directly into that page/component and replace the feature-service API call path with the target `apiService` call below.
- After all callers for the selected section are migrated and compile passes, remove only unused API wrapper methods/imports. Do not delete non-HTTP helper/state code if still used.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<PatientDocument[]>(endpoint)
```

### API CALL 71 — `PatientDocumentsService.getMyLabResults` line 34

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `PatientLabResult[]`
- **Endpoint expression:** `endpoint`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **DIRECT PAGE MIGRATION — page/component must inject ApiService and call endpoint directly.**
- **Detected caller trace:**
  - `src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:640` — `PatientMediaPanelComponent.loadRecords` calls `: this.documentsService.getMyLabResults(bookingFilter);`

**Current API call:**
```ts
return this.apiService.get<PatientLabResult[]>(endpoint);
```

**Instruction for AI agent:**
- For every detected caller above, inject `ApiService` directly into that page/component and replace the feature-service API call path with the target `apiService` call below.
- After all callers for the selected section are migrated and compile passes, remove only unused API wrapper methods/imports. Do not delete non-HTTP helper/state code if still used.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<PatientLabResult[]>(endpoint)
```

### API CALL 72 — `PatientDocumentsService.getMyMedicalRecords` line 38

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'medical-records/me'`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **DIRECT PAGE MIGRATION — page/component must inject ApiService and call endpoint directly.**
- **Detected caller trace:**
  - `src/app/portals/patient/medical-records/patient-medical-records.page.ts:155` — `PatientMedicalRecordsPage.loadRecords` calls `this.documents.getMyMedicalRecords().subscribe({`

**Current API call:**
```ts
return this.apiService.get<any[]>('medical-records/me');
```

**Instruction for AI agent:**
- For every detected caller above, inject `ApiService` directly into that page/component and replace the feature-service API call path with the target `apiService` call below.
- After all callers for the selected section are migrated and compile passes, remove only unused API wrapper methods/imports. Do not delete non-HTTP helper/state code if still used.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('medical-records/me')
```

### API CALL 73 — `PatientDocumentsService.getMyPrescriptions` line 42

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'prescriptions/me'`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **DIRECT PAGE MIGRATION — page/component must inject ApiService and call endpoint directly.**
- **Detected caller trace:**
  - `src/app/portals/patient/prescriptions/patient-prescriptions.page.ts:144` — `PatientPrescriptionsPage.loadPrescriptions` calls `this.documents.getMyPrescriptions().subscribe({`

**Current API call:**
```ts
return this.apiService.get<any[]>('prescriptions/me');
```

**Instruction for AI agent:**
- For every detected caller above, inject `ApiService` directly into that page/component and replace the feature-service API call path with the target `apiService` call below.
- After all callers for the selected section are migrated and compile passes, remove only unused API wrapper methods/imports. Do not delete non-HTTP helper/state code if still used.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('prescriptions/me')
```

### API CALL 74 — `PatientDocumentsService.uploadPatientDocument` line 49

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `postFormData`
- **Response type/generic:** `PatientDocument`
- **Endpoint expression:** ``patients/${patientId}/documents``
- **Payload/params expression:** `formData`
- **Risk flags:** `FormData upload, dynamic endpoint`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:504` — `PatientMediaPanelComponent.if` calls `? this.documentsService.uploadPatientDocument(this.patientId, request)`

**Current API call:**
```ts
return this.apiService.postFormData<PatientDocument>(`patients/${patientId}/documents`, formData);
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.postFormData<PatientDocument>(`patients/${patientId}/documents`, formData)
```

### API CALL 75 — `PatientDocumentsService.uploadPatientLabResult` line 58

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `postFormData`
- **Response type/generic:** `PatientLabResult`
- **Endpoint expression:** ``patients/${patientId}/lab-results``
- **Payload/params expression:** `formData`
- **Risk flags:** `FormData upload, dynamic endpoint`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:523` — `PatientMediaPanelComponent.upload` calls `? this.documentsService.uploadPatientLabResult(this.patientId, request)`

**Current API call:**
```ts
return this.apiService.postFormData<PatientLabResult>(`patients/${patientId}/lab-results`, formData);
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.postFormData<PatientLabResult>(`patients/${patientId}/lab-results`, formData)
```

### API CALL 76 — `PatientDocumentsService.uploadMyDocument` line 63

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `postFormData`
- **Response type/generic:** `PatientDocument`
- **Endpoint expression:** `'patients/me/documents'`
- **Payload/params expression:** `formData`
- **Risk flags:** `FormData upload`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:505` — `PatientMediaPanelComponent.if` calls `: this.documentsService.uploadMyDocument(request);`

**Current API call:**
```ts
return this.apiService.postFormData<PatientDocument>('patients/me/documents', formData);
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.postFormData<PatientDocument>('patients/me/documents', formData)
```

### API CALL 77 — `PatientDocumentsService.uploadMyLabResult` line 72

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `postFormData`
- **Response type/generic:** `PatientLabResult`
- **Endpoint expression:** `'patients/me/lab-results'`
- **Payload/params expression:** `formData`
- **Risk flags:** `FormData upload`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:524` — `PatientMediaPanelComponent.upload` calls `: this.documentsService.uploadMyLabResult(request);`

**Current API call:**
```ts
return this.apiService.postFormData<PatientLabResult>('patients/me/lab-results', formData);
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.postFormData<PatientLabResult>('patients/me/lab-results', formData)
```

### API CALL 78 — `PatientDocumentsService.downloadAllClinicalRecordsPdf` line 78

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `getBlob`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'patient-documents/me/all.pdf'`
- **Payload/params expression:** `none`
- **Risk flags:** `blob/download response`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/portals/patient/components/patient-layout/patient-layout.component.ts:153` — `PatientLayoutComponent.downloadAllClinicalRecords` calls `this.patientDocuments.downloadAllClinicalRecordsPdf().subscribe({`
  - `src/app/portals/patient/medical-records/patient-medical-records.page.ts:213` — `PatientMedicalRecordsPage.downloadAllRecords` calls `this.documents.downloadAllClinicalRecordsPdf().subscribe({`
  - `src/app/portals/patient/prescriptions/patient-prescriptions.page.ts:202` — `PatientPrescriptionsPage.downloadAllRecords` calls `this.documents.downloadAllClinicalRecordsPdf().subscribe({`

**Current API call:**
```ts
return this.apiService.getBlob('patient-documents/me/all.pdf');
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.getBlob('patient-documents/me/all.pdf')
```

### API CALL 79 — `PatientDocumentsService.downloadPrescriptionPdf` line 82

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `getBlob`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** ``patient-documents/me/prescriptions/${prescriptionId}/pdf``
- **Payload/params expression:** `none`
- **Risk flags:** `blob/download response, dynamic endpoint`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/portals/patient/prescriptions/patient-prescriptions.page.ts:171` — `PatientPrescriptionsPage.downloadPrescription` calls `this.documents.downloadPrescriptionPdf(prescription.id).subscribe({`

**Current API call:**
```ts
return this.apiService.getBlob(`patient-documents/me/prescriptions/${prescriptionId}/pdf`);
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.getBlob(`patient-documents/me/prescriptions/${prescriptionId}/pdf`)
```

### API CALL 80 — `PatientDocumentsService.downloadMedicalRecordPdf` line 86

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `getBlob`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** ``patient-documents/me/medical-records/${recordId}/pdf``
- **Payload/params expression:** `none`
- **Risk flags:** `blob/download response, dynamic endpoint`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/portals/patient/medical-records/patient-medical-records.page.ts:182` — `PatientMedicalRecordsPage.downloadMedicalRecord` calls `this.documents.downloadMedicalRecordPdf(record.id).subscribe({`

**Current API call:**
```ts
return this.apiService.getBlob(`patient-documents/me/medical-records/${recordId}/pdf`);
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.getBlob(`patient-documents/me/medical-records/${recordId}/pdf`)
```

### API CALL 81 — `PatientDocumentsService.downloadConsultationSummaryPdf` line 90

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `getBlob`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** ``patient-documents/me/bookings/${bookingId}/pdf``
- **Payload/params expression:** `none`
- **Risk flags:** `blob/download response, dynamic endpoint`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/portals/patient/medical-records/patient-medical-records.page.ts:200` — `PatientMedicalRecordsPage.downloadConsultationSummary` calls `this.documents.downloadConsultationSummaryPdf(record.bookingId).subscribe({`
  - `src/app/portals/patient/prescriptions/patient-prescriptions.page.ts:189` — `PatientPrescriptionsPage.downloadConsultationSummary` calls `this.documents.downloadConsultationSummaryPdf(prescription.bookingId).subscribe({`

**Current API call:**
```ts
return this.apiService.getBlob(`patient-documents/me/bookings/${bookingId}/pdf`);
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.getBlob(`patient-documents/me/bookings/${bookingId}/pdf`)
```

### API CALL 82 — `PatientDocumentsService.downloadFile` line 94

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `getBlob`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `src`
- **Payload/params expression:** `none`
- **Risk flags:** `blob/download response`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/shared/components/secure-image/secure-image.component.ts:150` — `SecureImageComponent.loadSource` calls `? this.documentsService.downloadFile(this.src)`

**Current API call:**
```ts
return this.apiService.getBlob(src);
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.getBlob(src)
```

### API CALL 83 — `PatientDocumentsService.if` line 100

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `getBlob`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** ``patients/${pid}/documents/${item.id}/file``
- **Payload/params expression:** `none`
- **Risk flags:** `blob/download response, dynamic endpoint`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.apiService.getBlob(`patients/${pid}/documents/${item.id}/file`);
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.getBlob(`patients/${pid}/documents/${item.id}/file`)
```

### API CALL 84 — `PatientDocumentsService.downloadMediaFile` line 102

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `getBlob`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** ``patients/${pid}/lab-results/${item.id}/file``
- **Payload/params expression:** `none`
- **Risk flags:** `blob/download response, dynamic endpoint`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/shared/components/patient-media-panel/patient-media-panel.component.ts:538` — `PatientMediaPanelComponent.download` calls `this.documentsService`
  - `src/app/shared/components/patient-media-panel/patient-media-preview.modal.ts:399` — `PatientMediaPreviewModalComponent.download` calls `this.documentsService.downloadMediaFile(item, this.kind, this.patientId).subscribe({`
  - `src/app/shared/components/secure-image/secure-image.component.ts:144` — `SecureImageComponent.loadSource` calls `? this.documentsService.downloadMediaFile(`

**Current API call:**
```ts
return this.apiService.getBlob(`patients/${pid}/lab-results/${item.id}/file`);
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.getBlob(`patients/${pid}/lab-results/${item.id}/file`)
```

## `src/app/core/services/patient-state.service.ts`


### API CALL 85 — `PatientStateService.refresh` line 85

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'patients'`
- **Payload/params expression:** `none`
- **Risk flags:** `state/session side effect`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/portals/staff/dashboard/staff-dashboard.page.ts:216` — `StaffDashboardPage.refreshDashboardData` calls `this.patientState.refresh();`

**Current API call:**
```ts
this.api.get<any>('patients').subscribe({
      next: (data: any) => {
        try {
          const rows = (data?.items ?? data ?? []) as PatientRow[];
          this.patientsSubject.next(mapRows(rows));
        } finally {
          this.loadingSubject.next(false);
        }
      },
      error: () => this.loadingSubject.next(false)
    });
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('patients')
```

### API CALL 86 — `PatientStateService.getPatientById` line 104

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'patients/' + id`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/doctor/consultation/doctor-consultation.page.ts:2755` — `DoctorConsultationPage.resolvePatient$` calls `return this.patientState.getPatientById(booking.patientId).pipe(`

**Current API call:**
```ts
return this.api.get<any>('patients/' + id).pipe(
      map((data) => data ? rowToPatient(data as PatientRow) : undefined)
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('patients/' + id)
```

### API CALL 87 — `PatientStateService.getPatientByUserId` line 110

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'patients?userId=' + userId`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.get<any[]>('patients?userId=' + userId).pipe(
      map((data) => {
        const rows = (data ?? []) as PatientRow[];
        return rows.length > 0 ? rowToPatient(rows[0]) : undefined;
      })
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('patients?userId=' + userId)
```

### API CALL 88 — `PatientStateService.getFilteredPatients` line 119

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'patients?search=' + encodeURIComponent(query)`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.get<any[]>('patients?search=' + encodeURIComponent(query)).pipe(
      map((data) => mapRows((data ?? []) as PatientRow[]))
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('patients?search=' + encodeURIComponent(query))
```

### API CALL 89 — `PatientStateService.savePatient` line 136

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** ``patients/${patient.id}``
- **Payload/params expression:** `patient`
- **Risk flags:** `dynamic endpoint`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
this.api.put(`patients/${patient.id}`, patient).subscribe({
      error: (err) => console.error('[PatientStateService] Failed to save patient:', err)
    });
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put(`patients/${patient.id}`, patient)
```

### API CALL 90 — `PatientStateService.updatePatientConsent` line 142

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** ``patients/${patientId}/portal-account``
- **Payload/params expression:** `{ consentVersion }`
- **Risk flags:** `dynamic endpoint`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
this.api.post(`patients/${patientId}/portal-account`, { consentVersion }).subscribe({
      next: () => this.refresh(),
      error: (err) => console.error('[PatientStateService] Failed to update consent:', err)
    });
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post(`patients/${patientId}/portal-account`, { consentVersion })
```

## `src/app/core/services/push-notification.service.ts`


### API CALL 91 — `PushNotificationService.(top-level/class field)` line 159

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'device-tokens'`
- **Payload/params expression:** `{
        token,
        platform: FIREBASE_WEB_PLATFORM
      }`
- **Risk flags:** `state/session side effect`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
this.apiService.post('device-tokens', {
        token,
        platform: FIREBASE_WEB_PLATFORM
      }).subscribe({
        next: () => {
          this.deviceRegisteredSubject.next(true);
        },
        error: (err) => {
          console.error('[PushNotification] Failed to register device token:', err);
        }
      });
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post('device-tokens', {
        token,
        platform: FIREBASE_WEB_PLATFORM
      })
```

### API CALL 92 — `PushNotificationService.markRead` line 185

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** ``notifications/${notificationId}/read``
- **Payload/params expression:** `{}`
- **Risk flags:** `dynamic endpoint`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
this.apiService.put(`notifications/${notificationId}/read`, {}).subscribe({
      error: (err) => console.error('[PushNotification] Failed to mark notification read:', err)
    });
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put(`notifications/${notificationId}/read`, {})
```

### API CALL 93 — `PushNotificationService.markAllRead` line 199

- **Current location:** `service`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'notifications/read-all'`
- **Payload/params expression:** `{}`
- **Risk flags:** `none`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
this.apiService.put('notifications/read-all', {}).subscribe({
      error: (err) => console.error('[PushNotification] Failed to mark all read:', err)
    });
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put('notifications/read-all', {})
```

## `src/app/portals/admin/announcements/announcements.page.ts`


### API CALL 94 — `AnnouncementsPage.loadAnnouncements` line 114

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'announcements'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
this.api.get<any[]>('announcements').pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (data: any) => {
        this.announcements = ((data ?? []) as Record<string, unknown>[]).map(mapApiRow);
        this.isLoading = false;
      },
      error: (err: any) => {
        this.loadError = true;
        this.loadErrorDescription = 'Failed to load announcements.';
        console.error('[AnnouncementsPage] Error loading announcements:', err?.message ?? err);
        this.announcements = [];
        this.isLoading = false;
      }
    });
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/admin/announcements/announcements.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('announcements')
```

### API CALL 95 — `AnnouncementsPage.save` line 149

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'announcements/' + this.editingId`
- **Payload/params expression:** `{ title: this.draft.title, body: this.draft.body, isActive: this.draft.isActive }`
- **Risk flags:** `none`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
? this.api.put('announcements/' + this.editingId, { title: this.draft.title, body: this.draft.body, isActive: this.draft.isActive })
      : this.api.post('announcements', { title: this.draft.title, body: this.draft.body, isActive: this.draft.isActive });
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/admin/announcements/announcements.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put('announcements/' + this.editingId, { title: this.draft.title, body: this.draft.body, isActive: this.draft.isActive })
```

### API CALL 96 — `AnnouncementsPage.save` line 150

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'announcements'`
- **Payload/params expression:** `{ title: this.draft.title, body: this.draft.body, isActive: this.draft.isActive }`
- **Risk flags:** `none`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
: this.api.post('announcements', { title: this.draft.title, body: this.draft.body, isActive: this.draft.isActive });
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/admin/announcements/announcements.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post('announcements', { title: this.draft.title, body: this.draft.body, isActive: this.draft.isActive })
```

### API CALL 97 — `AnnouncementsPage.toggle` line 165

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'announcements/' + id`
- **Payload/params expression:** `{ isActive: newActive }`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
this.api.put('announcements/' + id, { isActive: newActive }).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => this.loadAnnouncements(),
      error: (err) => console.error('Failed to toggle announcement.', err)
    });
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/admin/announcements/announcements.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put('announcements/' + id, { isActive: newActive })
```

### API CALL 98 — `AnnouncementsPage.if` line 181

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `delete`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'announcements/' + this.deletingId`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
this.api.delete('announcements/' + this.deletingId).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
        next: () => {
          this.loadAnnouncements();
          this.closeDeleteModal();
        },
        error: (err) => console.error('Failed to delete announcement.', err)
      });
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/admin/announcements/announcements.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.delete('announcements/' + this.deletingId)
```

## `src/app/portals/admin/booking-detail/booking-detail.page.ts`


### API CALL 99 — `BookingDetailPage.loadPatientDetails` line 275

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'patients/' + patientId`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
const data: any = await firstValueFrom(this.api.get('patients/' + patientId));
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/admin/booking-detail/booking-detail.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get('patients/' + patientId)
```

### API CALL 100 — `BookingDetailPage.recordAuditLog` line 414

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'audit-logs'`
- **Payload/params expression:** `{ entityType: 'Booking', entityId, action, performedBy, details }`
- **Risk flags:** `none`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
await firstValueFrom(this.api.post('audit-logs', { entityType: 'Booking', entityId, action, performedBy, details }));
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/admin/booking-detail/booking-detail.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post('audit-logs', { entityType: 'Booking', entityId, action, performedBy, details })
```

### API CALL 101 — `BookingDetailPage.waivePayment` line 432

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'bookings/' + bookingId + '/waive'`
- **Payload/params expression:** `{ reason }`
- **Risk flags:** `none`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
await firstValueFrom(this.api.put('bookings/' + bookingId + '/waive', { reason }));
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/admin/booking-detail/booking-detail.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put('bookings/' + bookingId + '/waive', { reason })
```

### API CALL 102 — `BookingDetailPage.refundPaymentAction` line 453

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'bookings/' + bookingId + '/refund'`
- **Payload/params expression:** `{ reason }`
- **Risk flags:** `none`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
await firstValueFrom(this.api.put('bookings/' + bookingId + '/refund', { reason }));
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/admin/booking-detail/booking-detail.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put('bookings/' + bookingId + '/refund', { reason })
```

## `src/app/portals/admin/dashboard/dashboard.page.ts`


### API CALL 103 — `DashboardPage.(top-level/class field)` line 143

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'bookings?status=CheckedIn&pageSize=1'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
this.api.get<any[]>('bookings?status=CheckedIn&pageSize=1'),
      this.api.get<any[]>('bookings?fromDate=' + encodeURIComponent(monthStart) + '&toDate=' + encodeURIComponent(today) + '&pageSize=1000'),
      this.api.get<any[]>('doctors'),
      this.api.get<any[]>('patients?pageSize=1000'),
      this.api.get<any[]>('services'),
    ]).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: ([staffToday, monthBookings, doctorsList, patientsList, servicesList]) => {
        const todayRows = staffToday || [];
        const monthRows = monthBookings || [];

      this.doctors = (doctorsList || []).map((d: any) => ({ id: d.id, fullName: d.full_name }));
      this.patients = (patientsList || []).map((p: any) => ({ id: p.id, firstName: p.first_name, lastName: p.last_name }));
      this.services = (servicesList || []).map((s: any) => ({ id: s.id, name: s.name }));
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/admin/dashboard/dashboard.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('bookings?status=CheckedIn&pageSize=1')
```

### API CALL 104 — `DashboardPage.(top-level/class field)` line 144

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'bookings?fromDate=' + encodeURIComponent(monthStart) + '&toDate=' + encodeURIComponent(today) + '&pageSize=1000'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
this.api.get<any[]>('bookings?fromDate=' + encodeURIComponent(monthStart) + '&toDate=' + encodeURIComponent(today) + '&pageSize=1000'),
      this.api.get<any[]>('doctors'),
      this.api.get<any[]>('patients?pageSize=1000'),
      this.api.get<any[]>('services'),
    ]).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: ([staffToday, monthBookings, doctorsList, patientsList, servicesList]) => {
        const todayRows = staffToday || [];
        const monthRows = monthBookings || [];

      this.doctors = (doctorsList || []).map((d: any) => ({ id: d.id, fullName: d.full_name }));
      this.patients = (patientsList || []).map((p: any) => ({ id: p.id, firstName: p.first_name, lastName: p.last_name }));
      this.services = (servicesList || []).map((s: any) => ({ id: s.id, name: s.name }));
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/admin/dashboard/dashboard.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('bookings?fromDate=' + encodeURIComponent(monthStart) + '&toDate=' + encodeURIComponent(today) + '&pageSize=1000')
```

### API CALL 105 — `DashboardPage.(top-level/class field)` line 145

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'doctors'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
this.api.get<any[]>('doctors'),
      this.api.get<any[]>('patients?pageSize=1000'),
      this.api.get<any[]>('services'),
    ]).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: ([staffToday, monthBookings, doctorsList, patientsList, servicesList]) => {
        const todayRows = staffToday || [];
        const monthRows = monthBookings || [];

      this.doctors = (doctorsList || []).map((d: any) => ({ id: d.id, fullName: d.full_name }));
      this.patients = (patientsList || []).map((p: any) => ({ id: p.id, firstName: p.first_name, lastName: p.last_name }));
      this.services = (servicesList || []).map((s: any) => ({ id: s.id, name: s.name }));

      this.todayAppointmentsCount = todayRows.length;
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/admin/dashboard/dashboard.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('doctors')
```

### API CALL 106 — `DashboardPage.(top-level/class field)` line 146

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'patients?pageSize=1000'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
this.api.get<any[]>('patients?pageSize=1000'),
      this.api.get<any[]>('services'),
    ]).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: ([staffToday, monthBookings, doctorsList, patientsList, servicesList]) => {
        const todayRows = staffToday || [];
        const monthRows = monthBookings || [];

      this.doctors = (doctorsList || []).map((d: any) => ({ id: d.id, fullName: d.full_name }));
      this.patients = (patientsList || []).map((p: any) => ({ id: p.id, firstName: p.first_name, lastName: p.last_name }));
      this.services = (servicesList || []).map((s: any) => ({ id: s.id, name: s.name }));

      this.todayAppointmentsCount = todayRows.length;
      this.monthlyAppointmentsCount = monthRows.length;
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/admin/dashboard/dashboard.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('patients?pageSize=1000')
```

### API CALL 107 — `DashboardPage.(top-level/class field)` line 147

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'services'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
this.api.get<any[]>('services'),
    ]).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: ([staffToday, monthBookings, doctorsList, patientsList, servicesList]) => {
        const todayRows = staffToday || [];
        const monthRows = monthBookings || [];

      this.doctors = (doctorsList || []).map((d: any) => ({ id: d.id, fullName: d.full_name }));
      this.patients = (patientsList || []).map((p: any) => ({ id: p.id, firstName: p.first_name, lastName: p.last_name }));
      this.services = (servicesList || []).map((s: any) => ({ id: s.id, name: s.name }));

      this.todayAppointmentsCount = todayRows.length;
      this.monthlyAppointmentsCount = monthRows.length;
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/admin/dashboard/dashboard.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('services')
```

## `src/app/portals/admin/services/admin-doctors.service.ts`


### API CALL 108 — `AdminDoctorsService.getAllDoctors` line 66

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'doctors/admin'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/admin/doctor-form/doctor-form.page.ts:229` — `DoctorFormPage.ngOnInit` calls `doctors: this.adminDoctorsService.getAllDoctors().pipe(`
  - `src/app/portals/admin/doctors/doctors.page.ts:272` — `DoctorsPage.loadDoctors` calls `this.adminDoctorsService`
  - `src/app/portals/admin/services/services.page.ts:309` — `ServicesPage.loadData` calls `doctors: this.adminDoctorsService.getAllDoctors().pipe(`

**Current API call:**
```ts
return this.api.get<any[]>('doctors/admin').pipe(
      map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDtoToDoctor))
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('doctors/admin')
```

### API CALL 109 — `AdminDoctorsService.createDoctor` line 76

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'doctors'`
- **Payload/params expression:** `{
      fullName: dto.fullName,
      specialization: dto.specialization,
      bio: dto.bio ?? null,
      licenseNumber: dto.licenseNumber ?? null,
      ptrNumber: dto.ptrNumber ?? null,
      s2Number: dto.s2Number ?? null,
      consultationFee: dto.consultationFee,
      slotDurationMinutes: dto.slotDurationMinutes,
      slotCapacity: dto.slotCapacity,
      dailyPatientLimit: dto.dailyPatientLimit ?? null,
      doctorEmail: dto.doctorEmail,
      tempPassword: dto.tempPassword,
    }`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.post('doctors', {
      fullName: dto.fullName,
      specialization: dto.specialization,
      bio: dto.bio ?? null,
      licenseNumber: dto.licenseNumber ?? null,
      ptrNumber: dto.ptrNumber ?? null,
      s2Number: dto.s2Number ?? null,
      consultationFee: dto.consultationFee,
      slotDurationMinutes: dto.slotDurationMinutes,
      slotCapacity: dto.slotCapacity,
      dailyPatientLimit: dto.dailyPatientLimit ?? null,
      doctorEmail: dto.doctorEmail,
      tempPassword: dto.tempPassword,
    }).pipe(map((data) => mapDtoToDoctor((data ?? {}) as Record<string, unknown>)));
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post('doctors', {
      fullName: dto.fullName,
      specialization: dto.specialization,
      bio: dto.bio ?? null,
      licenseNumber: dto.licenseNumber ?? null,
      ptrNumber: dto.ptrNumber ?? null,
      s2Number: dto.s2Number ?? null,
      consultationFee: dto.consultationFee,
      slotDurationMinutes: dto.slotDurationMinutes,
      slotCapacity: dto.slotCapacity,
      dailyPatientLimit: dto.dailyPatientLimit ?? null,
      doctorEmail: dto.doctorEmail,
      tempPassword: dto.tempPassword,
    })
```

### API CALL 110 — `AdminDoctorsService.updateDoctor` line 113

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** ``doctors/${id}``
- **Payload/params expression:** `payload`
- **Risk flags:** `RxJS pipe mapping/error/finalize, dynamic endpoint`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/admin/doctor-form/doctor-form.page.ts:309` — `DoctorFormPage.if` calls `this.adminDoctorsService.updateDoctor(this.doctorId, updatePayload)`

**Current API call:**
```ts
return this.api.put(`doctors/${id}`, payload).pipe(map((data) => mapDtoToDoctor((data ?? {}) as Record<string, unknown>)));
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put(`doctors/${id}`, payload)
```

### API CALL 111 — `AdminDoctorsService.deactivateDoctor` line 121

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** ``doctors/${id}``
- **Payload/params expression:** `{ status: 'Inactive' }`
- **Risk flags:** `RxJS pipe mapping/error/finalize, dynamic endpoint`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/admin/doctors/doctors.page.ts:238` — `DoctorsPage.confirmDeactivate` calls `this.adminDoctorsService`

**Current API call:**
```ts
return this.api.put(`doctors/${id}`, { status: 'Inactive' }).pipe(map(() => void 0));
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put(`doctors/${id}`, { status: 'Inactive' })
```

### API CALL 112 — `AdminDoctorsService.getSchedule` line 125

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'doctors/' + id + '/schedule'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/admin/doctor-form/doctor-form.page.ts:235` — `DoctorFormPage.ngOnInit` calls `schedules: this.adminDoctorsService.getSchedule(this.doctorId).pipe(`
  - `src/app/portals/admin/doctors/doctors.page.ts:288` — `DoctorsPage.loadDoctors` calls `this.adminDoctorsService.getSchedule(doctor.id).pipe(`

**Current API call:**
```ts
return this.api.get<any[]>('doctors/' + id + '/schedule').pipe(
      map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDtoToSchedule))
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('doctors/' + id + '/schedule')
```

### API CALL 113 — `AdminDoctorsService.updateSchedule` line 131

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'doctors/' + id + '/schedule'`
- **Payload/params expression:** `{
      schedules: dto.schedules.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      }))
    }`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/admin/doctor-form/doctor-form.page.ts:312` — `DoctorFormPage.if` calls `this.adminDoctorsService.updateSchedule(savedDoctor.id, schedulesPayload).pipe(map(() => savedDoctor))`

**Current API call:**
```ts
return this.api.put<any[]>('doctors/' + id + '/schedule', {
      schedules: dto.schedules.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      }))
    }).pipe(
      map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDtoToSchedule))
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put<any[]>('doctors/' + id + '/schedule', {
      schedules: dto.schedules.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      }))
    })
```

### API CALL 114 — `AdminDoctorsService.getBlockedDates` line 143

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'doctors/' + id + '/blocked-dates'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.get<any[]>('doctors/' + id + '/blocked-dates').pipe(
      map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDtoToBlockedDate))
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('doctors/' + id + '/blocked-dates')
```

### API CALL 115 — `AdminDoctorsService.addBlockedDate` line 149

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'doctors/' + id + '/blocked-dates'`
- **Payload/params expression:** `{
      date: dto.blockedDate,
      reason: dto.reason ?? null,
    }`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.post('doctors/' + id + '/blocked-dates', {
      date: dto.blockedDate,
      reason: dto.reason ?? null,
    }).pipe(map((data) => mapDtoToBlockedDate((data ?? {}) as Record<string, unknown>)));
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post('doctors/' + id + '/blocked-dates', {
      date: dto.blockedDate,
      reason: dto.reason ?? null,
    })
```

### API CALL 116 — `AdminDoctorsService.deleteBlockedDate` line 156

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `delete`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'doctors/' + doctorId + '/blocked-dates/' + bdId`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.delete('doctors/' + doctorId + '/blocked-dates/' + bdId).pipe(map(() => void 0));
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.delete('doctors/' + doctorId + '/blocked-dates/' + bdId)
```

## `src/app/portals/admin/services/admin-patients.service.ts`


### API CALL 117 — `AdminPatientsService.getPatients` line 59

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `endpoint`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/admin/patients/patients.page.ts:228` — `PatientsPage.loadPatients` calls `this.adminPatientsService`
  - `src/app/portals/admin/walk-in/walk-in.page.ts:909` — `WalkInPage.loadPatients` calls `this.adminPatientsService.getPatients(1, this.patientPageSize, trimmed).pipe(`

**Current API call:**
```ts
return this.api.get<any>(endpoint).pipe(
      map((data) => {
        const items = (data?.items ?? data ?? []).map(rowToSummary) as PatientSummary[];
        return {
          items,
          totalCount: data?.totalCount ?? items.length,
          page: data?.page ?? 1,
          pageSize: data?.pageSize ?? items.length,
        } as PagedResult<PatientSummary>;
      })
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>(endpoint)
```

### API CALL 118 — `AdminPatientsService.getPatientById` line 77

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'patients/' + id`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/admin/patient-detail/patient-detail.page.ts:192` — `PatientDetailPage.loadPatient` calls `this.adminPatientsService.getPatientById(id).subscribe((patient) => {`

**Current API call:**
```ts
return this.api.get<any>('patients/' + id).pipe(
      map((data) => rowToDetail(data as PatientRow))
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('patients/' + id)
```

### API CALL 119 — `AdminPatientsService.createPatient` line 83

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `any`
- **Endpoint expression:** `'patients'`
- **Payload/params expression:** `dto`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/admin/patients/admin-patient-create-modal.component.ts:372` — `AdminPatientCreateModalComponent.submit` calls `await firstValueFrom(this.adminPatientsService.createPatient(dto));`

**Current API call:**
```ts
return this.api.post<any>('patients', dto).pipe(
      map((data) => rowToDetail(data as PatientRow))
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<any>('patients', dto)
```

### API CALL 120 — `AdminPatientsService.updatePatient` line 89

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `any`
- **Endpoint expression:** `'patients/' + id`
- **Payload/params expression:** `dto`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:404` — `AdminPatientEditModalComponent.submit` calls `await firstValueFrom(this.adminPatientsService.updatePatient(this.patient.id, dto));`

**Current API call:**
```ts
return this.api.put<any>('patients/' + id, dto).pipe(
      map((data) => rowToDetail(data as PatientRow))
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put<any>('patients/' + id, dto)
```

### API CALL 121 — `AdminPatientsService.createPortalAccount` line 96

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'patients'`
- **Payload/params expression:** `payload`
- **Risk flags:** `none`
- **Conversion mode:** **DIRECT PAGE MIGRATION — page/component must inject ApiService and call endpoint directly.**
- **Detected caller trace:**
  - `src/app/portals/admin/patient-detail/admin-patient-edit-modal.component.ts:519` — `AdminPatientEditModalComponent.resolveAccountUserId` calls `this.adminPatientsService.createPortalAccount(patient.id, {`
  - `src/app/portals/admin/patients/admin-patient-create-modal.component.ts:443` — `AdminPatientCreateModalComponent.ensureAccountUserId` calls `const userId = await firstValueFrom(this.adminPatientsService.createPortalAccount(accountPayload));`

**Current API call:**
```ts
return this.api.post('patients', payload);
```

**Instruction for AI agent:**
- For every detected caller above, inject `ApiService` directly into that page/component and replace the feature-service API call path with the target `apiService` call below.
- After all callers for the selected section are migrated and compile passes, remove only unused API wrapper methods/imports. Do not delete non-HTTP helper/state code if still used.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post('patients', payload)
```

## `src/app/portals/admin/services/admin-reports.service.ts`


### API CALL 122 — `AdminReportsService.fetchAllBookings` line 14

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'bookings?pageSize=1000'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.get<any[]>('bookings?pageSize=1000').pipe(
      map((data) => (data ?? []) as Record<string, unknown>[] as any[])
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('bookings?pageSize=1000')
```

### API CALL 123 — `AdminReportsService.getUnpaidCompletedVisits` line 20

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'reports/unpaid-completed-visits'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/admin/reports/reports.page.ts:171` — `ReportsPage.ngOnInit` calls `this.reportsService.getUnpaidCompletedVisits().subscribe((rows) => {`

**Current API call:**
```ts
return this.api.get<any[]>('reports/unpaid-completed-visits').pipe(
      map((rows) => (rows ?? []) as UnpaidCompletedVisitReportRow[])
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('reports/unpaid-completed-visits')
```

### API CALL 124 — `AdminReportsService.getPendingFollowUps` line 26

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'reports/pending-follow-ups'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/admin/reports/reports.page.ts:176` — `ReportsPage.ngOnInit` calls `this.reportsService.getPendingFollowUps().subscribe((rows) => {`

**Current API call:**
```ts
return this.api.get<any[]>('reports/pending-follow-ups').pipe(
      map((rows) => (rows ?? []) as PendingFollowUpReportRow[])
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('reports/pending-follow-ups')
```

### API CALL 125 — `AdminReportsService.getDailyBookingSummary` line 32

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'reports/daily-booking-summary'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/admin/reports/reports.page.ts:181` — `ReportsPage.ngOnInit` calls `this.reportsService.getDailyBookingSummary().subscribe((rows) => {`

**Current API call:**
```ts
return this.api.get<any[]>('reports/daily-booking-summary').pipe(
      map((rows) => (rows ?? []) as DailyBookingSummaryRow[])
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('reports/daily-booking-summary')
```

## `src/app/portals/admin/services/admin-services.service.ts`


### API CALL 126 — `AdminServicesService.getServices` line 17

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'services'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize, state/session side effect`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/portals/admin/services/services.page.ts:303` — `ServicesPage.loadData` calls `services: this.adminServicesService.getServices().pipe(`

**Current API call:**
```ts
return this.api.get<any[]>('services').pipe(
      map((data) => {
        this.cachedServices = ((data ?? []) as Record<string, unknown>[]).map(mapServiceRow);
        return this.cachedServices;
      })
    );
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('services')
```

### API CALL 127 — `AdminServicesService.getServiceById` line 26

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'services/' + id`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.get<any>('services/' + id).pipe(
      map((data) => data ? mapServiceRow(data as Record<string, unknown>) : undefined)
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('services/' + id)
```

### API CALL 128 — `AdminServicesService.createService` line 32

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `any`
- **Endpoint expression:** `'services'`
- **Payload/params expression:** `dto`
- **Risk flags:** `RxJS pipe mapping/error/finalize, state/session side effect`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/portals/admin/services/services.page.ts:275` — `ServicesPage.save` calls `: this.adminServicesService.createService(payload);`

**Current API call:**
```ts
return this.api.post<any>('services', dto).pipe(
      map((data) => {
        const svc = mapServiceRow((data ?? {}) as Record<string, unknown>);
        if (this.cachedServices) this.cachedServices.push(svc);
        return svc;
      })
    );
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<any>('services', dto)
```

### API CALL 129 — `AdminServicesService.updateService` line 42

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `any`
- **Endpoint expression:** `'services/' + id`
- **Payload/params expression:** `dto`
- **Risk flags:** `RxJS pipe mapping/error/finalize, state/session side effect`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH BEHAVIOR PRESERVED — flatten this flow one selected caller/page at a time. Do not leave the backend call inside the feature service unless blocked.**
- **Detected caller trace:**
  - `src/app/portals/admin/services/services.page.ts:274` — `ServicesPage.save` calls `? this.adminServicesService.updateService(this.editingId, payload)`

**Current API call:**
```ts
return this.api.put<any>('services/' + id, dto).pipe(
      map((data) => {
        const svc = mapServiceRow((data ?? {}) as Record<string, unknown>);
        if (this.cachedServices) {
          const idx = this.cachedServices.findIndex((s) => s.id === id);
          if (idx >= 0) this.cachedServices[idx] = svc;
        }
        return svc;
      })
    );
```

**Instruction for AI agent:**
- Move the actual backend call out of the feature service and into the page/component or selected direct caller. Preserve state/session/blob/upload/mapping behavior exactly by moving required helper logic to the caller or to a no-HTTP helper/state method.
- Do not settle for only renaming `this.api` to `this.apiService`; the migrated backend request must become direct `page/component -> ApiService` for this selected flow.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put<any>('services/' + id, dto)
```

### API CALL 130 — `AdminServicesService.toggleServiceStatus` line 55

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `any`
- **Endpoint expression:** `'services/' + service.id`
- **Payload/params expression:** `{ isActive }`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/admin/services/services.page.ts:219` — `ServicesPage.toggle` calls `this.adminServicesService`

**Current API call:**
```ts
return this.api.put<any>('services/' + service.id, { isActive }).pipe(
      map(() => ({ ...service, isActive }))
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put<any>('services/' + service.id, { isActive })
```

### API CALL 131 — `AdminServicesService.deleteService` line 61

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `delete`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'services/' + id`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **DIRECT PAGE MIGRATION — page/component must inject ApiService and call endpoint directly.**
- **Detected caller trace:**
  - `src/app/portals/admin/services/services.page.ts:243` — `ServicesPage.remove` calls `this.adminServicesService`

**Current API call:**
```ts
return this.api.delete('services/' + id);
```

**Instruction for AI agent:**
- For every detected caller above, inject `ApiService` directly into that page/component and replace the feature-service API call path with the target `apiService` call below.
- After all callers for the selected section are migrated and compile passes, remove only unused API wrapper methods/imports. Do not delete non-HTTP helper/state code if still used.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.delete('services/' + id)
```

### API CALL 132 — `AdminServicesService.getDoctorServices` line 65

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'doctors/' + doctorId + '/services'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.get<any[]>('doctors/' + doctorId + '/services').pipe(
      map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapServiceRow))
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('doctors/' + doctorId + '/services')
```

### API CALL 133 — `AdminServicesService.updateDoctorServices` line 71

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'doctors/' + doctorId + '/services'`
- **Payload/params expression:** `{ serviceIds }`
- **Risk flags:** `none`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.put('doctors/' + doctorId + '/services', { serviceIds });
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put('doctors/' + doctorId + '/services', { serviceIds })
```

## `src/app/portals/admin/services/audit-log.service.ts`


### API CALL 134 — `AuditLogService.getAuditLogs` line 11

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `AuditLog[]`
- **Endpoint expression:** `'audit-logs'`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **DIRECT PAGE MIGRATION — page/component must inject ApiService and call endpoint directly.**
- **Detected caller trace:**
  - `src/app/portals/admin/audit-logs/audit-logs.page.ts:106` — `AuditLogsPage.ngOnInit` calls `this.auditLogService.getAuditLogs().subscribe((logs) => {`
  - `src/app/portals/doctor/consultation/doctor-consultation.page.ts:749` — `DoctorConsultationPage.(top-level/class field)` calls `this.auditLogService.getAuditLogs().pipe(`

**Current API call:**
```ts
return this.api.get<AuditLog[]>('audit-logs');
```

**Instruction for AI agent:**
- For every detected caller above, inject `ApiService` directly into that page/component and replace the feature-service API call path with the target `apiService` call below.
- After all callers for the selected section are migrated and compile passes, remove only unused API wrapper methods/imports. Do not delete non-HTTP helper/state code if still used.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<AuditLog[]>('audit-logs')
```

## `src/app/portals/admin/services/doctor-state.service.ts`


### API CALL 135 — `DoctorStateService.fetchAllDoctorsObservable` line 167

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'doctors/admin'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.get<any[]>('doctors/admin').pipe(
      map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDoctorRow))
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('doctors/admin')
```

### API CALL 136 — `DoctorStateService.fetchDayStatusObservable` line 174

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'doctors/' + doctorId + '/day-status'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.get<any[]>('doctors/' + doctorId + '/day-status').pipe(
      map((statuses) => {
        const rows = (statuses ?? []) as Record<string, unknown>[];
        const row = rows.find((s: any) => s.date === today || s.targetDate === today || s.target_date === today);
        if (!row) return null;
        return {
          id: trimStr(row['id'] ?? row['Id']) ?? '',
          doctorId: trimStr(row['doctorId'] ?? row['doctor_id'] ?? row['DoctorId']) ?? '',
          date: trimStr(row['date'] ?? row['Date'] ?? row['targetDate'] ?? row['target_date']) ?? '',
          status: (trimStr(row['status'] ?? row['Status']) as AvailabilityStatus) ?? 'Available',
          runningLateMinutes: normalizeNumOrUndefined(row['runningLateMinutes'] ?? row['running_late_minutes'] ?? row['RunningLateMinutes']),
        };
      })
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('doctors/' + doctorId + '/day-status')
```

### API CALL 137 — `DoctorStateService.upsertDayStatus$` line 191

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'doctors/' + doctorId + '/day-status'`
- **Payload/params expression:** `{
      date: toLocalIsoDate(),
      status,
      runningLateMinutes: runningLateMinutes ?? null,
    }`
- **Risk flags:** `none`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.post('doctors/' + doctorId + '/day-status', {
      date: toLocalIsoDate(),
      status,
      runningLateMinutes: runningLateMinutes ?? null,
    });
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post('doctors/' + doctorId + '/day-status', {
      date: toLocalIsoDate(),
      status,
      runningLateMinutes: runningLateMinutes ?? null,
    })
```

## `src/app/portals/admin/staff/staff.page.ts`


### API CALL 138 — `StaffPage.loadStaff` line 129

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'admin/staff'`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
const data: any[] = (await firstValueFrom(this.api.get<any[]>('admin/staff'))) ?? [];
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/admin/staff/staff.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('admin/staff')
```

### API CALL 139 — `StaffPage.save` line 199

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'admin/staff/invite'`
- **Payload/params expression:** `payload`
- **Risk flags:** `none`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
const data = await firstValueFrom(this.api.post('admin/staff/invite', payload));
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/admin/staff/staff.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post('admin/staff/invite', payload)
```

### API CALL 140 — `StaffPage.revokeInvite` line 237

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'admin/staff/invite/' + inviteId + '/revoke'`
- **Payload/params expression:** `{}`
- **Risk flags:** `none`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
await firstValueFrom(this.api.put('admin/staff/invite/' + inviteId + '/revoke', {}));
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/admin/staff/staff.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put('admin/staff/invite/' + inviteId + '/revoke', {})
```

### API CALL 141 — `StaffPage.toggle` line 271

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'admin/staff/' + id + '/update-status'`
- **Payload/params expression:** `{ action }`
- **Risk flags:** `none`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
const data: any = await firstValueFrom(this.api.put('admin/staff/' + id + '/update-status', { action }));
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/admin/staff/staff.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put('admin/staff/' + id + '/update-status', { action })
```

## `src/app/portals/doctor/consultation/doctor-consultation.page.ts`


### API CALL 142 — `DoctorConsultationPage.requestAttendingPhysician` line 953

- **Current location:** `page/component`
- **Current receiver:** `this.apiService`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `{ ok: boolean }`
- **Endpoint expression:** `'/consultation-requests/request-attending-physician'`
- **Payload/params expression:** `{
          bookingId: vm.booking.id,
          patientId: vm.patient.id,
          kind,
          requestedByRole: this.currentClinicalRole
        }`
- **Risk flags:** `none`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
this.apiService.post<{ ok: boolean }>('/consultation-requests/request-attending-physician', {
          bookingId: vm.booking.id,
          patientId: vm.patient.id,
          kind,
          requestedByRole: this.currentClinicalRole
        })
      );
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/doctor/consultation/doctor-consultation.page.ts`. Replace `this.apiService` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<{ ok: boolean }>('/consultation-requests/request-attending-physician', {
          bookingId: vm.booking.id,
          patientId: vm.patient.id,
          kind,
          requestedByRole: this.currentClinicalRole
        })
```

### API CALL 143 — `DoctorConsultationPage.recordConsultationAmendmentAuditLogs` line 1880

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'audit-logs'`
- **Payload/params expression:** `sections.map((section) => ({
          entity_type: 'Consultation',
          entity_id: vm.consultation?.id || vm.booking.id,
          action: `Amended ${this.getSectionDisplayName(section)}`,
          performed_by: performedBy,
          performed_at: performedAt,
          details: `${details}; section=${section}`
        }))`
- **Risk flags:** `none`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
await this.api.post('audit-logs', 
        sections.map((section) => ({
          entity_type: 'Consultation',
          entity_id: vm.consultation?.id || vm.booking.id,
          action: `Amended ${this.getSectionDisplayName(section)}`,
          performed_by: performedBy,
          performed_at: performedAt,
          details: `${details}; section=${section}`
        }))
      );
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/doctor/consultation/doctor-consultation.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post('audit-logs', sections.map((section) => ({
          entity_type: 'Consultation',
          entity_id: vm.consultation?.id || vm.booking.id,
          action: `Amended ${this.getSectionDisplayName(section)}`,
          performed_by: performedBy,
          performed_at: performedAt,
          details: `${details}; section=${section}`
        })))
```

## `src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts`


### API CALL 144 — `DoctorPatientDetailPage.buildClinicalHistory` line 321

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'patients/' + patientId`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
const patientRow: any = await firstValueFrom(this.api.get('patients/' + patientId));
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get('patients/' + patientId)
```

### API CALL 145 — `DoctorPatientDetailPage.buildClinicalHistory` line 334

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'bookings?patientId=' + patientId + '&pageSize=50'`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
firstValueFrom(this.api.get<any[]>('bookings?patientId=' + patientId + '&pageSize=50')),
      firstValueFrom(
        forkJoin({
          consultations: this.medicalRecords.getConsultationsByPatientId(patientId),
          prescriptions: this.medicalRecords.getPrescriptionsByPatientId(patientId),
          labResults: this.medicalRecords.getLabResultsByPatientId(patientId),
          vaccinations: this.medicalRecords.getVaccinationsByPatientId(patientId),
          followUps: this.medicalRecords.getFollowUpsByPatientId(patientId)
        })
      )
    ]);
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/doctor/patient-detail/doctor-patient-detail.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('bookings?patientId=' + patientId + '&pageSize=50')
```

## `src/app/portals/doctor/services/doctor.service.ts`


### API CALL 146 — `DoctorService.getMyProfile` line 42

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'doctors/me'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/doctor/consultation/doctor-consultation.page.ts:730` — `DoctorConsultationPage.(top-level/class field)` calls `this.doctorService.getMyProfile().pipe(catchError(() => of(undefined))),`
  - `src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:254` — `DoctorDashboardPage.loadDashboard` calls `this.doctorService.getMyProfile().pipe(`
  - `src/app/portals/doctor/profile/doctor-profile.page.ts:486` — `DoctorProfilePage.loadProfile` calls `this.doctorService`
  - `src/app/portals/doctor/schedule/doctor-schedule.page.ts:98` — `DoctorSchedulePage.loadData` calls `this.doctorService.getMyProfile().pipe(`

**Current API call:**
```ts
return this.api.get<any>('doctors/me').pipe(
      map((data) => {
        if (!data) throw new Error('Doctor profile not found.');
        return mapDoctorRow(data as Record<string, unknown>);
      })
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('doctors/me')
```

### API CALL 147 — `DoctorService.updateMyProfile` line 51

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `any`
- **Endpoint expression:** `'doctors/me'`
- **Payload/params expression:** `dto`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/doctor/profile/doctor-profile.page.ts:428` — `DoctorProfilePage.save` calls `this.doctorService`

**Current API call:**
```ts
return this.api.put<any>('doctors/me', dto).pipe(
      map((data) => mapDoctorRow(data as Record<string, unknown>))
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put<any>('doctors/me', dto)
```

### API CALL 148 — `DoctorService.getMySchedule` line 57

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'doctors/me'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.get<any>('doctors/me').pipe(
      map((profile) => (profile as Record<string, unknown>)['id'] as string),
      switchMap((doctorId) => this.api.get<any[]>('doctors/' + doctorId + '/schedule')),
      map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDoctorScheduleRow))
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('doctors/me')
```

### API CALL 149 — `DoctorService.getMySchedule` line 59

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'doctors/' + doctorId + '/schedule'`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
switchMap((doctorId) => this.api.get<any[]>('doctors/' + doctorId + '/schedule')),
      map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDoctorScheduleRow))
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('doctors/' + doctorId + '/schedule')
```

### API CALL 150 — `DoctorService.getDayStatus` line 65

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'doctors/' + doctorId + '/day-status'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:261` — `DoctorDashboardPage.loadDashboard` calls `dayStatus: this.doctorService.getDayStatus(doc.id).pipe(catchError(() => of(null as DoctorDayStatus | null)))`

**Current API call:**
```ts
return this.api.get<any[]>('doctors/' + doctorId + '/day-status').pipe(
      map((data) => {
        const rows = (data ?? []) as Record<string, unknown>[];
        const today = new Date().toISOString().slice(0, 10);
        const match = rows.find((r) => (r['date'] ?? r['targetDate'] ?? r['target_date']) === today);
        return match
          ? mapDoctorDayStatusRow(match)
          : { id: '', doctorId, date: today, status: 'Available' as AvailabilityStatus };
      })
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('doctors/' + doctorId + '/day-status')
```

### API CALL 151 — `DoctorService.setDayStatus` line 78

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `any`
- **Endpoint expression:** `'doctors/' + doctorId + '/day-status'`
- **Payload/params expression:** `{
      date: dto.date,
      status: dto.status,
      runningLateMinutes: dto.runningLateMinutes,
    }`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:278` — `DoctorDashboardPage.updateStatus` calls `this.doctorService.setDayStatus(this.doctor.id, {`

**Current API call:**
```ts
return this.api.post<any>('doctors/' + doctorId + '/day-status', {
      date: dto.date,
      status: dto.status,
      runningLateMinutes: dto.runningLateMinutes,
    }).pipe(
      map((data) => mapDoctorDayStatusRow((data ?? {}) as Record<string, unknown>))
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<any>('doctors/' + doctorId + '/day-status', {
      date: dto.date,
      status: dto.status,
      runningLateMinutes: dto.runningLateMinutes,
    })
```

### API CALL 152 — `DoctorService.getCurrentDoctor` line 88

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'doctors/me'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.get<any>('doctors/me').pipe(
      map((data) => data ? (mapDoctorRow(data as Record<string, unknown>) as Doctor) : undefined),
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('doctors/me')
```

### API CALL 153 — `DoctorService.getDoctorSchedules` line 94

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'doctors/' + doctorId + '/schedule'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/doctor/dashboard/doctor-dashboard.page.ts:260` — `DoctorDashboardPage.loadDashboard` calls `schedule: this.doctorService.getDoctorSchedules(doc.id).pipe(catchError(() => of([] as DoctorSchedule[]))),`
  - `src/app/portals/doctor/schedule/doctor-schedule.page.ts:119` — `DoctorSchedulePage.loadData` calls `this.doctorService.getDoctorSchedules(doctor.id),`

**Current API call:**
```ts
return this.api.get<any[]>('doctors/' + doctorId + '/schedule').pipe(
      map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDoctorScheduleRow))
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('doctors/' + doctorId + '/schedule')
```

### API CALL 154 — `DoctorService.getDoctorBlockedDates` line 100

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'doctors/' + doctorId + '/blocked-dates'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/doctor/schedule/doctor-schedule.page.ts:120` — `DoctorSchedulePage.loadData` calls `this.doctorService.getDoctorBlockedDates(doctor.id)`

**Current API call:**
```ts
return this.api.get<any[]>('doctors/' + doctorId + '/blocked-dates').pipe(
      map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDoctorBlockedDateRow))
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('doctors/' + doctorId + '/blocked-dates')
```

### API CALL 155 — `DoctorService.updateSchedule` line 106

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'doctors/' + doctorId + '/schedule'`
- **Payload/params expression:** `{
      schedules: schedules.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      }))
    }`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/doctor/schedule/doctor-schedule.page.ts:156` — `DoctorSchedulePage.saveSchedules` calls `this.doctorService.updateSchedule(this.doctorId, activeSchedules).pipe(`

**Current API call:**
```ts
return this.api.put<any[]>('doctors/' + doctorId + '/schedule', {
      schedules: schedules.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      }))
    }).pipe(
      map((data) => ((data ?? []) as Record<string, unknown>[]).map(mapDoctorScheduleRow))
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put<any[]>('doctors/' + doctorId + '/schedule', {
      schedules: schedules.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      }))
    })
```

### API CALL 156 — `DoctorService.updateScheduleSettings` line 118

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `any`
- **Endpoint expression:** `'doctors/' + doctorId`
- **Payload/params expression:** `{
      slotDurationMinutes: dto.slotDurationMinutes,
      slotCapacity: dto.slotCapacity,
      dailyPatientLimit: dto.dailyPatientLimit,
    }`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/doctor/schedule/doctor-schedule.page.ts:158` — `DoctorSchedulePage.saveSchedules` calls `this.doctorService.updateScheduleSettings(this.doctorId, {`

**Current API call:**
```ts
return this.api.put<any>('doctors/' + doctorId, {
      slotDurationMinutes: dto.slotDurationMinutes,
      slotCapacity: dto.slotCapacity,
      dailyPatientLimit: dto.dailyPatientLimit,
    }).pipe(
      map((data) => mapDoctorRow((data ?? {}) as Record<string, unknown>))
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put<any>('doctors/' + doctorId, {
      slotDurationMinutes: dto.slotDurationMinutes,
      slotCapacity: dto.slotCapacity,
      dailyPatientLimit: dto.dailyPatientLimit,
    })
```

### API CALL 157 — `DoctorService.(top-level/class field)` line 128

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `any`
- **Endpoint expression:** `'doctors/' + doctorId + '/blocked-dates'`
- **Payload/params expression:** `{
      date: payload.blockedDate,
      reason: payload.reason ?? null,
    }`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.post<any>('doctors/' + doctorId + '/blocked-dates', {
      date: payload.blockedDate,
      reason: payload.reason ?? null,
    }).pipe(
      map((data) => mapDoctorBlockedDateRow((data ?? {}) as Record<string, unknown>))
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<any>('doctors/' + doctorId + '/blocked-dates', {
      date: payload.blockedDate,
      reason: payload.reason ?? null,
    })
```

### API CALL 158 — `DoctorService.deleteBlockedDate` line 137

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `delete`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'doctors/' + doctorId + '/blocked-dates/' + blockedDateId`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/doctor/schedule/doctor-schedule.page.ts:201` — `DoctorSchedulePage.removeBlockedDate` calls `this.doctorService.deleteBlockedDate(this.doctorId, id).pipe(`

**Current API call:**
```ts
return this.api.delete('doctors/' + doctorId + '/blocked-dates/' + blockedDateId).pipe(
      map(() => void 0)
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.delete('doctors/' + doctorId + '/blocked-dates/' + blockedDateId)
```

## `src/app/portals/patient/reviews/patient-reviews.page.ts`


### API CALL 159 — `PatientReviewsPage.checkExistingReview` line 93

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'reviews?bookingId=' + bookingId`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
const data = await firstValueFrom(this.api.get('reviews?bookingId=' + bookingId));
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/patient/reviews/patient-reviews.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get('reviews?bookingId=' + bookingId)
```

### API CALL 160 — `PatientReviewsPage.submitReview` line 116

- **Current location:** `page/component`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'reviews'`
- **Payload/params expression:** `{
        bookingId: this.booking.id,
        doctorId: this.booking.doctorId,
        patientId: this.currentPatient.id,
        rating,
        comment: comment || null,
        patientName: patientName
      }`
- **Risk flags:** `none`
- **Conversion mode:** **ALREADY PAGE-DIRECT — keep call in page/component, only normalize receiver name if desired.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
await firstValueFrom(this.api.post('reviews', {
        bookingId: this.booking.id,
        doctorId: this.booking.doctorId,
        patientId: this.currentPatient.id,
        rating,
        comment: comment || null,
        patientName: patientName
      }));
```

**Instruction for AI agent:**
- Keep this call in `src/app/portals/patient/reviews/patient-reviews.page.ts`. Replace `this.api` with `this.apiService` only if you are normalizing names in this same file.
- Ensure the file has `private readonly apiService = inject(ApiService);` and remove the old `api` field only after all references are updated.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post('reviews', {
        bookingId: this.booking.id,
        doctorId: this.booking.doctorId,
        patientId: this.currentPatient.id,
        rating,
        comment: comment || null,
        patientName: patientName
      })
```

## `src/app/portals/patient/services/patient.service.ts`


### API CALL 161 — `PatientService.updateProfile` line 10

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `put`
- **Response type/generic:** `any`
- **Endpoint expression:** `'patients/me'`
- **Payload/params expression:** `dto`
- **Risk flags:** `none`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.put<any>('patients/me', dto);
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.put<any>('patients/me', dto)
```

### API CALL 162 — `PatientService.submitConsent` line 18

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `any`
- **Endpoint expression:** `'patients/me/consent'`
- **Payload/params expression:** `dto`
- **Risk flags:** `none`
- **Conversion mode:** **DIRECT PAGE MIGRATION — page/component must inject ApiService and call endpoint directly.**
- **Detected caller trace:**
  - `src/app/portals/patient/privacy-consent/patient-privacy-consent.page.ts:84` — `PatientPrivacyConsentPage.acceptConsent` calls `this.patientService`
  - `src/app/portals/patient/profile/patient-profile.page.ts:539` — `PatientProfilePage.submitConsent` calls `this.patientService`

**Current API call:**
```ts
return this.api.post<any>('patients/me/consent', dto);
```

**Instruction for AI agent:**
- For every detected caller above, inject `ApiService` directly into that page/component and replace the feature-service API call path with the target `apiService` call below.
- After all callers for the selected section are migrated and compile passes, remove only unused API wrapper methods/imports. Do not delete non-HTTP helper/state code if still used.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post<any>('patients/me/consent', dto)
```

### API CALL 163 — `PatientService.getProfile` line 22

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'patients/me'`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.get<any>('patients/me');
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('patients/me')
```

## `src/app/portals/public/services/booking-availability.service.ts`


### API CALL 164 — `BookingAvailabilityService.fetchDoctorSchedules$` line 130

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `DoctorScheduleRow[]`
- **Endpoint expression:** `'doctors/' + doctorId + '/schedule'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.get<DoctorScheduleRow[]>('doctors/' + doctorId + '/schedule').pipe(
      map((data) => (data ?? []) as DoctorScheduleRow[])
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<DoctorScheduleRow[]>('doctors/' + doctorId + '/schedule')
```

## `src/app/portals/public/services/public.service.ts`


### API CALL 165 — `PublicService.getDoctors` line 50

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'doctors'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/admin/walk-in/walk-in.page.ts:880` — `WalkInPage.loadDoctors` calls `this.publicService.getDoctors().pipe(`
  - `src/app/portals/public/booking-confirmation/booking-confirmation.page.ts:105` — `BookingConfirmationPage.(top-level/class field)` calls `? this.publicService.getDoctors().pipe(`
  - `src/app/portals/public/components/booking-summary-bar/booking-summary-bar.component.ts:54` — `BookingSummaryBarComponent.(top-level/class field)` calls `this.publicService.getDoctors().pipe(catchError(() => of([]))),`
  - `src/app/portals/public/components/public-footer/public-footer.component.ts:93` — `PublicFooterComponent.(top-level/class field)` calls `doctors$ = this.publicService.getDoctors();`
  - `src/app/portals/public/components/step-payment/step-payment.component.ts:95` — `StepPaymentComponent.(top-level/class field)` calls `this.publicService.getDoctors().pipe(catchError(() => of([]))),`
  - `src/app/portals/public/components/step-review/step-review.component.ts:77` — `StepReviewComponent.(top-level/class field)` calls `this.publicService.getDoctors().pipe(catchError(() => of([]))),`
  - `src/app/portals/public/doctors/doctors.page.ts:79` — `DoctorsPage.ngOnInit` calls `this.publicService`
  - `src/app/portals/public/home/home.page.ts:81` — `HomePage.(top-level/class field)` calls `readonly doctors$ = this.publicService.getDoctors();`
  - ...plus 2 more caller(s)

**Current API call:**
```ts
return this.api.get<any[]>('doctors').pipe(map((data) => (data ?? []) as Record<string, unknown>[]));
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('doctors')
```

### API CALL 166 — `PublicService.getDoctorById` line 58

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'doctors/' + id`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **DIRECT PAGE MIGRATION — page/component must inject ApiService and call endpoint directly.**
- **Detected caller trace:**
  - `src/app/portals/public/doctor-profile/doctor-profile.page.ts:174` — `DoctorProfilePage.ngOnInit` calls `doctor: this.publicService.getDoctorById(id),`

**Current API call:**
```ts
return this.api.get<any>('doctors/' + id);
```

**Instruction for AI agent:**
- For every detected caller above, inject `ApiService` directly into that page/component and replace the feature-service API call path with the target `apiService` call below.
- After all callers for the selected section are migrated and compile passes, remove only unused API wrapper methods/imports. Do not delete non-HTTP helper/state code if still used.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('doctors/' + id)
```

### API CALL 167 — `PublicService.getServices` line 62

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'services'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/admin/walk-in/walk-in.page.ts:972` — `WalkInPage.loadServicesForDoctor` calls `return this.publicService.getServices().pipe(`
  - `src/app/portals/public/booking/booking.page.ts:45` — `BookingPage.ngOnInit` calls `return this.publicService.getServices().pipe(`
  - `src/app/portals/public/booking-confirmation/booking-confirmation.page.ts:110` — `BookingConfirmationPage.(top-level/class field)` calls `? this.publicService.getServices().pipe(`
  - `src/app/portals/public/home/home.page.ts:82` — `HomePage.(top-level/class field)` calls `readonly services$ = this.publicService.getServices();`
  - `src/app/portals/public/services/services.page.ts:139` — `ServicesPage.ngOnInit` calls `this.publicService`
  - `src/app/portals/staff/walk-in/staff-walk-in.page.ts:1061` — `StaffWalkInPage.loadServicesForDoctor` calls `return this.publicService.getServices().pipe(`

**Current API call:**
```ts
return this.api.get<any[]>('services').pipe(map((data) => (data ?? []) as Record<string, unknown>[]));
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('services')
```

### API CALL 168 — `PublicService.getDoctorServices` line 66

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'doctors/' + doctorId + '/services'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/admin/walk-in/walk-in.page.ts:969` — `WalkInPage.loadServicesForDoctor` calls `this.publicService.getDoctorServices(doctorId).pipe(`
  - `src/app/portals/public/components/booking-summary-bar/booking-summary-bar.component.ts:56` — `BookingSummaryBarComponent.(top-level/class field)` calls `? this.publicService.getDoctorServices(wizard.selectedDoctorId).pipe(catchError(() => of([])))`
  - `src/app/portals/public/components/step-doctor-service/step-doctor-service.component.ts:296` — `StepDoctorServiceComponent.loadDoctorServices` calls `return this.publicService.getDoctorServices(doctorId).pipe(`
  - `src/app/portals/public/components/step-payment/step-payment.component.ts:97` — `StepPaymentComponent.(top-level/class field)` calls `? this.publicService.getDoctorServices(wizard.selectedDoctorId).pipe(catchError(() => of([])))`
  - `src/app/portals/public/components/step-review/step-review.component.ts:79` — `StepReviewComponent.(top-level/class field)` calls `? this.publicService.getDoctorServices(wizard.selectedDoctorId).pipe(catchError(() => of([])))`
  - `src/app/portals/staff/walk-in/staff-walk-in.page.ts:1053` — `StaffWalkInPage.loadServicesForDoctor` calls `this.publicService`

**Current API call:**
```ts
return this.api.get<any[]>('doctors/' + doctorId + '/services').pipe(map((data) => (data ?? []) as Record<string, unknown>[]));
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('doctors/' + doctorId + '/services')
```

### API CALL 169 — `PublicService.getDoctorSchedule` line 70

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'doctors/' + doctorId + '/schedule'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.get<any[]>('doctors/' + doctorId + '/schedule').pipe(map((data) => (data ?? []) as Record<string, unknown>[]));
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('doctors/' + doctorId + '/schedule')
```

### API CALL 170 — `PublicService.getDoctorReviews` line 78

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'reviews?doctorId=' + doctorId`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/public/doctor-profile/doctor-profile.page.ts:175` — `DoctorProfilePage.ngOnInit` calls `reviews: this.publicService.getDoctorReviews(id),`

**Current API call:**
```ts
return this.api.get<any[]>('reviews?doctorId=' + doctorId).pipe(map((data) => (data ?? []) as Record<string, unknown>[]));
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('reviews?doctorId=' + doctorId)
```

### API CALL 171 — `PublicService.getAvailableSlots` line 82

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'doctors/' + doctorId + '/available-slots?date=' + date`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/admin/walk-in/walk-in.page.ts:1008` — `WalkInPage.refreshAvailableSlots` calls `this.publicService.getAvailableSlots(doctorId, date).pipe(`
  - `src/app/portals/public/components/step-slot-select/step-slot-select.component.ts:241` — `StepSlotSelectComponent.loadAvailableSlots` calls `return this.publicService.getAvailableSlots(doctorId, date).pipe(`
  - `src/app/portals/public/services/booking-availability.service.ts:111` — `BookingAvailabilityService.getAvailableSlots` calls `return this.publicService.getAvailableSlots(doctorId, dateStr);`
  - `src/app/portals/staff/walk-in/staff-walk-in.page.ts:1108` — `StaffWalkInPage.refreshAvailableSlots` calls `this.publicService`

**Current API call:**
```ts
return this.api.get<any[]>('doctors/' + doctorId + '/available-slots?date=' + date).pipe(map((data) => (data ?? []) as Record<string, unknown>[]));
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('doctors/' + doctorId + '/available-slots?date=' + date)
```

### API CALL 172 — `PublicService.getAnnouncements` line 86

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'announcements'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/public/announcements/announcements.page.ts:44` — `AnnouncementsPage.ngOnInit` calls `this.publicService.getAnnouncements().subscribe((list) => {`
  - `src/app/portals/public/home/home.page.ts:83` — `HomePage.(top-level/class field)` calls `readonly announcements$ = this.publicService.getAnnouncements();`

**Current API call:**
```ts
return this.api.get<any[]>('announcements').pipe(map((data) => (data ?? []) as Record<string, unknown>[]));
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('announcements')
```

### API CALL 173 — `PublicService.getReviews` line 91

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `url`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.get<any[]>(url).pipe(map((data) => (data ?? []) as Record<string, unknown>[]));
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>(url)
```

### API CALL 174 — `PublicService.getClinicSettings` line 95

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'settings'`
- **Payload/params expression:** `none`
- **Risk flags:** `none`
- **Conversion mode:** **DIRECT PAGE MIGRATION — page/component must inject ApiService and call endpoint directly.**
- **Detected caller trace:**
  - `src/app/portals/public/home/home.page.ts:84` — `HomePage.(top-level/class field)` calls `readonly settings$ = this.publicService.getClinicSettings();`

**Current API call:**
```ts
return this.api.get<any>('settings');
```

**Instruction for AI agent:**
- For every detected caller above, inject `ApiService` directly into that page/component and replace the feature-service API call path with the target `apiService` call below.
- After all callers for the selected section are migrated and compile passes, remove only unused API wrapper methods/imports. Do not delete non-HTTP helper/state code if still used.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('settings')
```

## `src/app/portals/staff/services/staff.service.ts`


### API CALL 175 — `StaffService.getDoctors` line 55

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any[]`
- **Endpoint expression:** `'doctors'`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **FIND CALLERS THEN DIRECT MIGRATE OR MARK UNUSED — do not keep as a service API wrapper without proof.**
- **Detected caller trace:** none found by static scan. It may be routed/template-driven, unused, or called indirectly.

**Current API call:**
```ts
return this.api.get<any[]>('doctors').pipe(
      map((data) => ((data ?? []) as Record<string, unknown>[]).map((r) => ({
        id: (r['id'] ?? r['Id'] ?? '') as string,
        fullName: (r['fullName'] ?? r['full_name'] ?? r['FullName'] ?? '') as string,
        specialization: (r['specialization'] ?? r['Specialization']) as string | undefined,
      })))
    );
```

**Instruction for AI agent:**
- Find the actual caller(s). If used, migrate the backend request to direct `ApiService` usage in the page/component or selected direct caller. If no reachable caller exists, mark `UNUSED`. Preserve endpoint, payload, response type, and all RxJS behavior exactly.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any[]>('doctors')
```

### API CALL 176 — `StaffService.getPatients` line 67

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `endpoint`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/staff/patients/staff-patients.page.ts:181` — `StaffPatientsPage.loadPatients` calls `this.staffService`
  - `src/app/portals/staff/walk-in/staff-walk-in.page.ts:979` — `StaffWalkInPage.loadPatients` calls `this.staffService`

**Current API call:**
```ts
return this.api.get<any>(endpoint).pipe(
      map((data) => {
        const items = ((data?.items ?? data ?? []) as Record<string, unknown>[]).map(toStaffPatient);
        return {
          items,
          total: data?.total ?? items.length,
          totalCount: data?.totalCount ?? items.length,
          page: data?.page ?? page,
          pageSize: data?.pageSize ?? pageSize,
        } as PagedResult<StaffPatient>;
      })
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>(endpoint)
```

### API CALL 177 — `StaffService.getPatientById` line 82

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `get`
- **Response type/generic:** `any`
- **Endpoint expression:** `'patients/' + id`
- **Payload/params expression:** `none`
- **Risk flags:** `RxJS pipe mapping/error/finalize`
- **Conversion mode:** **DIRECT PAGE MIGRATION WITH PIPE PRESERVED — copy/recreate the exact pipe chain in the page/component or extract only non-HTTP helper logic.**
- **Detected caller trace:**
  - `src/app/portals/staff/patient-detail/staff-patient-detail.page.ts:134` — `StaffPatientDetailPage.loadPatient` calls `this.staffService`

**Current API call:**
```ts
return this.api.get<any>('patients/' + id).pipe(
      map((data) => data ? toStaffPatient(data as Record<string, unknown>) : undefined)
    );
```

**Instruction for AI agent:**
- Flatten this service method by preserving the complete `.pipe(...)` chain and resulting output shape 1:1 in the page/component or selected direct caller.
- Do not keep the feature-service wrapper as the final result unless blocked. If blocked, stop and report the exact blocker instead of silently keeping the old path.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.get<any>('patients/' + id)
```

### API CALL 178 — `StaffService.createPatientPortalAccount` line 92

- **Current location:** `service`
- **Current receiver:** `this.api`
- **HTTP wrapper method:** `post`
- **Response type/generic:** `not explicit / inferred`
- **Endpoint expression:** `'patients/' + patientId + '/portal-account'`
- **Payload/params expression:** `request`
- **Risk flags:** `none`
- **Conversion mode:** **DIRECT PAGE MIGRATION — page/component must inject ApiService and call endpoint directly.**
- **Detected caller trace:**
  - `src/app/portals/staff/patient-detail/staff-patient-detail.page.ts:192` — `StaffPatientDetailPage.createPortalAccount` calls `this.staffService.createPatientPortalAccount(this.patient.id, {`

**Current API call:**
```ts
return this.api.post('patients/' + patientId + '/portal-account', request);
```

**Instruction for AI agent:**
- For every detected caller above, inject `ApiService` directly into that page/component and replace the feature-service API call path with the target `apiService` call below.
- After all callers for the selected section are migrated and compile passes, remove only unused API wrapper methods/imports. Do not delete non-HTTP helper/state code if still used.
- Do not change DTOs, business logic, loading flags, error messages, toasts, navigation, or response mapping.
- Run TypeScript/build check after this file is changed.

**Target call style:**
```ts
this.apiService.post('patients/' + patientId + '/portal-account', request)
```

# Copy-paste implementation prompt for AI agent

Use this prompt after giving the agent this instruction file.

```txt
You are working in this Angular/Ionic project.

Read this file first:
docs/API_CALL_CONVERSION_INSTRUCTIONS.md

Task:
Implement API call conversion/normalization for ONE selected service/page section only.

Selected section to process:
[PASTE EXACT SECTION PATH HERE, example: src/app/core/services/auth.service.ts]

Critical execution rule:
PROCESS ONLY THE SELECTED SECTION.
DO NOT process the whole project.
DO NOT continue to the next service/page section.
DO NOT batch multiple services together.
STOP after the checkpoint report.

Goal:
Convert/normalize API usage to the centralized ApiService pattern while preserving behavior 1:1.

Target pattern:
- Angular HttpClient must only be used inside:
  src/app/core/services/api.service.ts
- Pages/components/services must call ApiService only.
- Preferred readable call style:
  this.apiService.get<T>(url)
  this.apiService.post<T>(url, payload)
  this.apiService.put<T>(url, payload)
  this.apiService.patch<T>(url, payload)
  this.apiService.delete<T>(url)
  this.apiService.getBlob(url)
  this.apiService.postBlob(url, payload)
  this.apiService.postFormData(url, formData)
  this.apiService.putFormData(url, formData)

Files you may edit:
- The selected service/page file only
- Direct caller files listed under the selected section only when the instruction explicitly requires it
- Import lines required for those exact changes

Files you must not edit:
- unrelated services
- unrelated pages/components
- UI/SCSS/layout files unless the selected API change cannot compile without it
- backend files
- environment files
- auth/interceptor files unless the selected section explicitly requires it

Rules:
- Follow the per-API-call instructions exactly.
- Do not change backend contracts.
- Do not change endpoint strings.
- Do not change payload shape.
- Do not change DTOs.
- Do not change response mapping.
- Do not change UI behavior.
- Do not change auth interceptor behavior.
- Do not change loading/finalize behavior.
- Do not change toast/error behavior.
- Do not remove or simplify tap/map/switchMap/catchError/finalize.
- Do not add NgRx.
- Use existing Observable/BehaviorSubject patterns if already present.
- Keep HttpClient only inside src/app/core/services/api.service.ts.
- Prefer the injected variable name apiService when touching files.

Conversion mode rules:
- If marked ALREADY PAGE-DIRECT or ALREADY OK:
  Normalize only if needed. Do not rewrite working code unnecessarily.

- If marked MOVEABLE THIN WRAPPER:
  You may move it to direct ApiService usage in the caller.
  Preserve endpoint, payload, response type, loading, error handling, and subscribe behavior.

- If marked MOVE WITH PIPE PRESERVED:
  Move only if the complete pipe chain and output shape are preserved exactly.
  If preservation is risky, keep the service method and mark as REVIEW ONLY.

- If marked REVIEW BEFORE MOVING:
  Do not move it in this pass.
  Keep it in the service.
  Only normalize internal ApiService naming/imports if safe.

- If marked SERVICE-ONLY / UNKNOWN CALLERS:
  Keep it in the service unless you can prove all callers and preserve behavior safely.
  Default to REVIEW ONLY.

Required implementation steps:
1. Locate the selected section in docs/API_CALL_CONVERSION_INSTRUCTIONS.md.
2. List all API CALL numbers in that selected section.
3. Inspect the actual selected source file.
4. Inspect only the direct caller files listed in that selected section.
5. Apply the safest minimal changes.
6. Run build/typecheck.
7. Print the checkpoint report.
8. STOP.

Checkpoint report format:

SERVICE CHECKPOINT: [selected service/page file path]

Changed files:
- [file path]
- [file path]

API calls processed:
- API CALL #: [number]
  Method: [GET/POST/PUT/PATCH/DELETE/BLOB/FORM_DATA]
  Endpoint: [endpoint]
  Status: MIGRATED / BLOCKED / UNUSED / ALREADY OK

What changed:
- [short summary]

What was preserved:
- endpoint strings
- payload shape
- DTO/response type
- response mapping
- loading behavior
- error handling
- RxJS pipe behavior
- subscribe/firstValueFrom behavior
- UI behavior

Build/typecheck result:
PASS / FAIL

Remaining risks:
- [risk list or none]

STOP HERE.
Do not continue to the next service/page section until the user approves.
```

