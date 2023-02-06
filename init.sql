CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TABLE public.ingredients
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    expiration character varying,
    "name" character varying NOT NULL,
    category character varying COLLATE pg_catalog."default",
    "location" character varying COLLATE pg_catalog."default",
    brand character varying COLLATE pg_catalog."default",
    "state" character varying COLLATE pg_catalog."default",
    "confection" character varying COLLATE pg_catalog."default",
    "complete" character varying COLLATE pg_catalog."default",
    "created_at" TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ  NOT NULL DEFAULT NOW(),


    CONSTRAINT ingredients_pkey PRIMARY KEY (id)
);

CREATE TABLE public.grocery
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    "name" character varying NOT NULL,
    category character varying COLLATE pg_catalog."default",
    brand character varying COLLATE pg_catalog."default",
    shop character varying COLLATE pg_catalog."default",
    "created_at" TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT grocery_pkey PRIMARY KEY (id)
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON ingredients
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


ALTER TABLE public.ingredients
    OWNER to admin;
    
