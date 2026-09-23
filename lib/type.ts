// ─── Auth Types ───────────────────────────────────────────────────────────────
export type LoginState = {
  success: boolean;
  message: string;
};

export type RegistrationPayload = {
  name: string;
  email: string;
  password: string;
  bio?: string;
  profilePhoto?: string | null;
};

export type RegistrationState = {
  error?: string | null;
  success?: boolean;
  message?: string;
};

export type IULoging = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  bio?: string;
  image?: FileList;
};

// ─── User / Profile Types ─────────────────────────────────────────────────────
export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";
export type ActiveStatus = "ACTIVE" | "BANNED" | "INACTIVE";
export type UserStatus = "BAN" | "UNBAN";

export type Profile = {
  id: string;
  profilePhoto?: string | null;
  bio?: string | null;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  isAvailable: ActiveStatus;
  role: UserRole;
  userStatus: UserStatus;
  createdAt: string;
  updatedAt: string;
  profile?: Profile | null;
};

export type MeResponse = {
  success: boolean;
  message: string;
  data: {
    profile: User;
  };
};

// ─── Category Types ───────────────────────────────────────────────────────────
export type Category = {
  id: string;
  catagoryName: string;
  userId: string;
  CreatedAt: string;
  updatedAt: string;
};

// ─── Property Types ───────────────────────────────────────────────────────────
export type AvailabilityStatus = "AVAILABLE" | "NOT_AVAILABLE";

export type Property = {
  id: string;
  title: string;
  description: string;
  location: string;
  pricePerMonth: number;
  image: string;
  amenities: string[];
  isAvailable: AvailabilityStatus;
  categoryId?: string | null;
  landlordId: string;
  createdAt: string;
  updatedAt: string;
  landlord?: Pick<User, "id" | "name" | "email">;
  catagory?: Category | null;
  rentalRequests?: RentalRequest[];
  reviews?: Review[];
};

export type CreatePropertyPayload = {
  title: string;
  description: string;
  location: string;
  pricePerMonth: number;
  image: string;
  amenities: string[];
  isAvailable?: AvailabilityStatus;
  categoryName: string;
};

// ─── Rental Request Types ─────────────────────────────────────────────────────
export type RequestStatus = "PENDING" | "APPROVED" | "CONFIRMED" | "REJECTED";

export type RentalRequest = {
  id: string;
  status: RequestStatus;
  startDate: string;
  endDate: string;
  tenantId: string;
  propertyId: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  tenant?: Pick<User, "id" | "name" | "email">;
  property?: Property;
  subscriptions?: Subscription | null;
  reviews?: Review[];
};

export type CreateRentalPayload = {
  propertyId: string;
  startDate: string;
  endDate: string;
};

// ─── Payment / Subscription Types ────────────────────────────────────────────
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export type Subscription = {
  id: string;
  tenantId: string;
  rentRequestid: string;
  status: PaymentStatus;
  totalAmount: number;
  stripeCustomerId?: string | null;
  trasectionId?: string | null;
  currentPeriodEnd: string;
  createdAt: string;
  updatedAt: string;
  tenant?: Pick<User, "id" | "name" | "email">;
  rentalRequest?: RentalRequest;
};

// ─── Review Types ─────────────────────────────────────────────────────────────
export type Review = {
  id: string;
  rating: number;
  comment?: string | null;
  tenantId: string;
  propertyId: string;
  rentelRequestId: string;
  createdAt: string;
  updatedAt: string;
  tenant?: Pick<User, "id" | "name" | "email">;
  property?: Pick<Property, "id" | "title" | "location">;
};

export type CreateReviewPayload = {
  rentelid: string;
  rating: number;
  comment?: string;
};

// ─── Generic API Response ─────────────────────────────────────────────────────
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};

export type PaginatedResponse<T> = ApiResponse<T> & {
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
};
