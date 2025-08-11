-- Create a secure function to grant the seller role to the current authenticated user
CREATE OR REPLACE FUNCTION public.grant_seller_role()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), 'seller')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;