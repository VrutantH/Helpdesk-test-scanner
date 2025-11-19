# Form Fields & Offline Centers Enhancement Summary

## Overview
Enhanced the Student Ticket Submission Portal to support richer form field types, per-field file uploads, and Google Maps integration for offline centers.

---

## Changes Made

### 1. Backend Changes

#### `backend/src/routes/tickets.ts`
- **Changed:** Multer upload middleware from `upload.array('attachments', 5)` to `upload.any()`
- **Reason:** Allow frontend to send files keyed by field name (e.g., `resumeUpload`, `idProof`) rather than a single global `attachments` field

#### `backend/src/controllers/ticketController.ts`
- **Added:** `fieldName` property in attachment metadata
- **Reason:** Preserve which form field each uploaded file belongs to so backend can map per-field attachments correctly

---

### 2. Frontend Changes

#### `frontend/src/components/AddProjectForm.tsx`

**Type Definition Updates:**
- Expanded `onlineFormFields` type to include:
  - New field types: `number`, `date`, `url`, `multiselect`, `radio`, `checkbox`, `file`
  - New properties for file fields: `allowedFileTypes`, `maxFileSizeMB`, `allowMultiple`

**UI Changes:**
- Added expanded field type dropdown with options:
  - Text, Number, Date, Email, Phone, Link (URL), Textarea
  - Dropdown (Single Select), Multi-Select, Radio Buttons, Checkboxes, File Upload
- Added file-specific configuration UI (yellow-highlighted section) when `file` type is selected:
  - Checkboxes to select allowed file extensions (`.pdf`, `.doc`, `.jpg`, etc.)
  - Input for max file size (MB)
  - Checkbox to allow multiple files
- Added options input for multi-select, radio, and checkbox types (same as dropdown)

**Default Values:**
- When adding a new field, default file-specific properties are initialized:
  - `allowedFileTypes: []`
  - `maxFileSizeMB: 5`
  - `allowMultiple: false`

---

#### `frontend/src/pages/StudentPortal.tsx`

**Type Updates:**
- Expanded `OnlineFormField` interface to include:
  - New field types: `number`, `date`, `url`, `multiselect`, `radio`, `checkbox`, `file`
  - File properties: `allowedFileTypes`, `maxFileSizeMB`, `allowMultiple`
- Added `googleMapLink` property to `OfflineCenter` interface

**State Management:**
- Added `fieldFiles: Record<string, File[]>` state to track per-field file uploads
- Added helper functions:
  - `handleFieldFileChange`: Validates and stores files per field with field-specific rules
  - `removeFieldFile`: Removes a file from a specific field's file list

**Form Submission:**
- Updated `handleSubmit` to:
  - Send global `attachments` (if project allows)
  - Send per-field files keyed by field name (e.g., `resumeUpload: [File]`)
  - Clear `fieldFiles` state on success

**Field Rendering (`renderOnlineFormField`):**
- Added cases for new field types:
  - **`number`, `date`, `url`:** Standard HTML input types
  - **`multiselect`:** Multi-select dropdown with `multiple` attribute
  - **`radio`:** Radio button group with options
  - **`checkbox`:** Checkbox group with options (stores array of selected values)
  - **`file`:** Per-field file upload with:
    - Drag-and-drop area
    - Field-specific file type validation (checks `allowedFileTypes`)
    - Field-specific file size validation (checks `maxFileSizeMB`)
    - Display of selected files with remove buttons
    - Support for single or multiple files (`allowMultiple`)

**Offline Centers:**
- Added "Get Directions" button to each center card
- Button opens Google Maps using:
  1. `center.googleMapLink` if present
  2. Latitude/longitude coordinates if available
  3. Fallback: Google Maps search with address string
- Opens in new tab via `window.open(..., '_blank')`

---

## Features Summary

### Expanded Online Form Field Types
Administrators can now configure forms with:
- **Basic inputs:** Text, Number, Date, Email, Phone, URL
- **Text areas:** Multi-line text input
- **Selection fields:**
  - Dropdown (single-select)
  - Multi-select dropdown
  - Radio buttons
  - Checkboxes (multi-choice)
- **File upload:** Per-field file uploads with individual validation rules

### Per-Field File Upload
- Each "file" type field can have:
  - Custom allowed file types (e.g., only `.pdf` and `.docx` for "Resume Upload" field)
  - Custom max file size (MB)
  - Single or multiple file selection
- Files are sent to backend keyed by field name for proper mapping
- Backend stores field name with each attachment

