-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.car_models (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  base_suffix text,
  variant text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT car_models_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  role text NOT NULL CHECK (role = ANY (ARRAY['admin'::text, 'sales_officer'::text])),
  full_name text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.sales_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  officer_id uuid,
  model_id uuid,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  year integer NOT NULL,
  quantity_sold integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sales_logs_pkey PRIMARY KEY (id),
  CONSTRAINT sales_logs_officer_id_fkey FOREIGN KEY (officer_id) REFERENCES public.profiles(id),
  CONSTRAINT sales_logs_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.car_models(id)
);
CREATE TABLE public.slab_config (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  min_cars integer NOT NULL,
  max_cars integer,
  incentive_per_car numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  model_id uuid NOT NULL,
  CONSTRAINT slab_config_pkey PRIMARY KEY (id),
  CONSTRAINT slab_config_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.car_models(id)
);
