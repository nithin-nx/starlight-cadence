/* ======================================================
   DROP EXISTING TABLES (Optional - use with caution)
====================================================== */

-- Uncomment if you want to start fresh
/*
DROP TABLE IF EXISTS 
  public.certificates,
  public.financial_records,
  public.notifications,
  public.gallery,
  public.event_participants,
  public.events,
  public.members,
  public.membership_applications,
  public.user_roles,
  public.profiles CASCADE;

DROP TYPE IF EXISTS public.app_role CASCADE;
*/

/* ======================================================
   ENUMS
====================================================== */

-- Only four user types as requested
CREATE TYPE public.app_role AS ENUM (
  'public',
  'execom',
  'treasurer',
  'faculty'
);

-- Unified status enum for all applications
CREATE TYPE public.application_status AS ENUM (
  'pending',
  'under_review',
  'approved',
  'rejected'
);

-- Unified payment status
CREATE TYPE public.payment_status AS ENUM (
  'pending',
  'paid',
  'free',
  'failed'
);

-- Financial transaction types
CREATE TYPE public.transaction_type AS ENUM (
  'income',
  'expense'
);

-- Event types
CREATE TYPE public.event_type AS ENUM (
  'workshop',
  'seminar',
  'competition',
  'meetup',
  'webinar',
  'conference',
  'hackathon',
  'training'
);

-- Department types
CREATE TYPE public.department_type AS ENUM (
  'CSE',
  'ECE',
  'EEE',
  'ME',
  'CE',
  'General'
);

-- Year of study
CREATE TYPE public.year_type AS ENUM (
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Faculty',
  'Alumni'
);

/* ======================================================
   CORE USER TABLES
====================================================== */

-- PROFILES: Base user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  department public.department_type,
  year_of_study public.year_type,
  avatar_url TEXT,
  bio TEXT,
  student_id TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~ '^[0-9]{10}$')
);

-- USER ROLES: Stores user roles (public, execom, treasurer, faculty)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'public',
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  CONSTRAINT fk_assigned_by FOREIGN KEY (assigned_by) REFERENCES auth.users(id),
  UNIQUE (user_id, role),
  CONSTRAINT valid_role_assignment CHECK (
    (role = 'public') OR 
    (assigned_by IS NOT NULL AND assigned_at IS NOT NULL)
  )
);

/* ======================================================
   MEMBERSHIP SYSTEM
====================================================== */

-- MEMBERSHIP APPLICATIONS: For new users to apply for membership
CREATE TABLE IF NOT EXISTS public.membership_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  department public.department_type NOT NULL,
  year_of_study public.year_type NOT NULL,
  date_of_birth DATE,
  address TEXT,
  payment_proof_url TEXT,
  reason_for_joining TEXT,
  previous_experience TEXT,
  status public.application_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES auth.users(id),
  CONSTRAINT valid_application CHECK (phone ~ '^[0-9]{10}$')
);

-- MEMBERS: Approved members only
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id UUID UNIQUE REFERENCES public.membership_applications(id),
  membership_number TEXT UNIQUE, -- Population moved to trigger
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  department public.department_type,
  year_of_study public.year_type,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  membership_expiry TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_approved_by FOREIGN KEY (approved_by) REFERENCES auth.users(id)
);

/* ======================================================
   EVENTS & PARTICIPATION
====================================================== */

-- EVENTS: All ISTE events
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type public.event_type NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  venue TEXT,
  online_link TEXT,
  max_participants INTEGER,
  image_url TEXT,
  is_upcoming BOOLEAN NOT NULL DEFAULT true,
  registration_open BOOLEAN NOT NULL DEFAULT true,
  registration_deadline TIMESTAMPTZ,
  fee DECIMAL(10,2) DEFAULT 0,
  organizer_id UUID REFERENCES auth.users(id),
  requires_approval BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT fk_organizer FOREIGN KEY (organizer_id) REFERENCES auth.users(id),
  CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= start_date),
  CONSTRAINT valid_registration CHECK (registration_deadline IS NULL OR registration_deadline >= start_date)
);

