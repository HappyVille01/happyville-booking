// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjUL0TvNpT-hX-21nhNs31knHt8CwhMxM",
  authDomain: "happpyvillebooking.firebaseapp.com",
  databaseURL: "https://happpyvillebooking-default-rtdb.firebaseio.com",
  projectId: "happpyvillebooking",
  storageBucket: "happpyvillebooking.firebasestorage.app",
  messagingSenderId: "627396024902",
  appId: "1:627396024902:web:010a34b8878766bf4c4847",
  measurementId: "G-LQD9TH4T3E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================
// FIREBASE BOOKING FUNCTIONS
// ============================================

/**
 * Add a new booking to Firestore
 * @param {Object} bookingData - The booking information
 * @returns {Promise<Object>} - Result with success status and booking ID
 */
export async function addBooking(bookingData) {
    try {
        const bookingsRef = collection(db, 'bookings');
        
        const bookingWithTimestamp = {
            ...bookingData,
            status: bookingData.status || 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(bookingsRef, bookingWithTimestamp);
        
        console.log('✅ Booking added to Firebase:', docRef.id);
        return {
            success: true,
            bookingId: docRef.id,
            message: 'Booking successfully created'
        };
    } catch (error) {
        console.error('❌ Error adding booking to Firebase:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get all bookings from Firestore
 * @param {Object} filters - Optional filters (date, status, activity)
 * @returns {Promise<Array>} - Array of bookings
 */
export async function getAllBookings(filters = {}) {
    try {
        const bookingsRef = collection(db, 'bookings');
        let q = query(bookingsRef, orderBy('createdAt', 'desc'));

        // Apply filters if provided
        if (filters.status) {
            q = query(bookingsRef, where('status', '==', filters.status), orderBy('createdAt', 'desc'));
        }
        if (filters.date) {
            q = query(bookingsRef, where('date', '==', filters.date), orderBy('createdAt', 'desc'));
        }
        if (filters.activity) {
            q = query(bookingsRef, where('activity', '==', filters.activity), orderBy('createdAt', 'desc'));
        }

        const querySnapshot = await getDocs(q);
        const bookings = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            bookings.push({
                id: doc.id,
                ...data,
                // Convert Firestore Timestamps to ISO strings for easier handling
                createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
            });
        });

        console.log(`✅ Retrieved ${bookings.length} bookings from Firebase`);
        return {
            success: true,
            data: bookings,
            count: bookings.length
        };
    } catch (error) {
        console.error('❌ Error getting bookings from Firebase:', error);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
}

/**
 * Update booking status (approve/cancel/complete)
 * @param {string} bookingId - The booking document ID
 * @param {string} newStatus - The new status (confirmed, cancelled, completed)
 * @returns {Promise<Object>} - Result with success status
 */
export async function updateBookingStatus(bookingId, newStatus) {
    try {
        const bookingRef = doc(db, 'bookings', bookingId);
        
        await updateDoc(bookingRef, {
            status: newStatus,
            updatedAt: serverTimestamp()
        });

        console.log(`✅ Booking ${bookingId} status updated to: ${newStatus}`);
        return {
            success: true,
            message: `Booking ${newStatus} successfully`
        };
    } catch (error) {
        console.error('❌ Error updating booking status:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Delete a booking from Firestore
 * @param {string} bookingId - The booking document ID
 * @returns {Promise<Object>} - Result with success status
 */
export async function deleteBooking(bookingId) {
    try {
        const bookingRef = doc(db, 'bookings', bookingId);
        await deleteDoc(bookingRef);

        console.log(`✅ Booking ${bookingId} deleted from Firebase`);
        return {
            success: true,
            message: 'Booking deleted successfully'
        };
    } catch (error) {
        console.error('❌ Error deleting booking:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Update booking details
 * @param {string} bookingId - The booking document ID
 * @param {Object} updates - Object with fields to update
 * @returns {Promise<Object>} - Result with success status
 */
export async function updateBooking(bookingId, updates) {
    try {
        const bookingRef = doc(db, 'bookings', bookingId);
        
        await updateDoc(bookingRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });

        console.log(`✅ Booking ${bookingId} updated successfully`);
        return {
            success: true,
            message: 'Booking updated successfully'
        };
    } catch (error) {
        console.error('❌ Error updating booking:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Export db for direct access if needed
export { db };