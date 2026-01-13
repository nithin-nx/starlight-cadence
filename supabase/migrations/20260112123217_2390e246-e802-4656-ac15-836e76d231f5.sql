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
  public.memberships,
  public.membership_applications,
  public.user_roles,
  public.profiles CASCADE;

DROP TYPE IF EXISTS public.app_role CASCADE;
*/

/* ======================================================
   ENUMS
====================================================== */

CREATE TYPE public.app_role AS ENUM (
  'public',
  'member',
  'execom',
  'treasurer',
  'faculty',
  'admin'
);

CREATE TYPE public.application_status AS ENUM (
  'pending',
  'under_review',
  'approved',
  'rejected'
);

CREATE TYPE public.transaction_type AS ENUM (
  'income',
  'expense'
);

/* ======================================================
   TABLES
====================================================== */

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  department TEXT,
  year_of_study TEXT CHECK (year_of_study IN ('1st Year', '2nd Year', '3rd Year', '4th Year')),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- USER ROLES
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'public',
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT fk_assigned_by FOREIGN KEY (assigned_by) REFERENCES auth.users(id),
  UNIQUE (user_id, role)
);

-- MEMBERSHIP APPLICATIONS
CREATE TABLE IF NOT EXISTS public.membership_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL CHECK (phone ~ '^[0-9]{10}$'),
  department TEXT NOT NULL CHECK (department IN ('CSE', 'ECE', 'EEE', 'ME', 'CE')),
  year_of_study TEXT NOT NULL CHECK (year_of_study IN ('1st Year', '2nd Year', '3rd Year', '4th Year')),
  dob DATE,
  payment_proof_url TEXT,
  reason TEXT,
  status public.application_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES auth.users(id)
);

-- MEMBERSHIPS (Approved members)
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id UUID UNIQUE REFERENCES public.membership_applications(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  department TEXT,
  year_of_study TEXT,
  membership_id TEXT UNIQUE GENERATED ALWAYS AS (
    'ISTE-' || EXTRACT(YEAR FROM created_at) || '-' || LPAD(id::text, 6, '0')
  ) STORED,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_approved_by FOREIGN KEY (approved_by) REFERENCES auth.users(id)
);

-- EVENTS
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('workshop', 'seminar', 'competition', 'meetup', 'webinar', 'conference')),
  date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  max_participants INTEGER,
  image_url TEXT,
  is_upcoming BOOLEAN NOT NULL DEFAULT true,
  registration_open BOOLEAN NOT NULL DEFAULT true,
  fee DECIMAL(10,2) DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date >= date)
);

-- EVENT PARTICIPANTS
CREATE TABLE IF NOT EXISTS public.event_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT,
  year_of_study TEXT,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'free')),
  attended BOOLEAN DEFAULT false,
  certificate_issued BOOLEAN DEFAULT false,
  registered_by UUID REFERENCES auth.users(id),
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_registered_by FOREIGN KEY (registered_by) REFERENCES auth.users(id),
  UNIQUE (event_id, email)
);

-- GALLERY
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES auth.users(id)
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT CHECK (notification_type IN ('info', 'warning', 'success', 'event', 'membership')),
  target_roles public.app_role[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

-- FINANCIAL RECORDS
CREATE TABLE IF NOT EXISTS public.financial_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  type public.transaction_type NOT NULL,
  category TEXT CHECK (category IN ('membership', 'event', 'sponsorship', 'expense', 'donation', 'other')),
  description TEXT,
  receipt_url TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

-- CERTIFICATES
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  certificate_url TEXT NOT NULL,
  certificate_number TEXT UNIQUE GENERATED ALWAYS AS (
    'CERT-' || EXTRACT(YEAR FROM issued_at) || '-' || LPAD(id::text, 6, '0')
  ) STORED,
  issued_by UUID REFERENCES auth.users(id),
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified BOOLEAN DEFAULT true,
  CONSTRAINT fk_issued_by FOREIGN KEY (issued_by) REFERENCES auth.users(id)
);

-- USER NOTIFICATION READ STATUS
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, notification_id)
);

