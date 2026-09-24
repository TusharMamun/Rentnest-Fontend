# RentNest — API Integration Reference

This document maps every frontend component and server action to its corresponding backend endpoint.  
Backend base URL is read from the `API_URL` environment variable.

---

## Environment Variables

| Variable | Location | Purpose |
|---|---|---|
| `API_URL` | `rentnextfontend/.env` | Backend base URL (e.g. `http://localhost:5000`) |
| `JWT_ACCESS_SECRET` | `rentnextfontend/.env` | Verifies access tokens in `proxy.ts` middleware |
| `JWT_REFRESH_SECRET` | `rentnextfontend/.env` | Verifies refresh tokens in `proxy.ts` middleware |
| `IMGBB_API_KEY` | `rentnextfontend/.env` | ImgBB image upload key (used in `imageUpload()`) |
| `NEXT_PUBLIC_API_URL` | `rentnextfontend/.env` | Public base URL (used in edit-property client fetch) |

---

## Auth & Session

| Frontend | File | Endpoint | Method | Auth |
|---|---|---|---|---|
| Login form submit | `(auth)/login/page.tsx` → `loginAction()` | `POST /api/auth/login` | POST | Public |
| Register form submit | `(auth)/signup/page.tsx` → `registrationAction()` | `POST /api/auth/register` | POST | Public |
| Auto-login after register | `registrationAction()` | `POST /api/auth/login` | POST | Public |
| Get current user profile | `getMe()` in `lib/api.ts` | `GET /api/auth/me` | GET | Cookie |
| Logout | `logout()` in `lib/api.ts` | (cookie deletion only — no backend call) | — | — |
| Refresh access token | `refreshApi()` in `lib/refreshToken.ts` | `POST /api/auth/refresh-token` | POST | Cookie |
| Middleware token verify | `src/proxy.ts` | (local JWT verify — no HTTP call) | — | — |

**Cookie flow:**  
`loginAction()` and `registrationAction()` call the backend, receive `accessToken` + `refreshToken` in the response body, then set them as `httpOnly` cookies via Next.js `cookies()`.  
`proxy.ts` reads these cookies on every request to gate protected routes before the page renders.

---

## Public (Unauthenticated) Endpoints

| Frontend | File | Endpoint | Method | Cache Tag |
|---|---|---|---|---|
| Homepage featured properties | `(ClintAppliction)/page.tsx` → `getPublicProperties()` | `GET /api/properties` | GET | `properties` (60 s) |
| Homepage categories | `(ClintAppliction)/page.tsx` → `getPublicCategories()` | `GET /api/categories` | GET | `categories` (1 hr) |
| Properties listing page | `PropertiesResults.tsx` → `getPublicProperties(params)` | `GET /api/properties?searchTerm=&location=&catagoyName=&minPrice=&maxPrice=` | GET | `properties` (60 s) |
| Property detail page | `(ClintAppliction)/properties/[id]/page.tsx` → `getPublicPropertyById(id)` | `GET /api/properties/:id` | GET | `property-{id}` (60 s) |
| Sidebar category filter | `PropertiesFilters.tsx` (categories passed from page) | `GET /api/categories` | GET | `categories` (1 hr) |

**Query parameters for `GET /api/properties`:**

| Param | Type | Description |
|---|---|---|
| `searchTerm` | string | Searches `title`, `location`, `description` |
| `location` | string | Exact or partial location match |
| `catagoyName` | string | Filter by category name |
| `minPrice` | number | Minimum `pricePerMonth` |
| `maxPrice` | number | Maximum `pricePerMonth` |

---

## Authentication (User Registration & Profile)

Mounted at `/api/auth` via `userAuthRouter`.

| Frontend | File | Endpoint | Method | Auth |
|---|---|---|---|---|
| Register | `registrationAction()` | `POST /api/auth/register` | POST | Public |
| Get my profile | `getMe()` | `GET /api/auth/me` | GET | Cookie |
| Update my profile | (not yet wired — endpoint exists) | `PUT /api/auth/update_myprofile` | PUT | Cookie |

