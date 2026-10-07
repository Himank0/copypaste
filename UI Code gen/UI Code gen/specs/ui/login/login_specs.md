# UI Spec Template

> Copy this file into `specs/ui/<domain_name>/<specs_file_name>.md` and fill it in.
> If **Action = New**, also place the legacy screenshot image in the same folder.
> Invoke generation with: `/ui-codegen <domain_name>/<specs_file_name>.md`

---

## Screen / Feature Name

<!-- Short descriptive name, e.g. "Partner Search Results Page" -->

## 1. Action

<!-- Exactly one of: New | Modify -->
Action: New

## 2. Target React Component

<!-- Path relative to ui/src/components/, e.g. partner/NewPartnerSearch.tsx
     - If Action = New, this file MUST NOT already exist.
     - If Action = Modify, this file MUST already exist. -->
Target React Component: ui/src/features/login/Login.tsx

## 3. Legacy Screenshot

<!-- Required only when Action = New. Ignored when Action = Modify.
     File name only (e.g. legacy-partner-search.png); must be placed in this
     same specs/ui/<domain_name>/ folder alongside this spec file. -->
Legacy Screenshot: legacy-login.png

## 4. Fields to Remove

<!-- New: fields visible in the legacy screenshot that must NOT be carried over.
     Modify: fields currently on the existing page that must be removed. -->

| Field Name | Notes |
|---|---|
| | |

## 5. New Fields to Add

<!-- Applies to both New and Modify.
     "Needs Mock Data?" = Y only when no real service/API currently supplies this field's
     value and a placeholder is needed for now. Mocked fields are implemented inline in the
     component, wrapped in a MOCK_DATA_TODO tagged block, and listed as "Unresolved Dependencies"
     so the real data source can be wired in later. -->

| Field Name | Type (text/number/date/dropdown/checkbox/etc.) | Required? | Default Value | Needs Mock Data? (Y/N) | Notes |
|---|---|---|---|---|---|
| | | | | | |

## 6. Changes Needed in Fields

<!-- New: additional changes to apply to fields carried over from the screenshot or newly added in Section 5.
     Modify: changes to existing fields AND to fields newly added in Section 5.
     "Needs Mock Data?" applies the same way as in Section 5. -->

| Field Name | Change Description | Needs Mock Data? (Y/N) |
|---|---|---|
| | | |

## 7. Layout Changes

<!-- Applies to both New and Modify. Describe grouping, ordering, spacing, column/row layout, responsive behavior, etc. -->

-

## 8. Validation Changes

<!-- Applies to both New and Modify. -->

| Field Name | Validation Rule | Error Message |
|---|---|---|
|Email|mandatory |Please enter email |
|Password|mandatory |Please enter email |

## 9. Navigation Changes

<!-- Applies to both New and Modify. Describe entry points, links, redirects, or routing changes required. -->
Once login is successful needs navigation to home page which will be generated later
-

## 10. Additional Notes / Assumptions

<!-- Anything else the implementer should know, open questions, or known gaps (e.g. backend API not yet available for a field). -->
No backend API integration yet. Use mock login for now with email as admin.admin@team.telstra.com and password as admin
-