/* ======================================================
   INDEXES FOR PERFORMANCE
====================================================== */

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_active ON public.user_roles(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_membership_applications_email ON public.membership_applications(email);
CREATE INDEX IF NOT EXISTS idx_membership_applications_status ON public.membership_applications(status);
CREATE INDEX IF NOT EXISTS idx_membership_applications_created_at ON public.membership_applications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_members_user_id ON public.members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_membership_id ON public.members(membership_id);
CREATE INDEX IF NOT EXISTS idx_members_is_active ON public.members(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date DESC);
CREATE INDEX IF NOT EXISTS idx_events_upcoming ON public.events(is_upcoming) WHERE is_upcoming = true;
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(event_type);

CREATE INDEX IF NOT EXISTS idx_event_participants_event_id ON public.event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_email ON public.event_participants(email);
CREATE INDEX IF NOT EXISTS idx_event_participants_user_id ON public.event_participants(user_id);

CREATE INDEX IF NOT EXISTS idx_gallery_event_id ON public.gallery(event_id);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON public.gallery(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_featured ON public.gallery(is_featured) WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_notifications_active ON public.notifications(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_notifications_expires ON public.notifications(expires_at) WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_financial_records_date ON public.financial_records(date DESC);
CREATE INDEX IF NOT EXISTS idx_financial_records_type ON public.financial_records(type);
CREATE INDEX IF NOT EXISTS idx_financial_records_category ON public.financial_records(category);

CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON public.certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_event_id ON public.certificates(event_id);

CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON public.user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_read ON public.user_notifications(read) WHERE read = false;

/* ======================================================
   ENABLE RLS
====================================================== */

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

/* ======================================================
   SECURITY FUNCTIONS
====================================================== */

CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS public.app_role
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT role FROM public.user_roles 
  WHERE user_roles.user_id = $1 
    AND is_active = true
  ORDER BY 
    CASE role 
      WHEN 'admin' THEN 1
      WHEN 'faculty' THEN 2
      WHEN 'treasurer' THEN 3
      WHEN 'execom' THEN 4
      WHEN 'member' THEN 5
      ELSE 6
    END
  LIMIT 1;
$$;

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

CREATE OR REPLACE FUNCTION public.is_admin(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT public.has_role(uid, 'admin');
$$;

CREATE OR REPLACE FUNCTION public.is_faculty(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT public.has_role(uid, 'faculty');
$$;

CREATE OR REPLACE FUNCTION public.is_execom(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT public.has_role(uid, 'execom');
$$;

CREATE OR REPLACE FUNCTION public.is_treasurer(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT public.has_role(uid, 'treasurer');
$$;

CREATE OR REPLACE FUNCTION public.is_member(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.members
    WHERE user_id = uid AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_elevated_user(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT public.has_any_role(uid, ARRAY['admin', 'faculty', 'treasurer', 'execom']::public.app_role[]);
$$;

/* ======================================================
   RLS POLICIES
====================================================== */

-- PROFILES
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

-- USER ROLES
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admin/Faculty can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_any_role(auth.uid(), ARRAY['admin', 'faculty']::public.app_role[]));

-- MEMBERSHIP APPLICATIONS
CREATE POLICY "Anyone can apply for membership"
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

CREATE POLICY "Elevated users can update applications"
ON public.membership_applications FOR UPDATE
TO authenticated
USING (public.is_elevated_user(auth.uid()))
WITH CHECK (public.is_elevated_user(auth.uid()));

-- MEMBERS
CREATE POLICY "Users can view own membership"
ON public.members FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Elevated users can manage members"
ON public.members FOR ALL
TO authenticated
USING (public.is_elevated_user(auth.uid()));

-- EVENTS
CREATE POLICY "Everyone can view events"
ON public.events FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Elevated users can manage events"
ON public.events FOR ALL
TO authenticated
USING (public.is_elevated_user(auth.uid()));

-- EVENT PARTICIPANTS
CREATE POLICY "Users can view own event registrations"
ON public.event_participants FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can register for open events"
ON public.event_participants FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.events 
  WHERE id = event_id 
    AND registration_open = true
    AND (max_participants IS NULL OR (
      SELECT COUNT(*) FROM public.event_participants ep 
      WHERE ep.event_id = events.id
    ) < max_participants)
));

CREATE POLICY "Elevated users can manage participants"
ON public.event_participants FOR ALL
TO authenticated
USING (public.is_elevated_user(auth.uid()));

-- GALLERY
CREATE POLICY "Everyone can view gallery"
ON public.gallery FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Elevated users can manage gallery"
ON public.gallery FOR ALL
TO authenticated
USING (public.is_elevated_user(auth.uid()));

-- NOTIFICATIONS
CREATE POLICY "Everyone can view active notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Elevated users can manage notifications"
ON public.notifications FOR ALL
TO authenticated
USING (public.is_elevated_user(auth.uid()));

-- FINANCIAL RECORDS
CREATE POLICY "Treasurer/Faculty/Admin can manage finances"
ON public.financial_records FOR ALL
TO authenticated
USING (public.has_any_role(auth.uid(), ARRAY['treasurer', 'faculty', 'admin']::public.app_role[]));

CREATE POLICY "Execom can view finances"
ON public.financial_records FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'execom'));

-- CERTIFICATES
CREATE POLICY "Users can view own certificates"
ON public.certificates FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Elevated users can manage certificates"
ON public.certificates FOR ALL
TO authenticated
USING (public.is_elevated_user(auth.uid()));

-- USER NOTIFICATIONS
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

/* ======================================================
   TRIGGERS
====================================================== */

-- AUTO CREATE PROFILE & PUBLIC ROLE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name' OR split_part(NEW.email, '@', 1));

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'public');

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- AUTO UPDATE UPDATED_AT
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

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

-- AUTO UPDATE EVENT IS_UPCOMING
CREATE OR REPLACE FUNCTION public.update_event_status()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.date < now() THEN
    NEW.is_upcoming = false;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER check_event_date
BEFORE INSERT OR UPDATE OF date ON public.events
FOR EACH ROW EXECUTE FUNCTION public.update_event_status();

-- AUTO CREATE MEMBER WHEN APPLICATION IS APPROVED
CREATE OR REPLACE FUNCTION public.handle_approved_application()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Insert into members table
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
    );
    
    -- Update user role to member
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (NEW.user_id, 'member', NEW.reviewed_by)
    ON CONFLICT (user_id, role) DO UPDATE 
    SET is_active = true,
        assigned_by = NEW.reviewed_by,
        assigned_at = now();
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_application_approved
AFTER UPDATE ON public.membership_applications
FOR EACH ROW
WHEN (NEW.status = 'approved' AND OLD.status != 'approved')
EXECUTE FUNCTION public.handle_approved_application();

-- AUTO POPULATE USER NOTIFICATIONS
CREATE OR REPLACE FUNCTION public.create_user_notifications()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert for all active users if no specific roles
  IF NEW.target_roles IS NULL OR array_length(NEW.target_roles, 1) = 0 THEN
    INSERT INTO public.user_notifications (user_id, notification_id)
    SELECT DISTINCT p.user_id, NEW.id
    FROM public.profiles p
    WHERE p.user_id IS NOT NULL;
  ELSE
    -- Insert for users with specific roles
    INSERT INTO public.user_notifications (user_id, notification_id)
    SELECT DISTINCT ur.user_id, NEW.id
    FROM public.user_roles ur
    WHERE ur.role = ANY(NEW.target_roles)
      AND ur.is_active = true;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_notification_created
AFTER INSERT ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.create_user_notifications();

/* ======================================================
   VIEWS
====================================================== */

-- DASHBOARD OVERVIEW FOR EXECOM
CREATE OR REPLACE VIEW public.dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.membership_applications WHERE status = 'pending') as pending_applications,
  (SELECT COUNT(*) FROM public.members WHERE is_active = true) as active_members,
  (SELECT COUNT(*) FROM public.events WHERE is_upcoming = true) as upcoming_events,
  (SELECT COUNT(*) FROM public.event_participants WHERE payment_status = 'pending') as pending_payments,
  (SELECT COALESCE(SUM(amount), 0) FROM public.financial_records WHERE type = 'income' AND date >= date_trunc('month', now())) as monthly_income,
  (SELECT COALESCE(SUM(amount), 0) FROM public.financial_records WHERE type = 'expense' AND date >= date_trunc('month', now())) as monthly_expense;

-- USER SUMMARY VIEW
CREATE OR REPLACE VIEW public.user_summary AS
SELECT 
  p.user_id,
  p.full_name,
  p.email,
  p.department,
  p.year_of_study,
  ur.role as primary_role,
  m.membership_id,
  m.joined_at as member_since,
  (SELECT COUNT(*) FROM public.event_participants ep WHERE ep.user_id = p.user_id) as events_attended,
  (SELECT COUNT(*) FROM public.certificates c WHERE c.user_id = p.user_id) as certificates_count
FROM public.profiles p
LEFT JOIN LATERAL (
  SELECT role FROM public.user_roles 
  WHERE user_id = p.user_id AND is_active = true 
  ORDER BY 
    CASE role 
      WHEN 'admin' THEN 1
      WHEN 'faculty' THEN 2
      WHEN 'treasurer' THEN 3
      WHEN 'execom' THEN 4
      WHEN 'member' THEN 5
      ELSE 6
    END
  LIMIT 1
) ur ON true
LEFT JOIN public.members m ON m.user_id = p.user_id AND m.is_active = true;

/* ======================================================
   GRANTS
====================================================== */

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, service_role;

-- Grant specific permissions for views
GRANT SELECT ON public.dashboard_stats TO authenticated;
GRANT SELECT ON public.user_summary TO authenticated;