---

## Landlord — Property Management

Mounted at `/api/landlord`. Requires `LANDLORD` or `ADMIN` role cookie.

| Frontend | File | Endpoint | Method | Revalidates |
|---|---|---|---|---|
| My Properties page | `dashboard/landlord/properties/page.tsx` → `getLandlordProperties()` | `GET /api/landlord/properties` | GET | tag `landlord-properties` |
| Create property form | `createProperty/page.tsx` → `createPropertyAction()` → `createProperty()` | `POST /api/landlord/properties` | POST | `landlord-properties`, `properties` |
| Edit property form | `editProperty/[id]/page.tsx` → `updatePropertyAction()` → `updateProperty()` | `PUT /api/landlord/properties/:id` | PUT | `landlord-properties`, `properties`, `property-{id}` |
| Delete property button | `LandlordPropertyCard.tsx` → `deletePropertyAction()` → `deleteProperty()` | `DELETE /api/landlord/properties/:id` | DELETE | `landlord-properties`, `properties` |
| Category selector | `createProperty`, `editProperty` → `getLandlordCategories()` | `GET /api/landlord/categories` | GET | `categories` |

**`POST /api/landlord/properties` request body:**

```json
{
  "title": "string",
  "description": "string",
  "location": "string",
  "pricePerMonth": 45000,
  "image": "https://...",
  "amenities": ["WiFi", "Parking"],
  "categoryName": "Apartment",
  "isAvailable": "AVAILABLE"
}
```

---

## Landlord — Rental Request Management

| Frontend | File | Endpoint | Method | Revalidates |
|---|---|---|---|---|
| Requests list | `dashboard/landlord/requests/page.tsx` → `getLandlordRentalRequests()` | `GET /api/landlord/requests` | GET | tag `landlord-requests` |
| Approve request button | `LandlordRequestCard.tsx` → `approveRequestAction()` → `updateRentalRequestStatus()` | `PATCH /api/landlord/requests/:id` | PATCH | `landlord-requests`, `rentals` |
| Reject request button | `LandlordRequestCard.tsx` → `rejectRequestAction()` → `updateRentalRequestStatus()` | `PATCH /api/landlord/requests/:id` | PATCH | `landlord-requests`, `rentals` |

**`PATCH /api/landlord/requests/:id` request body:**

```json
{ "status": "APPROVED" }
```
Allowed values: `"PENDING"` · `"APPROVED"` · `"REJECTED"`

---

## Tenant — Rental Requests

Mounted at `/api`. Requires `TENANT` or `ADMIN` role cookie.

| Frontend | File | Endpoint | Method | Revalidates |
|---|---|---|---|---|
| Submit rent request | `RentRequestForm.tsx` → `createRentalAction()` → `createRentalRequest()` | `POST /api/rentals` | POST | tag `rentals` |
| My Rentals page | `dashboard/rentals/page.tsx` → `getMyRentalRequests()` | `GET /api/rentals/my` | GET | tag `rentals` |

**`POST /api/rentals` request body:**

```json
{
  "propertyId": "uuid",
  "startDate": "2026-10-01T00:00:00.000Z",
  "endDate":   "2026-11-01T00:00:00.000Z"
}
```

> `totalPrice` is set server-side to `property.pricePerMonth` — do not send it from the client.

---

## Payments (Stripe)

Mounted at `/api/payments`. Requires `TENANT` or `ADMIN` role cookie.

