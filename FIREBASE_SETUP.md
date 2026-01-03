# Firebase Integration Guide for HappyVille Booking System

## Overview
Your booking system now integrates with **Firebase Firestore** for real-time booking management. This provides a centralized database that both customers and admins can access.

## Features Implemented

### ✅ Customer Booking (index.html + landing.js)
- **Save bookings to Firebase** automatically when customers submit the booking form
- **Fallback system**: If Firebase fails, bookings are saved to Google Sheets and localStorage
- **Real-time confirmation** with unique booking IDs

### ✅ Admin Dashboard (admin.html + admin.js)
- **Load all bookings** from Firebase
- **Filter bookings** by date, status, or activity
- **Approve bookings** - Change status to "confirmed"
- **Cancel bookings** - Change status to "cancelled"
- **Complete bookings** - Mark as "completed"
- **Delete bookings** - Permanently remove from database
- **Edit bookings** - Update any booking details
- **Export to CSV** - Download booking reports

## Firebase Functions Available

### In `pages/js/firebase.js`:

```javascript
// 1. Add a new booking
addBooking(bookingData) 
// Returns: { success: true, bookingId: "abc123" }

// 2. Get all bookings (with optional filters)
getAllBookings({ date: "2026-01-15", status: "pending" })
// Returns: { success: true, data: [...], count: 10 }

// 3. Update booking status
updateBookingStatus(bookingId, "confirmed")
// Status options: 'pending', 'confirmed', 'cancelled', 'completed'

// 4. Delete a booking
deleteBooking(bookingId)

// 5. Update booking details
updateBooking(bookingId, { name: "New Name", phone: "123456" })
```

## How It Works

### Customer Makes a Booking:
1. Customer fills out the booking form on `index.html`
2. Form submission triggers `landing.js`
3. **Primary**: Try to save to **Firebase Firestore**
4. **Fallback 1**: If Firebase fails, try **Google Sheets**
5. **Fallback 2**: If both fail, save to **localStorage**
6. Customer receives confirmation with booking ID

### Admin Manages Bookings:
1. Admin logs into `admin.html`
2. Dashboard loads bookings from **Firebase** (primary source)
3. Admin can:
   - **View** all bookings in a table
   - **Filter** by date, status, activity, or search term
   - **Approve** bookings (dropdown or button)
   - **Cancel** bookings (dropdown or button)
   - **Edit** booking details
   - **Delete** bookings permanently
   - **Export** to CSV for reporting

### Status Workflow:
```
Pending (initial) → Confirmed (approved) → Completed (after event)
                 ↘ Cancelled (if needed)
```

## Firebase Configuration

### Current Setup:
- **Project**: happpyvillebooking
- **Database**: Firestore (NoSQL)
- **Collection**: `bookings`
- **Authentication**: Public read/write (needs securing!)

### Document Structure:
```json
{
  "bookingId": "HV1704326400123",
  "name": "John Doe",
  "phone": "0731234567",
  "email": "john@example.com",
  "activity": "general-1",
  "activityName": "General Admission 1hr",
  "kids": 2,
  "adults": 1,
  "date": "2026-01-15",
  "time": "10:00",
  "total": 360,
  "notes": "Birthday party",
  "gripSocks": true,
  "waiver": true,
  "status": "pending",
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

## Security Recommendations

### 🔒 IMPORTANT: Secure Your Firebase Database!

Currently, your Firebase is open to the public. **You MUST add security rules**:

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: `happpyvillebooking`
3. Navigate to **Firestore Database** → **Rules**
4. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow customers to create bookings (but not read others)
    match /bookings/{bookingId} {
      allow create: if request.auth == null; // Allow anonymous booking creation
      allow read, update, delete: if request.auth != null; // Only authenticated admins
    }
  }
}
```

### For Better Security (Recommended):
1. **Enable Firebase Authentication** for admin users
2. **Add admin role** to specific users
3. **Use these rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bookings/{bookingId} {
      // Anyone can create bookings
      allow create: if true;
      
      // Only admins can read/update/delete
      allow read, update, delete: if request.auth != null 
        && get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Admins collection (store admin UIDs)
    match /admins/{adminId} {
      allow read, write: if false; // Manually manage this
    }
  }
}
```

## Testing Your Integration

### Test Customer Booking:
1. Open `index.html` in browser
2. Click "Book Now"
3. Fill out the form
4. Submit and check:
   - ✅ Success message appears
   - ✅ Check Firebase Console for new document
   - ✅ Check browser console for "✅ Booking saved to Firebase"

### Test Admin Functions:
1. Open `admin.html` and login
2. **Load Bookings**: Should see all Firebase bookings
3. **Approve**: Change status dropdown to "Confirmed"
4. **Cancel**: Change status dropdown to "Cancelled"
5. **Edit**: Click Edit button, modify, save
6. **Delete**: Click Delete button, confirm
7. Check Firebase Console to verify changes

## Troubleshooting

### Bookings not appearing in Firebase?
- Check browser console for errors
- Verify Firebase config in `pages/js/firebase.js`
- Check Firebase security rules (might be blocking writes)
- Ensure internet connection is active

### Admin can't load bookings?
- Check console: "❌ Error loading from Firebase"
- Verify Firebase rules allow reads
- Check if collection name is correct: `bookings`

### Changes not syncing?
- Hard refresh browser (Ctrl + Shift + R)
- Check Firebase Console to see if data is actually updated
- Verify `updateBookingStatus()` is being called

## Maintenance

### Backup Your Data:
1. Go to Firebase Console
2. Firestore Database → Export
3. Schedule regular exports

### Monitor Usage:
1. Firebase Console → Usage tab
2. Check read/write counts
3. Ensure you're within free tier limits

### Clean Old Bookings:
```javascript
// Add a scheduled function to delete bookings older than 6 months
// (Create in Firebase Functions)
```

## Support
If you encounter issues:
1. Check browser console for error messages
2. Check Firebase Console for security rule violations
3. Verify your internet connection
4. Test with Firebase emulator first (optional)

---

## Next Steps
1. ✅ Set up Firebase security rules
2. ✅ Add Firebase Authentication for admin login
3. ✅ Test all booking scenarios
4. ✅ Set up automated backups
5. ✅ Monitor Firebase usage and costs
