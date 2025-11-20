# VM Deployment Fix - Form Builder Category Error

## Error on VM
```
Permission validation failed
value: 'form-builder'
kind: 'enum'
```

## Root Cause
The seed file `seedRolesPermissions.ts` was using `category: 'form-builder'` for 6 permissions, but the Permission model enum only allows `'fields-forms'`.

## Fixes Applied

### 1. Fixed Permission Categories
**File:** `backend/src/utils/seedRolesPermissions.ts`
- Changed all 6 occurrences of `category: 'form-builder'` to `category: 'fields-forms'`
- Affected permissions:
  - FORM_VIEW
  - FORM_CREATE
  - FORM_EDIT
  - FORM_DELETE