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

<!-- Path relative to ui/src/features/, e.g. partner/NewPartnerSearch.tsx
     - If Action = New, this file MUST NOT already exist.
     - If Action = Modify, this file MUST already exist. -->
Target React Component: ui/src/features/advancedSearch/AdvancedSearch.tsx

## 2a. Shared Components Expected

<!-- Optional. List any known shared components (from ui/src/components/common/,
     layout/, modal/, or table/) this screen is expected to reuse, if known in
     advance. Not authoritative — the agent will still check these folders
     directly during generation (see ui-codegen.prompt.md Section 3a). -->


## 3. Legacy Screenshot

<!-- Required only when Action = New. Ignored when Action = Modify.
     File name only (e.g. legacy-partner-search.png); must be placed in this
     same specs/ui/<domain_name>/ folder alongside this spec file. -->
Legacy Screenshot: legacy_advanced_search.png

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

- Make sure all the fields are appropriately arranged in the screen with proper spacing and it needs to be readable.

## 8. Validation Changes

<!-- Applies to both New and Modify. -->

| Field Name | Validation Rule | Error Message |
|---|---|---|
| | | |

## 8a. Data Source

<!-- Applies to both New and Modify. List every piece of data this screen needs
     to fetch or submit. "Service Call" = name an existing src/services/ function
     if one already covers this, or "NEW: <domain>Service.<methodName>" if one
     needs to be created (see ui-codegen.prompt.md Section 3c). "Backend Endpoint
     (OpenAPI operationId)" = the approved API contract operation this maps to,
     if known; leave blank/"TBD" if no contract exists yet (mock data required). -->

| Data Needed | Service Call (existing/new) | Backend Endpoint (OpenAPI operationId) | Needs Mock Data? (Y/N) |
|---|---|---|---|
| | | | |

## 8b. Loading / Error / Empty State Messages

<!-- Optional. Default shared-component messages (LoadingSpinner/ErrorBanner/
     EmptyState) are used unless overridden here. -->

| State | Message |
|---|---|
| Loading | Loading |
| Error | |
| Empty | |

## 9. Navigation Changes

<!-- Applies to both New and Modify. List every trigger (button/link/row-click/etc.)
     that navigates to another page. "Destination Page Exists? (Y/N)" = N means
     the implementer must still register the route and navigate to it (per
     UI_Constitution.md §13), rendering a placeholder at that route if the real
     page is out of scope for this generation run. -->

| Trigger (button/link/row clicked) | Destination Route | Destination Page Exists? (Y/N) | Notes |
|---|---|---|---|
|Advanced seach menu click | |N |On click of the Advanced search menu the new page needs to be loaded |

## 10. Additional Notes / Assumptions

<!-- Anything else the implementer should know, open questions, or known gaps (e.g. backend API not yet available for a field). -->

- Read all the fields from the legacy screen shot provided and recreate all the fields 