-- EVENT PARTICIPANTS: Who registered for events
CREATE TABLE IF NOT EXISTS public.event_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  department public.department_type,
  year_of_study public.year_type,
  payment_status public.payment_status DEFAULT 'pending',
  payment_amount DECIMAL(10,2) DEFAULT 0,
  payment_reference TEXT,
  attended BOOLEAN DEFAULT false,
  attendance_marked_by UUID REFERENCES auth.users(id),
  attendance_time TIMESTAMPTZ,
  certificate_issued BOOLEAN DEFAULT false,
  certificate_issued_at TIMESTAMPTZ,
  registered_by UUID REFERENCES auth.users(id),
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status public.application_status DEFAULT 'pending',
  notes TEXT,
  CONSTRAINT fk_registered_by FOREIGN KEY (registered_by) REFERENCES auth.users(id),
  CONSTRAINT fk_attendance_marked_by FOREIGN KEY (attendance_marked_by) REFERENCES auth.users(id),
  UNIQUE (event_id, email),
  CONSTRAINT valid_payment CHECK (
    (payment_status = 'free' AND payment_amount = 0) OR
    (payment_status IN ('pending', 'paid', 'failed'))
  )
);

/* ======================================================
   MEDIA & DOCUMENTS
====================================================== */

-- GALLERY: Event photos and media
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'document')),
  thumbnail_url TEXT,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  is_featured BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES auth.users(id)
);

-- CERTIFICATES: Generated certificates for events
-- CERTIFICATES: Fixed (Removed GENERATED ALWAYS)
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_number TEXT UNIQUE, -- Population moved to trigger
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  participant_id UUID REFERENCES public.event_participants(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  certificate_url TEXT NOT NULL,
  template_id TEXT,
  verification_code TEXT UNIQUE NOT NULL DEFAULT md5(random()::text || clock_timestamp()::text)::varchar(32),
  issued_by UUID REFERENCES auth.users(id),
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expiry_date TIMESTAMPTZ,
  is_revoked BOOLEAN DEFAULT false,
  revoked_by UUID REFERENCES auth.users(id),
  revoked_at TIMESTAMPTZ,
  revoke_reason TEXT,
  download_count INTEGER DEFAULT 0,
  last_downloaded TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  CONSTRAINT fk_issued_by FOREIGN KEY (issued_by) REFERENCES auth.users(id),
  CONSTRAINT fk_revoked_by FOREIGN KEY (revoked_by) REFERENCES auth.users(id)
);

/* ======================================================
   NOTIFICATION SYSTEM
====================================================== */

-- NOTIFICATIONS: System notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN (
    'info', 
    'warning', 
    'success', 
    'error', 
    'event', 
    'membership',
    'payment',
    'certificate',
    'system'
  )),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  target_roles public.app_role[],
  target_user_ids UUID[],
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  send_email BOOLEAN DEFAULT false,
  send_sms BOOLEAN DEFAULT false,
  starts_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

-- USER NOTIFICATIONS: Track notification delivery and read status
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  sms_sent BOOLEAN DEFAULT false,
  sms_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, notification_id)
);

/* ======================================================
   FINANCE MANAGEMENT
====================================================== */

-- FINANCIAL RECORDS: Fixed (Removed GENERATED ALWAYS)
CREATE TABLE IF NOT EXISTS public.financial_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT UNIQUE, -- Population moved to trigger
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  type public.transaction_type NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'membership_fee', 'event_registration', 'sponsorship', 'donation', 
    'merchandise', 'infrastructure', 'travel', 'food', 'prize', 'miscellaneous'
  )),
  payment_method TEXT CHECK (payment_method IN ('cash', 'online', 'cheque', 'bank_transfer')),
  reference_number TEXT,
  receipt_url TEXT,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT fk_verified_by FOREIGN KEY (verified_by) REFERENCES auth.users(id)
);

