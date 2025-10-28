# Login Redirect Loop Issue - Diagnosis & Fixes

## Problem Summary
User enters credentials at `http://localhost:3000/login` → logs in successfully → window visible for 1 second → automatically redirects back to `/login` → stuck in loop where user is not actually logged in.

---

## Root Causes Identified

### 1. **Hardcoded API URL (FIXED ✅)**
**File:** `frontend/src/services/auth.js`
- **Was:** `api.post('http://localhost:5000/api/auth/login', ...)`
- **Issue:** Hardcoded URL bypasses axios interceptors and configuration
- **Fix:** Changed to `api.post('/auth/login', ...)` to use the axios instance

### 2. **Overly Aggressive Token Clearing on Page Load (FIXED ✅)**
**File:** `frontend/src/context/AuthContext.js`
- **Issue:** `initAuth()` calls `getMe()` on page load to verify token. If ANY error occurs (network hiccup, temporary server issue), the entire token + user are cleared
- **Scenario causing redirect loop:**
  1. User logs in ✅ → token + user saved to localStorage
  2. User redirects to home or refreshes page
  3. `AuthContext` runs `initAuth()` → calls `getMe()`
  4. `getMe()` fails (transient error, slow network, etc.) ❌
  5. Token is cleared → `isAuthenticated` becomes `false`
  6. User is redirected back to `/login` 🔄
  7. Cycle repeats

- **Fix:** Only clear token on **actual 401 (Unauthorized)** errors. For other errors (network, timeout, server error), keep the token and let it be re-verified on the next API call.

### 3. **Missing Debug Logging (FIXED ✅)**
**Files:** `frontend/src/context/AuthContext.js`, `frontend/src/services/auth.js`, `frontend/src/pages/AuthPage.js`
- **Issue:** No clear visibility into what's happening during login flow
- **Fix:** Added comprehensive console logs with emoji indicators:
  - 🔄 = In progress
  - ✅ = Success
  - ❌ = Error
  - ⚠️ = Warning
  - 📦 = Data received
  - 🔍 = Checking state

---

## Changes Made

### File 1: `frontend/src/services/auth.js`
✅ Fixed hardcoded API URL in `login()` method  
✅ Added response logging to see what backend returns  
✅ Better error logging with response data

### File 2: `frontend/src/context/AuthContext.js`
✅ Improved `initAuth()` to distinguish between 401 (token expired) and other errors  
✅ Added detailed console logging for debugging  
✅ Enhanced `login()` method with token validation and better error messages

### File 3: `frontend/src/pages/AuthPage.js`
✅ Added debug logging to track authentication state changes  
✅ Added `/register` path to redirect loop prevention  
✅ Clearer logging of navigation decisions

---

## How to Verify the Fix

### Step 1: Open Browser Developer Tools
1. Go to `http://localhost:3000/login`
2. Open DevTools: Press **F12** or Right-click → Inspect
3. Go to the **Console** tab

### Step 2: Attempt Login
1. Enter valid credentials (email + password)
2. Watch console logs appear (should see 🔄 → ✅ flow)
3. You should see:
   ```
   🔄 Attempting login with: user@example.com
   📦 Backend response: {token: "...", user: {...}}
   ✅ Login successful, user: {...}
   🔍 AuthPage - isAuthenticated: true from: /
   ✅ User is authenticated, navigating to: /
   ```

### Step 3: Refresh Page
1. Press **F5** to refresh
2. Should stay on home page (NOT redirect back to login)
3. Console should show:
   ```
   🔐 AuthContext init - savedToken exists: true
   ✅ Token verified with getMe()
   ```

---

## If Issue Persists

### Check 1: Backend is Running
```bash
curl http://localhost:5000/api/health
# Should return: {"message":"E-commerce API is running!"}
```

### Check 2: Database Connection
- Check backend console for errors when starting
- Verify MySQL is running
- Check `.env` file has correct DB credentials

### Check 3: Verify Credentials
- Make sure you're using valid credentials
- Check backend console for login attempt logs
- Look for validation errors in browser console

### Check 4: Check Network Tab
1. In DevTools, go to **Network** tab
2. Attempt login
3. Look at the `/auth/login` request:
   - Check Response tab: should see `{token: "...", user: {...}}`
   - Check Status: should be **200 OK**
   - Check Headers: verify Content-Type is `application/json`

---

## Expected Behavior After Fix

1. ✅ Login succeeds → navigate to home page immediately
2. ✅ Refresh page → stay authenticated (no redirect to login)
3. ✅ Close browser and reopen → still authenticated
4. ✅ Browser console shows clear debug messages
5. ✅ No 1-second window flashing before redirect

---

## Files Modified

- `frontend/src/services/auth.js` - Fixed API URL, better error handling
- `frontend/src/context/AuthContext.js` - Fixed overly aggressive token clearing, added resilience
- `frontend/src/pages/AuthPage.js` - Added debug logging, prevent redirect from `/register` to `/login`

---

## Technical Details

### Token Storage Format
```javascript
// localStorage keys
localStorage.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
localStorage.user = {id, name, email}  // Serialized to JSON string
```

### API Response Format (Backend)
```javascript
// POST /api/auth/login
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Error Handling Flow
```
User Login
  ↓
authService.login() → axios POST /auth/login
  ↓
Success: return response.data (full response with token + user)
  ↓
AuthContext.login() → destructure { token, user } → setToken, setUser → save to localStorage
  ↓
AuthContext.useEffect detects isAuthenticated change
  ↓
Navigate to home page
  ↓
Page refresh → AuthContext.initAuth()
  ↓
Call authService.getMe() to verify token
  ↓
IF 401: Clear token (it's expired)
IF other error: Keep token (it's probably valid, just server issue)
  ↓
Frontend should stay authenticated
```

---

## Summary

The login redirect loop was caused by **overly aggressive token clearing** on page load when `getMe()` encountered any transient error. The fix ensures:

1. ✅ Only real 401 errors clear the token
2. ✅ Network/server errors don't break authentication
3. ✅ Clear debug logging shows what's happening
4. ✅ Proper API URL configuration (not hardcoded)
