# Firebase Security Rules Setup

## Overview
Your POS application now has secure Firebase rules that ensure users can only access their own data.

## Security Features Implemented

### 1. User Authentication Required
- All database operations require user authentication
- Unauthenticated users cannot access any data

### 2. User Data Isolation
- Each user can only access data in their own `/users/{userId}/` path
- Users cannot see or modify other users' data

### 3. Collection-Level Security
- **Products**: Users can read, write, and delete only their own products
- **Invoices**: Users can read and write only their own invoices
- **Customers**: Users can read, write, and delete only their own customers
- **Settings**: Users can read and write only their own business profile
- **User Profile**: Users can read and write only their own user document

### 4. Storage Security
- Users can only upload and access files in their own storage folder
- File uploads are restricted to authenticated users only

## How to Apply These Rules

### Step 1: Firestore Database Rules
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `pos-billing-9c850`
3. Navigate to **Firestore Database** → **Rules**
4. Replace the existing rules with the content from `firestore.rules`
5. Click **Publish**

### Step 2: Storage Rules (if using file uploads)
1. In Firebase Console, navigate to **Storage** → **Rules**
2. Replace the existing rules with the content from `storage.rules`
3. Click **Publish**

## Testing Security Rules

### Test 1: Authenticated User Access
- Sign in to your app
- Verify you can create, read, update products
- Verify you can generate invoices
- Verify you can update business profile

### Test 2: Unauthenticated Access
- Sign out of your app
- Try to access the app directly via URL
- Should redirect to login page

### Test 3: Cross-User Access (Advanced)
- Create two different user accounts
- Sign in with User A, create some products
- Sign in with User B
- Verify User B cannot see User A's products

## Rule Breakdown

```javascript
// Example rule explanation
match /users/{userId}/products/{productId} {
  allow read, write, delete: if request.auth != null && request.auth.uid == userId;
}
```

This rule means:
- `match /users/{userId}/products/{productId}` - Applies to product documents
- `request.auth != null` - User must be authenticated
- `request.auth.uid == userId` - User ID must match the document path
- `allow read, write, delete` - Permits all operations if conditions are met

## Security Best Practices Implemented

✅ **Authentication Required**: All operations require valid authentication
✅ **Data Isolation**: Users can only access their own data
✅ **Principle of Least Privilege**: Users have minimal necessary permissions
✅ **Explicit Deny**: All unmatched paths are explicitly denied
✅ **Path-Based Security**: Security is enforced at the database path level

## Additional Security Recommendations

1. **Enable App Check** (Optional but recommended)
   - Protects against abuse from unauthorized clients
   - Go to Firebase Console → App Check

2. **Monitor Usage**
   - Check Firebase Console → Usage tab regularly
   - Set up billing alerts to prevent unexpected charges

3. **Regular Security Reviews**
   - Review these rules periodically
   - Update rules if you add new features

## Troubleshooting

If you encounter permission errors:
1. Check that the user is properly authenticated
2. Verify the document path matches the user's UID
3. Check browser console for detailed error messages
4. Test rules in Firebase Console → Firestore → Rules → Simulator

Your POS application is now secure with proper user data isolation!