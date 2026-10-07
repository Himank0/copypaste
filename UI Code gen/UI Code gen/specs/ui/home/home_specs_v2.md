# UI Spec Template

> Copy this file into `specs/ui/<domain_name>/<specs_file_name>.md` and fill it in.
> If **Action = New**, also place the legacy screenshot image in the same folder.
> Invoke generation with: `/ui-codegen <domain_name>/<specs_file_name>.md`

---

## Screen / Feature Name

<!-- Short descriptive name, e.g. "Partner Search Results Page" -->

## 1. Action

<!-- Exactly one of: New | Modify -->
Action: Modify

## 2. Target React Component

<!-- Path relative to ui/src/components/, e.g. partner/NewPartnerSearch.tsx
     - If Action = New, this file MUST NOT already exist.
     - If Action = Modify, this file MUST already exist. -->
Target React Component: ui/src/features/home/HomePage.tsx

## 3. Legacy Screenshot

<!-- Required only when Action = New. Ignored when Action = Modify.
     File name only (e.g. legacy-partner-search.png); must be placed in this
     same specs/ui/<domain_name>/ folder alongside this spec file. -->
Legacy Screenshot: legacy_home.png

## 4. Fields to Remove

<!-- New: fields visible in the legacy screenshot that must NOT be carried over.
     Modify: fields currently on the existing page that must be removed. -->

| Field Name | Notes |
|---|---|

## 5. New Fields to Add

<!-- Applies to both New and Modify.
     "Needs Mock Data?" = Y only when no real service/API currently supplies this field's
     value and a placeholder is needed for now. Mocked fields are implemented inline in the
     component, wrapped in a MOCK_DATA_TODO tagged block, and listed as "Unresolved Dependencies"
     so the real data source can be wired in later. -->

| Field Name | Type (text/number/date/dropdown/checkbox/etc.) | Required? | Default Value | Needs Mock Data? (Y/N) | Notes |
|---|---|---|---|---|---|

## 6. Changes Needed in Fields

<!-- New: additional changes to apply to fields carried over from the screenshot or newly added in Section 5.
     Modify: changes to existing fields AND to fields newly added in Section 5.
     "Needs Mock Data?" applies the same way as in Section 5. -->

| Field Name | Change Description | Needs Mock Data? (Y/N) |
|---|---|---|
| | | |

## 7. Layout Changes

<!-- Applies to both New and Modify. Describe grouping, ordering, spacing, column/row layout, responsive behavior, etc. -->

- For the graphical representation of task owners, bar charts are missing.
- Need a tab wise menu at the top with Home, Advanced search etc (refer the left side menu from legacy screen shot)
- For recently accessed dealers section - Need the data in a tabular format with Date, Dealer name, Ref numnber, Trading name, user and an inine button in every column to open the details of the dealer (refer the legacy screen shot)

## 8. Validation Changes

<!-- Applies to both New and Modify. -->

| Field Name | Validation Rule | Error Message |
|---|---|---|
| | | |

## 9. Navigation Changes

<!-- Applies to both New and Modify. Describe entry points, links, redirects, or routing changes required. -->
This page needs to be the landing page, once the login is success.

-

## 10. Additional Notes / Assumptions

<!-- Anything else the implementer should know, open questions, or known gaps (e.g. backend API not yet available for a field). -->
Backend API is not available yet. Mock the data for now. 
In the recently accessed dealers section, on click of open a new page showing details of the dealers need to be loaded which will be built later.

-