| Frontend | File | Endpoint | Method | Notes |
|---|---|---|---|---|
| Pay Now button | `RentalCard.tsx` → `startCheckoutAction()` → `createCheckoutSession()` | `POST /api/payments/checkout` | POST | Returns `{ checkOutUrl }` — redirect client to this URL |
| Payment History page | `dashboard/payments/page.tsx` → `getMyPayments()` | `GET /api/payments/getAllpaymnet` | GET | Returns `Subscription[]` |
| Stripe webhook (backend only) | `payment.controller.ts` | `POST /payments/webhooks` | POST | Stripe-signed raw body — not called by frontend |
| Payment success page | `(ClintAppliction)/success/page.tsx` | Stripe redirects to `/success?session_id=...` | — | Static page, no API call |
| Payment cancel page | `(ClintAppliction)/cancel/page.tsx` | Stripe redirects to `/cancel` | — | Static page, no API call |

**`POST /api/payments/checkout` request body:**

```json
{ "requestId": "uuid-of-rental-request" }
```

**Response:**

```json
{ "success": true, "data": { "checkOutUrl": "https://checkout.stripe.com/..." } }
```

**Stripe webhook events handled by backend:**

| Event | Action |
|---|---|
| `checkout.session.completed` | Sets `Subscription.status = COMPLETED`, `RentalRequest.status = CONFIRMED`, `Property.isAvailable = NOT_AVAILABLE` |
| `checkout.session.expired` | Sets `Subscription.status = FAILED` |
| `payment_intent.payment_failed` | Sets `Subscription.status = FAILED` |

---

## Reviews

Mounted at `/api`. Requires `TENANT` or `ADMIN` role cookie.

| Frontend | File | Endpoint | Method | Revalidates |
|---|---|---|---|---|
| Submit review form | `ReviewSection.tsx` → `submitReviewAction()` → `createReview()` | `POST /api/reviews` | POST | tag `reviews` |
| My Reviews page (data source) | `dashboard/reviews/page.tsx` → `getMyRentalRequests()` | `GET /api/rentals/my` | GET | Reviews are embedded in `RentalRequest.reviews[]` |

**`POST /api/reviews` request body:**

```json
{
  "rentelid": "uuid-of-rental-request",
  "rating": 5,
  "comment": "Excellent property and helpful landlord."
}
```

> Only one review per `(tenantId, propertyId)` pair is allowed — the backend enforces a unique constraint.

---

## Admin

Mounted at `/api/admin`. Requires `ADMIN` role cookie.

| Frontend | File | Endpoint | Method | Revalidates |
|---|---|---|---|---|
| User Management page | `dashboard/admin/users/page.tsx` → `adminGetAllUsers()` | `GET /api/admin/users` | GET | tag `admin-users` |
| Ban user button | `AdminUserRow.tsx` → `banUserAction()` → `adminUpdateUserStatus()` | `PATCH /api/admin/users/:id` | PATCH | `admin-users` |
| Unban user button | `AdminUserRow.tsx` → `unbanUserAction()` → `adminUpdateUserStatus()` | `PATCH /api/admin/users/:id` | PATCH | `admin-users` |
| All Properties page | `dashboard/admin/properties/page.tsx` → `adminGetAllProperties()` | `GET /api/admin/properties` | GET | tag `admin-properties` |
| All Rentals page | `dashboard/admin/rentals/page.tsx` → `adminGetAllRentals()` | `GET /api/admin/rentals` | GET | tag `admin-rentals` |
| Categories page | `dashboard/admin/categories/page.tsx` → `getPublicCategories()` + `adminGetAllProperties()` | `GET /api/categories` + `GET /api/admin/properties` | GET | `categories`, `admin-properties` |
| Dashboard overview (admin) | `dashboard/page.tsx` → `adminGetAllProperties()` + `adminGetAllRentals()` + `adminGetAllUsers()` | above three | GET | — |
| Admin payment list | `adminGetAllPayments()` | `GET /api/payments/getAllpaymnet` | GET | tag `admin-payments` |

**`PATCH /api/admin/users/:id` request body:**

```json
{ "userStatus": "BAN" }
```
Allowed values: `"BAN"` · `"UNBAN"`