/* ======================================================
   INDEXES FOR PERFORMANCE
====================================================== */

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_department ON public.profiles(department);
CREATE INDEX IF NOT EXISTS idx_profiles_year ON public.profiles(year_of_study);

-- User roles indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_active ON public.user_roles(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_roles_user_active ON public.user_roles(user_id, is_active) WHERE is_active = true;

-- Membership applications indexes
CREATE INDEX IF NOT EXISTS idx_membership_applications_email ON public.membership_applications(email);
CREATE INDEX IF NOT EXISTS idx_membership_applications_status ON public.membership_applications(status);
CREATE INDEX IF NOT EXISTS idx_membership_applications_created_at ON public.membership_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_membership_applications_user_id ON public.membership_applications(user_id);

-- Members indexes
CREATE INDEX IF NOT EXISTS idx_members_user_id ON public.members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_membership_number ON public.members(membership_number);
CREATE INDEX IF NOT EXISTS idx_members_active ON public.members(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_members_department ON public.members(department);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_upcoming ON public.events(is_upcoming) WHERE is_upcoming = true;
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_registration_open ON public.events(registration_open) WHERE registration_open = true;
CREATE INDEX IF NOT EXISTS idx_events_organizer ON public.events(organizer_id);

-- Event participants indexes
CREATE INDEX IF NOT EXISTS idx_event_participants_event_id ON public.event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_user_id ON public.event_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_email ON public.event_participants(email);
CREATE INDEX IF NOT EXISTS idx_event_participants_payment_status ON public.event_participants(payment_status);
CREATE INDEX IF NOT EXISTS idx_event_participants_attended ON public.event_participants(attended) WHERE attended = true;
CREATE INDEX IF NOT EXISTS idx_event_participants_certificate ON public.event_participants(certificate_issued) WHERE certificate_issued = true;

-- Gallery indexes
CREATE INDEX IF NOT EXISTS idx_gallery_event_id ON public.gallery(event_id);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON public.gallery(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_featured ON public.gallery(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_gallery_public ON public.gallery(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_gallery_media_type ON public.gallery(media_type);

-- Certificates indexes
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON public.certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_event_id ON public.certificates(event_id);
CREATE INDEX IF NOT EXISTS idx_certificates_certificate_number ON public.certificates(certificate_number);
CREATE INDEX IF NOT EXISTS idx_certificates_verification_code ON public.certificates(verification_code);
CREATE INDEX IF NOT EXISTS idx_certificates_issued_at ON public.certificates(issued_at DESC);
CREATE INDEX IF NOT EXISTS idx_certificates_revoked ON public.certificates(is_revoked) WHERE is_revoked = false;

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_active ON public.notifications(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_notifications_expires ON public.notifications(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_starts_at ON public.notifications(starts_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON public.notifications(priority);

-- User notifications indexes
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON public.user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_read ON public.user_notifications(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_read ON public.user_notifications(user_id, is_read) WHERE is_read = false;

-- Financial records indexes
CREATE INDEX IF NOT EXISTS idx_financial_records_date ON public.financial_records(date DESC);
CREATE INDEX IF NOT EXISTS idx_financial_records_type ON public.financial_records(type);
CREATE INDEX IF NOT EXISTS idx_financial_records_category ON public.financial_records(category);
CREATE INDEX IF NOT EXISTS idx_financial_records_event_id ON public.financial_records(event_id);
CREATE INDEX IF NOT EXISTS idx_financial_records_verified ON public.financial_records(verified_at) WHERE verified_at IS NOT NULL;

/* ======================================================
   ENABLE ROW LEVEL SECURITY
====================================================== */

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;

/* ======================================================
   SECURITY HELPER FUNCTIONS
====================================================== */

-- Get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS public.app_role
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT role FROM public.user_roles 
  WHERE user_roles.user_id = $1 
    AND is_active = true
  ORDER BY 
    CASE role 
      WHEN 'faculty' THEN 1
      WHEN 'treasurer' THEN 2
      WHEN 'execom' THEN 3
      ELSE 4
    END
  LIMIT 1;
$$;

-- Check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(uid UUID, target_role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = uid 
      AND role = target_role
      AND is_active = true
  );
$$;

-- Check if user has any of the target roles
CREATE OR REPLACE FUNCTION public.has_any_role(uid UUID, target_roles public.app_role[])
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = uid 
      AND role = ANY(target_roles)
      AND is_active = true
  );
$$;

-- Role-specific helper functions
CREATE OR REPLACE FUNCTION public.is_faculty(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT public.has_role(uid, 'faculty');
$$;

CREATE OR REPLACE FUNCTION public.is_treasurer(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT public.has_role(uid, 'treasurer');
$$;

CREATE OR REPLACE FUNCTION public.is_execom(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT public.has_role(uid, 'execom');
$$;

-- Check if user is elevated (faculty, treasurer, or execom)
CREATE OR REPLACE FUNCTION public.is_elevated_user(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT public.has_any_role(uid, ARRAY['faculty', 'treasurer', 'execom']::public.app_role[]);
$$;

-- Check if user is a member
CREATE OR REPLACE FUNCTION public.is_member(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.members
    WHERE user_id = uid AND is_active = true
  );
$$;

/* ======================================================
   RLS POLICIES
====================================================== */

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Elevated users can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.is_elevated_user(auth.uid()));

CREATE POLICY "Faculty can manage all profiles"
ON public.profiles FOR ALL
TO authenticated
USING (public.is_faculty(auth.uid()));

-- USER ROLES POLICIES
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Faculty can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.is_faculty(auth.uid()));

-- MEMBERSHIP APPLICATIONS POLICIES
CREATE POLICY "Users can apply for membership"
ON public.membership_applications FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can view own applications"
ON public.membership_applications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Elevated users can view all applications"
ON public.membership_applications FOR SELECT
TO authenticated
USING (public.is_elevated_user(auth.uid()));

CREATE POLICY "Execom/Faculty can update applications"
ON public.membership_applications FOR UPDATE
TO authenticated
USING (public.has_any_role(auth.uid(), ARRAY['execom', 'faculty']::public.app_role[]))
WITH CHECK (public.has_any_role(auth.uid(), ARRAY['execom', 'faculty']::public.app_role[]));

-- MEMBERS POLICIES
CREATE POLICY "Users can view own membership"
ON public.members FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Elevated users can view all members"
ON public.members FOR SELECT
TO authenticated
USING (public.is_elevated_user(auth.uid()));

CREATE POLICY "Execom/Faculty can manage members"
ON public.members FOR ALL
TO authenticated
USING (public.has_any_role(auth.uid(), ARRAY['execom', 'faculty']::public.app_role[]));

-- EVENTS POLICIES
CREATE POLICY "Everyone can view events"
ON public.events FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Elevated users can manage events"
ON public.events FOR ALL
TO authenticated
USING (public.is_elevated_user(auth.uid()));

-- EVENT PARTICIPANTS POLICIES
CREATE POLICY "Users can view own registrations"
ON public.event_participants FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can register for open events"
ON public.event_participants FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE id = event_id 
      AND registration_open = true
      AND (registration_deadline IS NULL OR registration_deadline > now())
      AND (max_participants IS NULL OR (
        SELECT COUNT(*) FROM public.event_participants ep 
        WHERE ep.event_id = events.id
      ) < max_participants)
  )
);

CREATE POLICY "Elevated users can manage participants"
ON public.event_participants FOR ALL
TO authenticated
USING (public.is_elevated_user(auth.uid()));

-- GALLERY POLICIES
CREATE POLICY "Everyone can view public gallery"
ON public.gallery FOR SELECT
TO authenticated
USING (is_public = true);

CREATE POLICY "Elevated users can view all gallery"
ON public.gallery FOR SELECT
TO authenticated
USING (public.is_elevated_user(auth.uid()));

CREATE POLICY "Elevated users can manage gallery"
ON public.gallery FOR ALL
TO authenticated
USING (public.is_elevated_user(auth.uid()));

-- CERTIFICATES POLICIES
CREATE POLICY "Users can view own certificates"
ON public.certificates FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND is_revoked = false);

CREATE POLICY "Elevated users can manage certificates"
ON public.certificates FOR ALL
TO authenticated
USING (public.is_elevated_user(auth.uid()));

-- NOTIFICATIONS POLICIES
CREATE POLICY "Everyone can view active notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (
  is_active = true 
  AND (expires_at IS NULL OR expires_at > now())
  AND (starts_at IS NULL OR starts_at <= now())
  AND (
    target_roles IS NULL 
    OR array_length(target_roles, 1) = 0 
    OR public.has_any_role(auth.uid(), target_roles)
  )
);

CREATE POLICY "Elevated users can manage notifications"
ON public.notifications FOR ALL
TO authenticated
USING (public.is_elevated_user(auth.uid()));

-- USER NOTIFICATIONS POLICIES
CREATE POLICY "Users can view own notification status"
ON public.user_notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notification status"
ON public.user_notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can create notification records"
ON public.user_notifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- FINANCIAL RECORDS POLICIES
CREATE POLICY "Treasurer/Faculty can manage finances"
ON public.financial_records FOR ALL
TO authenticated
USING (public.has_any_role(auth.uid(), ARRAY['treasurer', 'faculty']::public.app_role[]));

CREATE POLICY "Execom can view finances"
ON public.financial_records FOR SELECT
TO authenticated
USING (public.is_execom(auth.uid()));

/* ======================================================
   AUTOMATION TRIGGERS
====================================================== */

-- Auto-create profile and public role for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- create profile if not exists (avoid duplicate error)
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- ensure base 'public' role exists for user (idempotent)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'public')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply updated_at trigger to relevant tables
CREATE OR REPLACE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_membership_applications_updated_at
BEFORE UPDATE ON public.membership_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_financial_records_updated_at
BEFORE UPDATE ON public.financial_records
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_members_updated_at
BEFORE UPDATE ON public.members
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-update event status based on dates
CREATE OR REPLACE FUNCTION public.update_event_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.start_date < now() THEN
    NEW.is_upcoming = false;
  ELSIF NEW.start_date >= now() THEN
    NEW.is_upcoming = true;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER check_event_date
BEFORE INSERT OR UPDATE OF start_date ON public.events
FOR EACH ROW EXECUTE FUNCTION public.update_event_status();

-- Auto-create member record when application is approved
CREATE OR REPLACE FUNCTION public.handle_approved_application()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Insert into members table (idempotent by application_id)
    INSERT INTO public.members (
      user_id,
      application_id,
      full_name,
      email,
      phone,
      department,
      year_of_study,
      approved_by
    ) VALUES (
      NEW.user_id,
      NEW.id,
      NEW.full_name,
      NEW.email,
      NEW.phone,
      NEW.department,
      NEW.year_of_study,
      NEW.reviewed_by
    )
    ON CONFLICT (application_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_application_approved
AFTER UPDATE ON public.membership_applications
FOR EACH ROW
WHEN (NEW.status = 'approved' AND OLD.status != 'approved')
EXECUTE FUNCTION public.handle_approved_application();

-- Auto-populate user notifications when new notification is created
CREATE OR REPLACE FUNCTION public.create_user_notifications()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert for all active users if no specific roles (idempotent)
  IF NEW.target_roles IS NULL OR array_length(NEW.target_roles, 1) = 0 THEN
    INSERT INTO public.user_notifications (user_id, notification_id)
    SELECT DISTINCT p.user_id, NEW.id
    FROM public.profiles p
    WHERE p.user_id IS NOT NULL
    ON CONFLICT (user_id, notification_id) DO NOTHING;
  ELSE
    -- Insert for users with specific roles (idempotent)
    INSERT INTO public.user_notifications (user_id, notification_id)
    SELECT DISTINCT ur.user_id, NEW.id
    FROM public.user_roles ur
    WHERE ur.role = ANY(NEW.target_roles)
      AND ur.is_active = true
    ON CONFLICT (user_id, notification_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_notification_created
AFTER INSERT ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.create_user_notifications();

-- Auto-create certificate when participant attendance is marked
CREATE OR REPLACE FUNCTION public.handle_participant_certificate()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_event_title TEXT;
  v_certificate_url TEXT;
BEGIN
  -- Only create certificate when attendance is newly marked and certificate not already issued,
  -- ensure user_id exists and avoid race/duplicate inserts
  IF COALESCE(NEW.attended, false) = true
     AND COALESCE(OLD.attended, false) = false
     AND COALESCE(NEW.certificate_issued, false) = false
     AND NEW.user_id IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM public.certificates WHERE participant_id = NEW.id)
  THEN
    -- Get event title
    SELECT title INTO v_event_title FROM public.events WHERE id = NEW.event_id;

    -- Generate certificate URL (in real app, this would be a PDF generation service)
    v_certificate_url := '/certificates/' || NEW.id || '.pdf';

    -- Create certificate record (idempotent check above prevents duplicates)
    INSERT INTO public.certificates (
      user_id,
      event_id,
      participant_id,
      title,
      certificate_url,
      issued_by
    ) VALUES (
      NEW.user_id,
      NEW.event_id,
      NEW.id,
      'Certificate of Participation - ' || COALESCE(v_event_title, 'Event'),
      v_certificate_url,
      NEW.attendance_marked_by
    );

    -- Mark certificate as issued
    NEW.certificate_issued := true;
    NEW.certificate_issued_at := now();
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_participant_attended
BEFORE UPDATE ON public.event_participants
FOR EACH ROW
EXECUTE FUNCTION public.handle_participant_certificate();

/* ======================================================
   ANALYTICS VIEWS
====================================================== */

-- Dashboard statistics for elevated users
CREATE OR REPLACE VIEW public.dashboard_stats AS
SELECT 
  -- Membership stats
  (SELECT COUNT(*) FROM public.membership_applications WHERE status = 'pending') as pending_applications,
  (SELECT COUNT(*) FROM public.members WHERE is_active = true) as active_members,
  (SELECT COUNT(*) FROM public.membership_applications WHERE status = 'approved' AND date_trunc('month', created_at) = date_trunc('month', now())) as new_members_this_month,
  
  -- Event stats
  (SELECT COUNT(*) FROM public.events WHERE is_upcoming = true) as upcoming_events,
  (SELECT COUNT(*) FROM public.event_participants WHERE payment_status = 'pending') as pending_payments,
  (SELECT COUNT(*) FROM public.event_participants ep JOIN public.events e ON ep.event_id = e.id WHERE e.start_date >= date_trunc('month', now())) as registrations_this_month,
  
  -- Financial stats
  (SELECT COALESCE(SUM(amount), 0) FROM public.financial_records WHERE type = 'income' AND date >= date_trunc('month', now())) as monthly_income,
  (SELECT COALESCE(SUM(amount), 0) FROM public.financial_records WHERE type = 'expense' AND date >= date_trunc('month', now())) as monthly_expense,
  (SELECT COALESCE(SUM(amount), 0) FROM public.financial_records WHERE type = 'income') as total_income,
  (SELECT COALESCE(SUM(amount), 0) FROM public.financial_records WHERE type = 'expense') as total_expense,
  
  -- Certificate stats
  (SELECT COUNT(*) FROM public.certificates WHERE issued_at >= date_trunc('month', now())) as certificates_issued_this_month,
  (SELECT COUNT(*) FROM public.certificates) as total_certificates;

-- User summary view with all relevant information
CREATE OR REPLACE VIEW public.user_summary AS
SELECT 
  p.user_id,
  p.full_name,
  p.email,
  p.phone,
  p.department,
  p.year_of_study,
  p.student_id,
  ur.role as primary_role,
  m.membership_number,
  m.joined_at as member_since,
  m.is_active as is_member_active,
  -- Event participation
  (SELECT COUNT(*) FROM public.event_participants ep WHERE ep.user_id = p.user_id) as total_events_registered,
  (SELECT COUNT(*) FROM public.event_participants ep WHERE ep.user_id = p.user_id AND ep.attended = true) as events_attended,
  -- Certificates
  (SELECT COUNT(*) FROM public.certificates c WHERE c.user_id = p.user_id AND c.is_revoked = false) as certificates_count,
  -- Financial
  (SELECT COALESCE(SUM(amount), 0) FROM public.financial_records fr WHERE fr.user_id = p.user_id AND fr.type = 'income') as total_paid,
  p.created_at as profile_created
FROM public.profiles p
LEFT JOIN LATERAL (
  SELECT role FROM public.user_roles 
  WHERE user_id = p.user_id AND is_active = true 
  ORDER BY 
    CASE role 
      WHEN 'faculty' THEN 1
      WHEN 'treasurer' THEN 2
      WHEN 'execom' THEN 3
      ELSE 4
    END
  LIMIT 1
) ur ON true
LEFT JOIN public.members m ON m.user_id = p.user_id AND m.is_active = true;

-- Event analytics view
CREATE OR REPLACE VIEW public.event_analytics AS
SELECT 
  e.id,
  e.title,
  e.event_type,
  e.start_date,
  e.end_date,
  e.venue,
  e.fee,
  -- Registration stats
  (SELECT COUNT(*) FROM public.event_participants ep WHERE ep.event_id = e.id) as total_registrations,
  (SELECT COUNT(*) FROM public.event_participants ep WHERE ep.event_id = e.id AND ep.attended = true) as attended_count,
  (SELECT COUNT(*) FROM public.event_participants ep WHERE ep.event_id = e.id AND ep.payment_status = 'paid') as paid_count,
  (SELECT COUNT(*) FROM public.event_participants ep WHERE ep.event_id = e.id AND ep.certificate_issued = true) as certificates_issued,
  -- Financial stats
  (SELECT COALESCE(SUM(ep.payment_amount), 0) FROM public.event_participants ep WHERE ep.event_id = e.id AND ep.payment_status = 'paid') as total_revenue,
  -- Department breakdown
  (SELECT jsonb_object_agg(department, count) FROM (
    SELECT department, COUNT(*) as count 
    FROM public.event_participants 
    WHERE event_id = e.id 
    GROUP BY department
  ) dept_counts) as department_breakdown
FROM public.events e
ORDER BY e.start_date DESC;

-- Function to handle automated ID strings
CREATE OR REPLACE FUNCTION public.generate_custom_ids()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'members' THEN
    NEW.membership_number := 'ISTE-' || EXTRACT(YEAR FROM NEW.joined_at) || '-' || LPAD(floor(random()*999999)::text, 6, '0');
  ELSIF TG_TABLE_NAME = 'certificates' THEN
    NEW.certificate_number := 'CERT-' || EXTRACT(YEAR FROM NEW.issued_at) || '-' || LPAD(floor(random()*999999)::text, 6, '0');
  ELSIF TG_TABLE_NAME = 'financial_records' THEN
    NEW.transaction_id := 'TX-' || EXTRACT(YEAR FROM NEW.date) || '-' || LPAD(floor(random()*999999)::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER tr_generate_member_id BEFORE INSERT ON public.members
FOR EACH ROW EXECUTE FUNCTION public.generate_custom_ids();

CREATE TRIGGER tr_generate_cert_id BEFORE INSERT ON public.certificates
FOR EACH ROW EXECUTE FUNCTION public.generate_custom_ids();

CREATE TRIGGER tr_generate_tx_id BEFORE INSERT ON public.financial_records
FOR EACH ROW EXECUTE FUNCTION public.generate_custom_ids();

/* ======================================================
   GRANT PERMISSIONS
====================================================== */

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, service_role;

-- Grant specific permissions for views
GRANT SELECT ON public.dashboard_stats TO authenticated;
GRANT SELECT ON public.user_summary TO authenticated;
GRANT SELECT ON public.event_analytics TO authenticated;

-- Enable realtime for tables that need it
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_notifications;