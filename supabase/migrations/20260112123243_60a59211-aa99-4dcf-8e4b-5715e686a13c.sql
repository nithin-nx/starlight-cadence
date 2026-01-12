-- Fix the permissive INSERT policy - require either authenticated user or valid email for guest applications
DROP POLICY "Anyone can submit application" ON public.membership_applications;

CREATE POLICY "Authenticated users can submit application" ON public.membership_applications 
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL OR 
  (email IS NOT NULL AND email <> '' AND full_name IS NOT NULL AND full_name <> '')
);