> **Security note:** The `PATCH /api/admin/users/:id` route has its `auth(Role.ADMIN)` middleware commented out in the backend. Any authenticated user can currently call it. Fix: uncomment the auth guard in `RentNest/src/Modules/Admin/admin.route.ts`.

---

## Image Upload (ImgBB)

All property images are uploaded to ImgBB before the property is created or updated. The returned URL is stored in `Property.image`.

| Function | File | External URL | Trigger |
|---|---|---|---|
| `imageUpload(file)` | `lib/api.ts` | `POST https://api.imgbb.com/1/upload?key={IMGBB_API_KEY}` | Create/edit property form submit |

Profile photo uploads during registration use the same function.

---

## Data Flow Summary

```
Browser                    Next.js Server              Express Backend
──────────────────────────────────────────────────────────────────────
1. User visits /properties
   └─ page.tsx (Server Component)
      └─ getPublicProperties()  ──── GET /api/properties ──────────▶ Prisma DB
                                ◀─── Property[] ────────────────────

2. User logs in
   └─ loginAction() (Server Action)
      └─ POST /api/auth/login ──────────────────────────────────────▶ bcrypt + JWT
         ◀─── { accessToken, refreshToken } ─────────────────────────
         └─ cookies().set("accessToken") — stored as httpOnly cookie

3. Tenant submits rent request
   └─ createRentalAction() (Server Action)
      └─ authApi() reads accessToken cookie
         └─ POST /api/rentals ────────────────────────────────────────▶ Prisma DB
            ◀─── RentalRequest ──────────────────────────────────────

4. Landlord approves request
   └─ approveRequestAction() (Server Action)
      └─ PATCH /api/landlord/requests/:id ────────────────────────────▶ Prisma DB
         └─ revalidateTag("landlord-requests", "max")

5. Tenant pays
   └─ startCheckoutAction() (Server Action)
      └─ POST /api/payments/checkout ──────────────────────────────────▶ Stripe API
         ◀─── { checkOutUrl } ─────────────────────────────────────────
         └─ router.push(checkOutUrl) — browser redirects to Stripe

6. Stripe webhook (after payment)
   └─ POST /payments/webhooks ──────────────────────────────────────────▶ Prisma $transaction
      └─ Subscription COMPLETED + RentalRequest CONFIRMED + Property NOT_AVAILABLE
```

---

## Standard API Response Shape

All endpoints return a consistent envelope:

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { ... }
}
```

On error:

```json
{
  "success": false,
  "message": "Error description",
  "errorDetails": { ... }
}
```

`lib/api.ts` → `api()` / `authApi()` return `{ success: false, message }` on non-2xx responses so every caller can check `result?.success` before using the data.

---

## Cache Tags Reference

| Tag | Set by | Invalidated when |
|---|---|---|
| `me` | `getMe()` fetch | `logout()`, profile update |
| `properties` | `getPublicProperties()`, `getPublicPropertyById()` | Property created, updated, deleted |
| `property-{id}` | `getPublicPropertyById(id)` | That property updated or deleted |
| `categories` | `getPublicCategories()`, `getLandlordCategories()` | (not yet invalidated — categories are static) |
| `landlord-properties` | `getLandlordProperties()` | Property created, updated, deleted |
| `landlord-requests` | `getLandlordRentalRequests()` | Request status updated |
| `rentals` | `getMyRentalRequests()` | Rental created, request status updated |
| `reviews` | `getMyRentalRequests()` (embedded) | Review submitted |
| `payments` | `getMyPayments()` | (Stripe webhook handles state — no frontend invalidation needed) |
| `admin-users` | `adminGetAllUsers()` | User ban/unban |
| `admin-properties` | `adminGetAllProperties()` | (reads-only admin view) |
| `admin-rentals` | `adminGetAllRentals()` | (reads-only admin view) |
| `admin-payments` | `adminGetAllPayments()` | (reads-only admin view) |
