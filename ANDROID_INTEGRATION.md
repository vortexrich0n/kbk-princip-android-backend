# Android App Integration Guide - KBK Princip

## Profile Screen Updates

### Remove from Profile Screen
- ❌ **Bezbednost (Security)** - Completely remove this section

### Profile Screen Sections (After Update)

1. **Članarina (Membership)**
   - Status: Active/Inactive
   - Type: VIP/Basic
   - Expiry date

2. **Promeni lozinku (Change Password)** ✅
   - Dialog/Screen with 3 input fields
   - API: `POST /api/change-password`

3. **Obaveštenja (Notifications)** ✅
   - Settings screen with toggles
   - API: `GET/PUT /api/notification-settings`

4. **Odjavi se (Sign Out)**
   - Clear token and redirect to login

---

## Implementation Details

### 1. Change Password Screen (In-App)

```kotlin
// ProfileViewModel.kt
fun changePassword(currentPassword: String, newPassword: String) {
    viewModelScope.launch {
        val token = getAuthToken()
        val response = apiService.changePassword(
            token = "Bearer $token",
            body = ChangePasswordRequest(
                currentPassword = currentPassword,
                newPassword = newPassword
            )
        )

        if (response.isSuccessful) {
            // Show success message
            showSnackbar("Lozinka je uspešno promenjena")
        } else {
            // Show error
            val error = response.body()?.error ?: "Greška"
            showSnackbar(error)
        }
    }
}

// ApiService.kt
@POST("/api/change-password")
suspend fun changePassword(
    @Header("Authorization") token: String,
    @Body body: ChangePasswordRequest
): Response<ChangePasswordResponse>

data class ChangePasswordRequest(
    val currentPassword: String,
    val newPassword: String
)
```

### 2. Notifications Settings Screen (In-App)

```kotlin
// NotificationSettingsScreen.kt
@Composable
fun NotificationSettingsScreen() {
    Column {
        Text("Obaveštenja", style = MaterialTheme.typography.h1)

        SwitchPreference(
            title = "Istek članarine",
            subtitle = "3 dana pre isteka",
            checked = settings.membershipExpiry,
            onCheckedChange = { updateSetting("membershipExpiry", it) }
        )

        SwitchPreference(
            title = "Podsetnik za trening",
            subtitle = "Dnevni podsetnik",
            checked = settings.trainingReminder,
            onCheckedChange = { updateSetting("trainingReminder", it) }
        )

        SwitchPreference(
            title = "Promocije i ponude",
            subtitle = "Specijalne ponude kluba",
            checked = settings.promotions,
            onCheckedChange = { updateSetting("promotions", it) }
        )

        SwitchPreference(
            title = "Potvrde dolazaka",
            subtitle = "Kada skenirate QR kod",
            checked = settings.arrivalConfirmation,
            onCheckedChange = { updateSetting("arrivalConfirmation", it) }
        )
    }
}

// API Call
@GET("/api/notification-settings")
suspend fun getNotificationSettings(
    @Header("Authorization") token: String
): NotificationSettingsResponse

@PUT("/api/notification-settings")
suspend fun updateNotificationSettings(
    @Header("Authorization") token: String,
    @Body settings: NotificationSettings
): Response<Unit>
```

### 3. Attendance Tracking (Home Screen)

```kotlin
// When QR Code is scanned
fun recordAttendance(qrCode: String) {
    viewModelScope.launch {
        val response = apiService.recordAttendance(
            token = "Bearer $token",
            body = AttendanceRequest(qrCode = qrCode)
        )

        if (response.isSuccessful) {
            val data = response.body()
            showSuccessDialog(
                "Dolazak evidentiran!",
                "Broj dolazaka ovog meseca: ${data.attendance.monthlyTotal}"
            )
        }
    }
}

// API
@POST("/api/attendance")
suspend fun recordAttendance(
    @Header("Authorization") token: String,
    @Body body: AttendanceRequest
): AttendanceResponse

// Get attendance history
@GET("/api/attendance")
suspend fun getAttendanceHistory(
    @Header("Authorization") token: String,
    @Query("limit") limit: Int = 30,
    @Query("offset") offset: Int = 0
): AttendanceHistoryResponse
```

---

## API Endpoints Summary

| Feature | Method | Endpoint | Headers | Body |
|---------|--------|----------|---------|------|
| Change Password | POST | `/api/change-password` | Authorization: Bearer {token} | `{ currentPassword, newPassword }` |
| Get Notifications | GET | `/api/notification-settings` | Authorization: Bearer {token} | - |
| Update Notifications | PUT | `/api/notification-settings` | Authorization: Bearer {token} | `{ membershipExpiry, trainingReminder, promotions, arrivalConfirmation }` |
| Record Attendance | POST | `/api/attendance` | Authorization: Bearer {token} | `{ qrCode }` |
| Get Attendance History | GET | `/api/attendance` | Authorization: Bearer {token} | - |

---

## Error Handling

All API responses follow this format:

**Success:**
```json
{
  "ok": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "error": "Error message in Serbian"
}
```

Common error codes:
- 401: Unauthorized (invalid/expired token)
- 403: Forbidden (email not verified, membership expired)
- 400: Bad request (validation error)
- 500: Server error

---

## Automatic Features (No UI Needed)

### Membership Expiry Notifications
- Runs automatically every day at 9:00 AM
- Sends email 3 days before membership expires
- Only sends if user has `membershipExpiry` notification enabled
- No Android implementation needed (handled by backend)

---

## UI/UX Requirements

1. **Profile Screen**
   - Remove "Bezbednost" section completely
   - Keep clean layout with icons for each section
   - Use Material Design 3 components

2. **Change Password Dialog**
   - Show in-app dialog/bottom sheet
   - 3 password fields with visibility toggle
   - Real-time validation
   - Loading state while API call
   - Success/Error feedback

3. **Notifications Screen**
   - Simple switch list
   - Save automatically on toggle (no save button)
   - Show loading state during API calls

4. **Attendance**
   - Show success animation after QR scan
   - Display monthly attendance count
   - Option to view history in separate screen