### Offline Centers Enhancements
- **Google Maps Integration:**
  - "Get Directions" button on each center card
  - Uses `googleMapLink` or lat/lng to open Google Maps
  - Fallback: constructs Google Maps search URL from address
- **Master Center Support (Backend Ready):**
  - Frontend and backend support `googleMapLink` field
  - Center master-data API endpoints exist (`/api/master-data/centers`)
  - Future: Admin UI can integrate master center selection and creation

---

## Testing Recommendations

### Test Per-Field File Upload
1. In Admin → Projects → Edit → Ticket Portal → Form Fields:
   - Add a field named "Resume Upload"
   - Set type to "File Upload"
   - Select allowed types: `.pdf`, `.doc`, `.docx`
   - Set max size: 5 MB
   - Check "Allow multiple files"
   - Save project
2. Visit student portal: `http://localhost:3001/studentassistcenter/submit-ticket`
3. Fill form and upload files to "Resume Upload" field
4. Verify:
   - Only allowed file types are accepted
   - Files over 5 MB are rejected
   - Multiple files can be selected
5. Submit ticket and check backend logs to see `fieldName` in attachment metadata

### Test New Field Types
1. Add fields of each new type (number, date, url, multiselect, radio, checkbox)
2. Configure options for multiselect/radio/checkbox
3. Visit student portal and verify each field renders correctly:
   - Number field allows only numeric input
   - Date field shows date picker
   - URL field validates URL format
   - Multiselect allows selecting multiple options
   - Radio buttons allow single selection
   - Checkboxes allow multiple selections
4. Submit form and verify form data includes all field values

### Test Google Maps Integration
1. In Admin → Projects → Edit → Ticket Portal → Offline Centers:
   - Add a center with city/state/address (no googleMapLink)
   - Save project
2. Visit student portal offline centers tab
3. Click "Get Directions" button
4. Verify Google Maps opens with address search
5. (Optional) Add `googleMapLink` field to center and verify it opens the direct link

---

## API Impact

### Ticket Submission Endpoint
- **POST** `/api/tickets/submit`
- Now accepts any file field names (not just `attachments`)
- Backend stores `fieldName` for each attachment
- Example: If form has a "Resume Upload" field, frontend sends files as `resumeUpload` in FormData

### Master Data Centers Endpoint
- **GET** `/api/master-data/centers`
- Returns list of master centers including `googleMapLink`
- Supports filtering by city/state via query params
- Ready for future Admin UI integration

---

## Known Limitations

1. **Master Center Integration (Not Yet Implemented):**
   - Admin UI does not yet fetch and suggest existing master centers when adding offline centers
   - Admin UI does not yet POST new centers to master-data when saving project
   - Workaround: Centers are stored in project's `ticketSubmissionSettings` for now

2. **Conditional Logic:**
   - Form fields do not support conditional visibility (e.g., show field B only if field A has certain value)
   - Future enhancement

3. **File Upload Progress:**
   - No upload progress indicator for large files
   - Future enhancement

---

## Database Schema

No database schema changes required. All new properties are stored in existing fields:
- `Project.configuration.ticketSubmissionSettings.onlineFormFields[]` (extended with new properties)
- `Ticket.attachments[]` (extended with `fieldName` property)

---

## Future Enhancements

1. **Master Center Integration:**
   - Fetch existing centers from `/api/master-data/centers` in Admin UI
   - Allow selecting existing center or creating new one
   - POST new centers to master-data API when saving project
   - Auto-populate city/state dropdowns from master `states` and `cities`

2. **Center Features/Tags:**
   - Add "Services Available" field to Center model
   - Display service tags on student portal center cards

3. **Conditional Form Logic:**
   - Add "Show if" conditions to form fields
   - Support branching logic (e.g., if "Issue Type" = "Technical", show "Device Model" field)

4. **Advanced File Validation:**
   - Client-side preview for image uploads
   - Virus scanning integration
   - Drag-and-drop file upload with progress bars

5. **Multi-Language Form Fields:**
   - Support translating field labels and placeholders
   - Store translations in field configuration

---

## Conclusion

The Student Ticket Submission Portal now supports:
✅ Rich form field types (number, date, url, multiselect, radio, checkbox, file)
✅ Per-field file uploads with individual validation rules
✅ Google Maps integration for offline centers
✅ Backend ready for master center integration

All changes are backward compatible with existing projects that use the older simple field types (text, email, phone, textarea, dropdown).
