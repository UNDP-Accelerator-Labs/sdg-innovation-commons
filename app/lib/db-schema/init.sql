CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS hstore;
CREATE EXTENSION IF NOT EXISTS dblink;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS ltree;

-- CREATE TABLE contributors (
-- 	id SERIAL PRIMARY KEY UNIQUE NOT NULL,
-- 	name VARCHAR(99),
-- 	position VARCHAR(99),
-- 	country VARCHAR(99),
-- 	email VARCHAR(99) UNIQUE,
-- 	password VARCHAR(99) NOT NULL,
-- 	uuid uuid UNIQUE DEFAULT uuid_generate_v4(),
-- 	rights SMALLINT DEFAULT 0,
-- 	lang VARCHAR(9) DEFAULT 'en'
-- );
-- CREATE TABLE centerpoints (
-- 	id SERIAL PRIMARY KEY UNIQUE NOT NULL,
-- 	country VARCHAR(99),
-- 	lat DOUBLE PRECISION,
-- 	lng DOUBLE PRECISION
-- );
CREATE TABLE templates (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    medium VARCHAR(9),
    title VARCHAR(99),
    description TEXT,
    sections JSONB,
    full_text TEXT,
    language VARCHAR(9),
    status INT DEFAULT 0,
    "date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "update_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- contributor INT REFERENCES contributors(id) ON UPDATE CASCADE ON DELETE CASCADE,
    owner uuid,
    -- published BOOLEAN DEFAULT FALSE,
    source INT REFERENCES templates(id) ON UPDATE CASCADE ON DELETE CASCADE,
    slideshow BOOLEAN DEFAULT FALSE,
    imported BOOLEAN DEFAULT FALSE,
    version ltree
);
CREATE INDEX version_idx ON templates USING GIST (version);

CREATE TABLE pads (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    title VARCHAR(99),
    sections JSONB,
    full_text TEXT,
    -- location JSONB,
    -- sdgs JSONB,
    -- tags JSONB,
    -- impact SMALLINT,
    -- personas JSONB,
    status INT DEFAULT 0,
    "date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "update_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- contributor INT REFERENCES contributors(id) ON UPDATE CASCADE ON DELETE CASCADE,
    owner uuid,
    template INT REFERENCES templates(id) DEFAULT NULL,
    -- published BOOLEAN DEFAULT FALSE,
    source INT REFERENCES pads(id) ON UPDATE CASCADE ON DELETE CASCADE,
    version ltree
    -- review_status INT DEFAULT 0
);
CREATE INDEX version_idx ON pads USING GIST (version);

CREATE TABLE files (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    name VARCHAR(99),
    path TEXT,
    vignette TEXT,
    full_text TEXT,
    -- location JSONB,
    sdgs JSONB,
    tags JSONB,
    status INT DEFAULT 1,
    "date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "update_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- contributor INT REFERENCES contributors(id) ON UPDATE CASCADE ON DELETE CASCADE,
    owner uuid,
    published BOOLEAN DEFAULT FALSE,
    source INT REFERENCES pads(id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE locations (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    pad INT REFERENCES pads(id) ON UPDATE CASCADE ON DELETE CASCADE,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    iso3 VARCHAR(3)
);
ALTER TABLE locations ADD CONSTRAINT unique_pad_lnglat UNIQUE (pad, lng, lat);
-- CREATE TABLE skills (
-- 	id SERIAL PRIMARY KEY UNIQUE NOT NULL,
-- 	category VARCHAR(99),
-- 	name VARCHAR(99),
-- 	label VARCHAR(99),
--	language VARCHAR(9) DEFAULT 'en'
-- );
-- CREATE TABLE methods (
-- 	id SERIAL PRIMARY KEY UNIQUE NOT NULL,
-- 	name VARCHAR(99),
-- 	label VARCHAR(99),
--	language VARCHAR(9) DEFAULT 'en'
-- );
-- CREATE TABLE datasources (
-- 	id SERIAL PRIMARY KEY UNIQUE NOT NULL,
-- 	name CITEXT UNIQUE,
-- 	description VARCHAR(99),
-- 	contributor INT,
--	language VARCHAR(9) DEFAULT 'en'
-- );
-- CREATE TABLE tags (
-- 	id SERIAL PRIMARY KEY UNIQUE NOT NULL,
--	key INT,
-- 	name CITEXT,
-- 	description TEXT,
-- 	contributor uuid,
--	type VARCHAR(19)
--	language VARCHAR(9) DEFAULT 'en'
-- );
--	ALTER TABLE tags ADD CONSTRAINT name_type UNIQUE (name, type);
CREATE TABLE cohorts (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    -- source INT REFERENCES contributors(id) ON UPDATE CASCADE ON DELETE CASCADE,
    -- target INT REFERENCES contributors(id) ON UPDATE CASCADE ON DELETE CASCADE
    host uuid,
    contributor uuid
);
ALTER TABLE cohorts ADD CONSTRAINT unique_host_contributor UNIQUE (host, contributor);

CREATE TABLE mobilizations (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    title VARCHAR(99),
    -- host INT REFERENCES contributors(id) ON UPDATE CASCADE ON DELETE CASCADE,
    owner uuid,
    template INT REFERENCES templates(id) ON UPDATE CASCADE ON DELETE CASCADE,
    status INT DEFAULT 1,
    public BOOLEAN DEFAULT FALSE,
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    source INT REFERENCES mobilizations(id) ON UPDATE CASCADE ON DELETE CASCADE,
    copy BOOLEAN DEFAULT FALSE,
    child BOOLEAN DEFAULT FALSE,
    pad_limit INT DEFAULT 1,
    description TEXT,
    language VARCHAR(9),
    old_collection INT,
    collection INT,
    version ltree
);
ALTER TABLE mobilizations ALTER pad_limit SET DEFAULT 0;
CREATE INDEX version_idx ON mobilizations USING GIST (version);

CREATE TABLE mobilization_contributors (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    -- contributor INT REFERENCES contributors(id) ON UPDATE CASCADE ON DELETE CASCADE,
    participant uuid,
    mobilization INT REFERENCES mobilizations(id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE mobilization_contributions (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    pad INT REFERENCES pads(id) ON UPDATE CASCADE ON DELETE CASCADE,
    mobilization INT REFERENCES mobilizations(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE extern_db (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    db VARCHAR(20) UNIQUE NOT NULL,
    url_prefix TEXT NOT NULL
);
INSERT INTO extern_db (db, url_prefix) VALUES ('ap', 'https://learningplans.sdg-innovation-commons.org/');
INSERT INTO extern_db (db, url_prefix) VALUES ('exp', 'https://experiments.sdg-innovation-commons.org/');
INSERT INTO extern_db (db, url_prefix) VALUES ('global', 'https://www.sdg-innovation-commons.org/');
INSERT INTO extern_db (db, url_prefix) VALUES ('sm', 'https://solutions.sdg-innovation-commons.org/');
INSERT INTO extern_db (db, url_prefix) VALUES ('blogs', 'https://blogs.sdg-innovation-commons.org/');
INSERT INTO extern_db (db, url_prefix) VALUES ('consent', 'https://consent.sdg-innovation-commons.org/');
INSERT INTO extern_db (db, url_prefix) VALUES ('login', 'https://login.sdg-innovation-commons.org/');
INSERT INTO extern_db (db, url_prefix) VALUES ('codification', 'https://practice.sdg-innovation-commons.org/');

CREATE TABLE pinboards (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    old_id INT,
    old_db INT REFERENCES extern_db(id) ON UPDATE CASCADE ON DELETE CASCADE,
    title VARCHAR(99),
    description TEXT,
    -- host INT REFERENCES contributors(id) ON UPDATE CASCADE ON DELETE CASCADE,
    owner uuid,
    -- public BOOLEAN DEFAULT FALSE,
    status INT DEFAULT 0,
    display_filters BOOLEAN DEFAULT FALSE,
    display_map BOOLEAN DEFAULT FALSE,
    display_fullscreen BOOLEAN DEFAULT FALSE,
    slideshow BOOLEAN DEFAULT FALSE,
    "date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    mobilization_db INT REFERENCES extern_db(id) ON UPDATE CASCADE ON DELETE CASCADE,
    mobilization INT  -- THIS IS TO CONNECT A PINBOARD DIRECTLY TO A MOBILIZATION
);
-- for migrating
ALTER TABLE pinboards ADD CONSTRAINT unique_pinboard_owner UNIQUE (title, owner, old_db);
ALTER TABLE pinboards DROP CONSTRAINT IF EXISTS unique_pinboard_owner;
ALTER TABLE pinboards ADD CONSTRAINT unique_pinboard_owner UNIQUE (title, owner);

CREATE TABLE pinboard_contributors (
    participant uuid NOT NULL,
    pinboard INT REFERENCES pinboards(id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (participant, pinboard)
);

CREATE TABLE pinboard_sections (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    pinboard INT REFERENCES pinboards(id) ON UPDATE CASCADE ON DELETE CASCADE,
    title VARCHAR(99),
    description TEXT
);

CREATE TABLE pinboard_contributions (
    pad INT NOT NULL,
    db INT REFERENCES extern_db(id) ON UPDATE CASCADE ON DELETE CASCADE,
    pinboard INT REFERENCES pinboards(id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (pad, db, pinboard)
);
-- for adding sections
ALTER TABLE pinboard_contributions ADD COLUMN section INT REFERENCES pinboard_sections(id) ON UPDATE CASCADE;

CREATE TABLE tagging (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    pad INT REFERENCES pads(id) ON UPDATE CASCADE ON DELETE CASCADE,
    tag_id INT NOT NULL,
    -- tag_name TEXT NOT NULL,
    type VARCHAR(19)
);
ALTER TABLE tagging ADD CONSTRAINT unique_pad_tag_type UNIQUE (pad, tag_id, type);

CREATE TABLE metafields (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    pad INT REFERENCES pads(id) ON UPDATE CASCADE ON DELETE CASCADE,
    type VARCHAR(19),
    name CITEXT,
    key INT,
    value TEXT,
    CONSTRAINT pad_value_type UNIQUE (pad, value, type)
);

-- TO DO
-- CREATE TABLE engagement_pads (
CREATE TABLE engagement (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    -- contributor INT REFERENCES contributors(id) ON UPDATE CASCADE ON DELETE CASCADE,
    contributor uuid,
    -- pad INT REFERENCES pads(id) ON UPDATE CASCADE ON DELETE CASCADE,
    doctype VARCHAR(19),
    docid INT,
    type VARCHAR(19),
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- message TEXT,
    CONSTRAINT unique_engagement UNIQUE (contributor, doctype, docid, type)
);
CREATE TABLE comments (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    contributor uuid,
    doctype VARCHAR(19),
    docid INT,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    message TEXT,
    source INT REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE review_templates (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    template INT REFERENCES templates(id) NOT NULL,
    language VARCHAR(9) UNIQUE
);
-- CREATE TABLE review_pads (
-- 	id SERIAL PRIMARY KEY UNIQUE NOT NULL,
-- 	pad INT REFERENCES pad(id) NOT NULL,
-- );
CREATE TABLE review_requests (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    pad INT UNIQUE REFERENCES pads(id) NOT NULL,
    language VARCHAR(9),
    status INT DEFAULT 0,
    "date" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE reviewer_pool (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    reviewer uuid,
    request INT REFERENCES review_requests(id) ON UPDATE CASCADE ON DELETE CASCADE,
    rank INT DEFAULT 0,
    status INT DEFAULT 0,
    invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_reviewer_pad UNIQUE (reviewer, request)
);
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    pad INT REFERENCES pads(id) ON UPDATE CASCADE ON DELETE CASCADE,
    review INT REFERENCES pads(id) ON UPDATE CASCADE ON DELETE CASCADE,
    reviewer uuid,
    status INT DEFAULT 0,
    request INT
    -- CONSTRAINT unique_reviewer UNIQUE (pad, reviewer)
);

CREATE TABLE "session" (
     "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- exploration tables
CREATE TABLE IF NOT EXISTS public.exploration
(
    id SERIAL UNIQUE NOT NULL,
    uuid uuid NOT NULL,
    prompt text COLLATE pg_catalog."default" NOT NULL,
    last_access timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    linked_pinboard INT UNIQUE NOT NULL REFERENCES pinboards(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT exploration_pkey PRIMARY KEY (id, uuid, prompt),
    CONSTRAINT id_key UNIQUE (id),
    CONSTRAINT uuid_prompt_key UNIQUE (uuid, prompt)
);
ALTER TABLE IF EXISTS public.users
    ADD COLUMN confirmed_feature_exploration timestamp with time zone;


CREATE TABLE IF NOT EXISTS public.pinboard_contributors
(
    participant uuid NOT NULL,
    pinboard integer NOT NULL,
    CONSTRAINT pinboard_contributors_pkey PRIMARY KEY (participant, pinboard),
    CONSTRAINT pinboard_contributors_pinboard_fkey FOREIGN KEY (pinboard)
        REFERENCES public.pinboards (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)


CREATE TABLE IF NOT EXISTS public.pinboard_contributions
(
    pad integer NOT NULL,
    db integer NOT NULL,
    pinboard integer NOT NULL,
    is_included boolean NOT NULL DEFAULT true,
    section integer,
    CONSTRAINT pinboard_contributions_pkey PRIMARY KEY (pad, db, pinboard),
    CONSTRAINT pinboard_contributions_db_fkey FOREIGN KEY (db)
        REFERENCES public.extern_db (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT pinboard_contributions_pinboard_fkey FOREIGN KEY (pinboard)
        REFERENCES public.pinboards (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT pinboard_contributions_section_fkey FOREIGN KEY (section)
        REFERENCES public.pinboard_sections (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
);
-- viewer stat table
CREATE TABLE IF NOT EXISTS public.page_stats
(
    doc_id INT,  -- 0 as null
    doc_type VARCHAR(19),  -- empty string as null
    db INT REFERENCES extern_db(id) ON UPDATE CASCADE ON DELETE CASCADE,
    page_url text COLLATE pg_catalog."default",  -- empty string as null
    viewer_country VARCHAR(3),  -- empty string as null
    viewer_rights SMALLINT,  -- -1 as null
    view_count INT DEFAULT 0,
    read_count INT DEFAULT 0,
    CONSTRAINT page_stats_pkey PRIMARY KEY (doc_id, doc_type, db, page_url, viewer_country, viewer_rights)
);

-- User trusted device table
CREATE TABLE public.trusted_devices (
  id SERIAL PRIMARY KEY,
  user_uuid UUID NOT NULL,
  device_name VARCHAR(255),
  device_type VARCHAR(255),
  device_os VARCHAR(255) NOT NULL,
  device_browser VARCHAR(255) NOT NULL,
  last_login TIMESTAMP with time zone NOT NULL,
  is_trusted BOOLEAN NOT NULL DEFAULT true,
  session_sid VARCHAR(255) REFERENCES session(sid) ON UPDATE CASCADE ON DELETE CASCADE,
  duuid1 UUID NOT NULL,
  duuid2 UUID NOT NULL,
  duuid3 UUID NOT NULL,
  created_at TIMESTAMP with time zone DEFAULT NOW()
);


CREATE TABLE public.device_confirmation_code (
  id SERIAL PRIMARY KEY,
  user_uuid UUID NOT NULL,
  code INTEGER NOT NULL,
  expiration_time TIMESTAMP with time zone NOT NULL
);

ALTER TABLE users
ADD COLUMN created_from_sso BOOLEAN DEFAULT FALSE,
ADD CONSTRAINT unique_email UNIQUE (email);

ALTER TABLE trusted_devices
ADD CONSTRAINT unique_user_device UNIQUE (user_uuid, device_os, device_browser, session_sid, duuid1, duuid2, duuid3);


-- Create a Function to Update update_at
CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
    NEW.update_at = NOW();
    RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

-- Create a Trigger to Call the Function
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON pads
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Create a table to store maps generated via API calls
CREATE TABLE IF NOT EXISTS public.generated_maps (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255),
    query_string TEXT
);

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    iso3 character varying(3) COLLATE pg_catalog."default",
    name character varying(99) COLLATE pg_catalog."default",
    "position" character varying(99) COLLATE pg_catalog."default",
    email character varying(99) COLLATE pg_catalog."default",
    password character varying(99) COLLATE pg_catalog."default" NOT NULL,
    uuid uuid DEFAULT uuid_generate_v4(),
    language character varying(9) COLLATE pg_catalog."default" DEFAULT 'en'::character varying,
    rights smallint,
    confirmed boolean DEFAULT false,
    invited_at timestamp with time zone NOT NULL DEFAULT now(),
    confirmed_at timestamp with time zone,
    notifications boolean DEFAULT false,
    reviewer boolean DEFAULT false,
    secondary_languages jsonb DEFAULT '[]'::jsonb,
    left_at timestamp with time zone,
    confirmed_feature_exploration timestamp with time zone,
    created_from_sso boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    last_login timestamp with time zone,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT unique_email UNIQUE (email),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_uuid_key UNIQUE (uuid)
);

CREATE TABLE IF NOT EXISTS public.teams
(
    id integer NOT NULL DEFAULT nextval('teams_id_seq'::regclass),
    name character varying(99) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    host uuid,
    status integer DEFAULT 0,
    CONSTRAINT teams_pkey PRIMARY KEY (id),
    CONSTRAINT teams_name_key UNIQUE (name),
    CONSTRAINT teams_host_fkey FOREIGN KEY (host)
        REFERENCES public.users (uuid) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS public.team_members
(
    id integer NOT NULL DEFAULT nextval('team_members_id_seq'::regclass),
    team integer,
    member uuid,
    CONSTRAINT team_members_pkey PRIMARY KEY (id),
    CONSTRAINT unique_team_member UNIQUE (team, member),
    CONSTRAINT team_members_member_fkey FOREIGN KEY (member)
        REFERENCES public.users (uuid) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT team_members_team_fkey FOREIGN KEY (team)
        REFERENCES public.teams (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS public.tags
(
    id integer NOT NULL DEFAULT nextval('tags_id_seq'::regclass),
    name citext COLLATE pg_catalog."default",
    contributor uuid,
    language character varying(9) COLLATE pg_catalog."default" DEFAULT 'en'::character varying,
    label character varying(99) COLLATE pg_catalog."default",
    type character varying(19) COLLATE pg_catalog."default",
    key integer,
    description text COLLATE pg_catalog."default",
    CONSTRAINT tags_pkey PRIMARY KEY (id),
    CONSTRAINT name_type_key UNIQUE (name, type)
);

CREATE TABLE IF NOT EXISTS public.session
(
    sid character varying COLLATE pg_catalog."default" NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL,
    CONSTRAINT session_pkey PRIMARY KEY (sid)
);

CREATE TABLE IF NOT EXISTS public.platform_ids
(
    id integer NOT NULL DEFAULT nextval('platform_ids_id_seq'::regclass),
    login_id integer,
    platform_uuid uuid DEFAULT uuid_generate_v4(),
    platform character varying(99) COLLATE pg_catalog."default",
    CONSTRAINT platform_ids_pkey PRIMARY KEY (id),
    CONSTRAINT unique_platform_access UNIQUE (login_id, platform_uuid, platform),
    CONSTRAINT platform_ids_login_id_fkey FOREIGN KEY (login_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS public.pinboards
(
    id integer NOT NULL DEFAULT nextval('pinboards_id_seq'::regclass),
    old_id integer,
    old_db integer,
    title character varying(99) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    owner uuid,
    status integer DEFAULT 0,
    display_filters boolean DEFAULT false,
    display_map boolean DEFAULT false,
    display_fullscreen boolean DEFAULT false,
    slideshow boolean DEFAULT false,
    date timestamp with time zone NOT NULL DEFAULT now(),
    mobilization_db integer,
    mobilization integer,
    CONSTRAINT pinboards_pkey PRIMARY KEY (id),
    CONSTRAINT unique_pinboard_owner UNIQUE (title, owner),
    CONSTRAINT pinboards_mobilization_db_fkey FOREIGN KEY (mobilization_db)
        REFERENCES public.extern_db (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT pinboards_old_db_fkey FOREIGN KEY (old_db)
        REFERENCES public.extern_db (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS public.pinboard_sections
(
    id integer NOT NULL DEFAULT nextval('pinboard_sections_id_seq'::regclass),
    pinboard integer,
    title character varying(99) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    CONSTRAINT pinboard_sections_pkey PRIMARY KEY (id),
    CONSTRAINT pinboard_sections_pinboard_fkey FOREIGN KEY (pinboard)
        REFERENCES public.pinboards (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.loginrate
(
    key character varying(255) COLLATE pg_catalog."default" NOT NULL,
    points integer NOT NULL DEFAULT 0,
    expire bigint,
    CONSTRAINT loginrate_pkey PRIMARY KEY (key)
);

CREATE TABLE IF NOT EXISTS public.links
(
    id integer NOT NULL DEFAULT nextval('links_id_seq'::regclass),
    article_id integer NOT NULL,
    href text COLLATE pg_catalog."default",
    linktext text COLLATE pg_catalog."default",
    CONSTRAINT links_pkey PRIMARY KEY (id),
    CONSTRAINT links_article_id_fkey FOREIGN KEY (article_id)
        REFERENCES public.articles (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS public.languages
(
    id integer NOT NULL DEFAULT nextval('languages_id_seq'::regclass),
    iso3 character varying(3) COLLATE pg_catalog."default",
    language character varying(4) COLLATE pg_catalog."default",
    name character varying(99) COLLATE pg_catalog."default",
    CONSTRAINT languages_pkey PRIMARY KEY (id),
    CONSTRAINT languages_iso3_fkey FOREIGN KEY (iso3)
        REFERENCES public.countries (iso3) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS public.iso_languages
(
    name character varying(99) COLLATE pg_catalog."default",
    set1 character varying(2) COLLATE pg_catalog."default",
    set2t character varying(3) COLLATE pg_catalog."default",
    set2b character varying(3) COLLATE pg_catalog."default",
    set3 character varying(9) COLLATE pg_catalog."default",
    notes character varying(199) COLLATE pg_catalog."default"
);


CREATE TABLE IF NOT EXISTS public.extern_db
(
    id integer NOT NULL DEFAULT nextval('extern_db_id_seq'::regclass),
    db character varying(20) COLLATE pg_catalog."default" NOT NULL,
    url_prefix text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT extern_db_pkey PRIMARY KEY (id),
    CONSTRAINT extern_db_db_key UNIQUE (db)
);


CREATE TABLE IF NOT EXISTS public.country_names
(
    id integer NOT NULL DEFAULT nextval('country_names_id_seq'::regclass),
    iso3 character varying(3) COLLATE pg_catalog."default",
    name character varying(99) COLLATE pg_catalog."default",
    language character varying(4) COLLATE pg_catalog."default",
    CONSTRAINT country_names_pkey PRIMARY KEY (id),
    CONSTRAINT country_names_iso3_fkey FOREIGN KEY (iso3)
        REFERENCES public.countries (iso3) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS public.countries
(
    id integer NOT NULL DEFAULT nextval('countries_id_seq'::regclass),
    iso3 character varying(3) COLLATE pg_catalog."default",
    bureau character varying(5) COLLATE pg_catalog."default",
    lat double precision,
    lng double precision,
    has_lab boolean,
    CONSTRAINT countries_pkey PRIMARY KEY (id),
    CONSTRAINT countries_iso3_key UNIQUE (iso3),
    CONSTRAINT countries_bureau_fkey FOREIGN KEY (bureau)
        REFERENCES public.bureaux (abbv) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS public.cohorts
(
    id integer NOT NULL DEFAULT nextval('cohorts_id_seq'::regclass),
    host uuid,
    contributor uuid,
    CONSTRAINT cohorts_pkey PRIMARY KEY (id),
    CONSTRAINT unique_host_contributor UNIQUE (host, contributor)
);


CREATE TABLE IF NOT EXISTS public.bureaux
(
    id integer NOT NULL DEFAULT nextval('bureaux_id_seq'::regclass),
    abbv character varying(5) COLLATE pg_catalog."default",
    name character varying(99) COLLATE pg_catalog."default",
    CONSTRAINT bureaux_pkey PRIMARY KEY (id),
    CONSTRAINT bureaux_abbv_key UNIQUE (abbv)
);


CREATE TABLE IF NOT EXISTS public.adm0_subunits
(
    ogc_fid integer NOT NULL DEFAULT nextval('adm0_subunits_ogc_fid_seq'::regclass),
    featurecla character varying(19) COLLATE pg_catalog."default",
    scalerank numeric(1,0),
    labelrank numeric(2,0),
    sovereignt character varying(32) COLLATE pg_catalog."default",
    sov_a3 character varying(3) COLLATE pg_catalog."default",
    adm0_dif numeric(1,0),
    level numeric(1,0),
    type character varying(17) COLLATE pg_catalog."default",
    tlc character varying(1) COLLATE pg_catalog."default",
    admin character varying(36) COLLATE pg_catalog."default",
    adm0_a3 character varying(3) COLLATE pg_catalog."default",
    geou_dif numeric(1,0),
    geounit character varying(35) COLLATE pg_catalog."default",
    gu_a3 character varying(3) COLLATE pg_catalog."default",
    su_dif numeric(1,0),
    subunit character varying(35) COLLATE pg_catalog."default",
    su_a3 character varying(3) COLLATE pg_catalog."default",
    brk_diff numeric(1,0),
    name character varying(29) COLLATE pg_catalog."default",
    name_long character varying(36) COLLATE pg_catalog."default",
    brk_a3 character varying(3) COLLATE pg_catalog."default",
    brk_name character varying(33) COLLATE pg_catalog."default",
    brk_group character varying(36) COLLATE pg_catalog."default",
    abbrev character varying(16) COLLATE pg_catalog."default",
    postal character varying(4) COLLATE pg_catalog."default",
    formal_en character varying(46) COLLATE pg_catalog."default",
    formal_fr character varying(35) COLLATE pg_catalog."default",
    name_ciawf character varying(33) COLLATE pg_catalog."default",
    note_adm0 character varying(16) COLLATE pg_catalog."default",
    note_brk character varying(89) COLLATE pg_catalog."default",
    name_sort character varying(35) COLLATE pg_catalog."default",
    name_alt character varying(32) COLLATE pg_catalog."default",
    mapcolor7 numeric(1,0),
    mapcolor8 numeric(1,0),
    mapcolor9 numeric(1,0),
    mapcolor13 numeric(3,0),
    pop_est numeric(13,2),
    pop_rank numeric(2,0),
    pop_year numeric(4,0),
    gdp_md numeric(11,2),
    gdp_year numeric(4,0),
    economy character varying(26) COLLATE pg_catalog."default",
    income_grp character varying(23) COLLATE pg_catalog."default",
    fips_10 character varying(3) COLLATE pg_catalog."default",
    iso_a2 character varying(6) COLLATE pg_catalog."default",
    iso_a2_eh character varying(5) COLLATE pg_catalog."default",
    iso_a3 character varying(3) COLLATE pg_catalog."default",
    iso_a3_eh character varying(3) COLLATE pg_catalog."default",
    iso_n3 character varying(3) COLLATE pg_catalog."default",
    iso_n3_eh character varying(3) COLLATE pg_catalog."default",
    un_a3 character varying(4) COLLATE pg_catalog."default",
    wb_a2 character varying(3) COLLATE pg_catalog."default",
    wb_a3 character varying(3) COLLATE pg_catalog."default",
    woe_id numeric(8,0),
    woe_id_eh numeric(8,0),
    woe_note character varying(207) COLLATE pg_catalog."default",
    adm0_iso character varying(3) COLLATE pg_catalog."default",
    adm0_diff character varying(1) COLLATE pg_catalog."default",
    adm0_tlc character varying(3) COLLATE pg_catalog."default",
    adm0_a3_us character varying(3) COLLATE pg_catalog."default",
    adm0_a3_fr character varying(3) COLLATE pg_catalog."default",
    adm0_a3_ru character varying(3) COLLATE pg_catalog."default",
    adm0_a3_es character varying(3) COLLATE pg_catalog."default",
    adm0_a3_cn character varying(3) COLLATE pg_catalog."default",
    adm0_a3_tw character varying(3) COLLATE pg_catalog."default",
    adm0_a3_in character varying(3) COLLATE pg_catalog."default",
    adm0_a3_np character varying(3) COLLATE pg_catalog."default",
    adm0_a3_pk character varying(3) COLLATE pg_catalog."default",
    adm0_a3_de character varying(3) COLLATE pg_catalog."default",
    adm0_a3_gb character varying(3) COLLATE pg_catalog."default",
    adm0_a3_br character varying(3) COLLATE pg_catalog."default",
    adm0_a3_il character varying(3) COLLATE pg_catalog."default",
    adm0_a3_ps character varying(3) COLLATE pg_catalog."default",
    adm0_a3_sa character varying(3) COLLATE pg_catalog."default",
    adm0_a3_eg character varying(3) COLLATE pg_catalog."default",
    adm0_a3_ma character varying(3) COLLATE pg_catalog."default",
    adm0_a3_pt character varying(3) COLLATE pg_catalog."default",
    adm0_a3_ar character varying(3) COLLATE pg_catalog."default",
    adm0_a3_jp character varying(3) COLLATE pg_catalog."default",
    adm0_a3_ko character varying(3) COLLATE pg_catalog."default",
    adm0_a3_vn character varying(3) COLLATE pg_catalog."default",
    adm0_a3_tr character varying(3) COLLATE pg_catalog."default",
    adm0_a3_id character varying(3) COLLATE pg_catalog."default",
    adm0_a3_pl character varying(3) COLLATE pg_catalog."default",
    adm0_a3_gr character varying(3) COLLATE pg_catalog."default",
    adm0_a3_it character varying(3) COLLATE pg_catalog."default",
    adm0_a3_nl character varying(3) COLLATE pg_catalog."default",
    adm0_a3_se character varying(3) COLLATE pg_catalog."default",
    adm0_a3_bd character varying(3) COLLATE pg_catalog."default",
    adm0_a3_ua character varying(3) COLLATE pg_catalog."default",
    adm0_a3_un numeric(3,0),
    adm0_a3_wb numeric(3,0),
    continent character varying(23) COLLATE pg_catalog."default",
    region_un character varying(10) COLLATE pg_catalog."default",
    subregion character varying(25) COLLATE pg_catalog."default",
    region_wb character varying(26) COLLATE pg_catalog."default",
    name_len numeric(2,0),
    long_len numeric(2,0),
    abbrev_len numeric(2,0),
    tiny numeric(3,0),
    homepart numeric(3,0),
    min_zoom numeric(3,1),
    min_label numeric(3,1),
    max_label numeric(4,1),
    label_x numeric(11,6),
    label_y numeric(10,6),
    ne_id numeric(10,0),
    wikidataid character varying(9) COLLATE pg_catalog."default",
    name_ar character varying(71) COLLATE pg_catalog."default",
    name_bn character varying(109) COLLATE pg_catalog."default",
    name_de character varying(43) COLLATE pg_catalog."default",
    name_en character varying(43) COLLATE pg_catalog."default",
    name_es character varying(63) COLLATE pg_catalog."default",
    name_fa character varying(66) COLLATE pg_catalog."default",
    name_fr character varying(60) COLLATE pg_catalog."default",
    name_el character varying(90) COLLATE pg_catalog."default",
    name_he character varying(63) COLLATE pg_catalog."default",
    name_hi character varying(89) COLLATE pg_catalog."default",
    name_hu character varying(53) COLLATE pg_catalog."default",
    name_id character varying(53) COLLATE pg_catalog."default",
    name_it character varying(41) COLLATE pg_catalog."default",
    name_ja character varying(66) COLLATE pg_catalog."default",
    name_ko character varying(42) COLLATE pg_catalog."default",
    name_nl character varying(41) COLLATE pg_catalog."default",
    name_pl character varying(40) COLLATE pg_catalog."default",
    name_pt character varying(40) COLLATE pg_catalog."default",
    name_ru character varying(80) COLLATE pg_catalog."default",
    name_sv character varying(39) COLLATE pg_catalog."default",
    name_tr character varying(39) COLLATE pg_catalog."default",
    name_uk character varying(79) COLLATE pg_catalog."default",
    name_ur character varying(56) COLLATE pg_catalog."default",
    name_vi character varying(56) COLLATE pg_catalog."default",
    name_zh character varying(36) COLLATE pg_catalog."default",
    name_zht character varying(36) COLLATE pg_catalog."default",
    fclass_iso character varying(24) COLLATE pg_catalog."default",
    tlc_diff character varying(1) COLLATE pg_catalog."default",
    fclass_tlc character varying(30) COLLATE pg_catalog."default",
    fclass_us character varying(30) COLLATE pg_catalog."default",
    fclass_fr character varying(30) COLLATE pg_catalog."default",
    fclass_ru character varying(30) COLLATE pg_catalog."default",
    fclass_es character varying(30) COLLATE pg_catalog."default",
    fclass_cn character varying(24) COLLATE pg_catalog."default",
    fclass_tw character varying(30) COLLATE pg_catalog."default",
    fclass_in character varying(30) COLLATE pg_catalog."default",
    fclass_np character varying(30) COLLATE pg_catalog."default",
    fclass_pk character varying(15) COLLATE pg_catalog."default",
    fclass_de character varying(30) COLLATE pg_catalog."default",
    fclass_gb character varying(30) COLLATE pg_catalog."default",
    fclass_br character varying(30) COLLATE pg_catalog."default",
    fclass_il character varying(30) COLLATE pg_catalog."default",
    fclass_ps character varying(30) COLLATE pg_catalog."default",
    fclass_sa character varying(15) COLLATE pg_catalog."default",
    fclass_eg character varying(30) COLLATE pg_catalog."default",
    fclass_ma character varying(30) COLLATE pg_catalog."default",
    fclass_pt character varying(30) COLLATE pg_catalog."default",
    fclass_ar character varying(30) COLLATE pg_catalog."default",
    fclass_jp character varying(30) COLLATE pg_catalog."default",
    fclass_ko character varying(30) COLLATE pg_catalog."default",
    fclass_vn character varying(30) COLLATE pg_catalog."default",
    fclass_tr character varying(30) COLLATE pg_catalog."default",
    fclass_id character varying(30) COLLATE pg_catalog."default",
    fclass_pl character varying(30) COLLATE pg_catalog."default",
    fclass_gr character varying(30) COLLATE pg_catalog."default",
    fclass_it character varying(30) COLLATE pg_catalog."default",
    fclass_nl character varying(30) COLLATE pg_catalog."default",
    fclass_se character varying(30) COLLATE pg_catalog."default",
    fclass_bd character varying(24) COLLATE pg_catalog."default",
    fclass_ua character varying(18) COLLATE pg_catalog."default",
    wkb_geometry geometry(MultiPolygon,4326),
    undp_bureau character varying(9) COLLATE pg_catalog."default",
    undp_bureau_name character varying(99) COLLATE pg_catalog."default",
    CONSTRAINT adm0_subunits_pkey PRIMARY KEY (ogc_fid)
);


CREATE TABLE IF NOT EXISTS public.adm0
(
    ogc_fid integer NOT NULL DEFAULT nextval('adm0_ogc_fid_seq'::regclass),
    featurecla character varying(15) COLLATE pg_catalog."default",
    scalerank numeric(1,0),
    labelrank numeric(2,0),
    sovereignt character varying(32) COLLATE pg_catalog."default",
    sov_a3 character varying(3) COLLATE pg_catalog."default",
    adm0_dif numeric(1,0),
    level numeric(1,0),
    type character varying(17) COLLATE pg_catalog."default",
    tlc character varying(1) COLLATE pg_catalog."default",
    admin character varying(36) COLLATE pg_catalog."default",
    adm0_a3 character varying(3) COLLATE pg_catalog."default",
    geou_dif numeric(1,0),
    geounit character varying(36) COLLATE pg_catalog."default",
    gu_a3 character varying(3) COLLATE pg_catalog."default",
    su_dif numeric(1,0),
    subunit character varying(36) COLLATE pg_catalog."default",
    su_a3 character varying(3) COLLATE pg_catalog."default",
    brk_diff numeric(1,0),
    name character varying(29) COLLATE pg_catalog."default",
    name_long character varying(36) COLLATE pg_catalog."default",
    brk_a3 character varying(3) COLLATE pg_catalog."default",
    brk_name character varying(32) COLLATE pg_catalog."default",
    brk_group character varying(17) COLLATE pg_catalog."default",
    abbrev character varying(16) COLLATE pg_catalog."default",
    postal character varying(4) COLLATE pg_catalog."default",
    formal_en character varying(52) COLLATE pg_catalog."default",
    formal_fr character varying(35) COLLATE pg_catalog."default",
    name_ciawf character varying(45) COLLATE pg_catalog."default",
    note_adm0 character varying(16) COLLATE pg_catalog."default",
    note_brk character varying(63) COLLATE pg_catalog."default",
    name_sort character varying(36) COLLATE pg_catalog."default",
    name_alt character varying(19) COLLATE pg_catalog."default",
    mapcolor7 numeric(1,0),
    mapcolor8 numeric(1,0),
    mapcolor9 numeric(1,0),
    mapcolor13 numeric(3,0),
    pop_est numeric(12,1),
    pop_rank numeric(2,0),
    pop_year numeric(4,0),
    gdp_md numeric(8,0),
    gdp_year numeric(4,0),
    economy character varying(26) COLLATE pg_catalog."default",
    income_grp character varying(23) COLLATE pg_catalog."default",
    fips_10 character varying(3) COLLATE pg_catalog."default",
    iso_a2 character varying(5) COLLATE pg_catalog."default",
    iso_a2_eh character varying(3) COLLATE pg_catalog."default",
    iso_a3 character varying(3) COLLATE pg_catalog."default",
    iso_a3_eh character varying(3) COLLATE pg_catalog."default",
    iso_n3 character varying(3) COLLATE pg_catalog."default",
    iso_n3_eh character varying(3) COLLATE pg_catalog."default",
    un_a3 character varying(4) COLLATE pg_catalog."default",
    wb_a2 character varying(3) COLLATE pg_catalog."default",
    wb_a3 character varying(3) COLLATE pg_catalog."default",
    woe_id numeric(8,0),
    woe_id_eh numeric(8,0),
    woe_note character varying(167) COLLATE pg_catalog."default",
    adm0_iso character varying(3) COLLATE pg_catalog."default",
    adm0_diff character varying(1) COLLATE pg_catalog."default",
    adm0_tlc character varying(3) COLLATE pg_catalog."default",
    adm0_a3_us character varying(3) COLLATE pg_catalog."default",
    adm0_a3_fr character varying(3) COLLATE pg_catalog."default",
    adm0_a3_ru character varying(3) COLLATE pg_catalog."default",
    adm0_a3_es character varying(3) COLLATE pg_catalog."default",
    adm0_a3_cn character varying(3) COLLATE pg_catalog."default",
    adm0_a3_tw character varying(3) COLLATE pg_catalog."default",
    adm0_a3_in character varying(3) COLLATE pg_catalog."default",
    adm0_a3_np character varying(3) COLLATE pg_catalog."default",
    adm0_a3_pk character varying(3) COLLATE pg_catalog."default",
    adm0_a3_de character varying(3) COLLATE pg_catalog."default",
    adm0_a3_gb character varying(3) COLLATE pg_catalog."default",
    adm0_a3_br character varying(3) COLLATE pg_catalog."default",
    adm0_a3_il character varying(3) COLLATE pg_catalog."default",
    adm0_a3_ps character varying(3) COLLATE pg_catalog."default",
    adm0_a3_sa character varying(3) COLLATE pg_catalog."default",
    adm0_a3_eg character varying(3) COLLATE pg_catalog."default",
    adm0_a3_ma character varying(3) COLLATE pg_catalog."default",
    adm0_a3_pt character varying(3) COLLATE pg_catalog."default",
    adm0_a3_ar character varying(3) COLLATE pg_catalog."default",
    adm0_a3_jp character varying(3) COLLATE pg_catalog."default",
    adm0_a3_ko character varying(3) COLLATE pg_catalog."default",
    adm0_a3_vn character varying(3) COLLATE pg_catalog."default",
    adm0_a3_tr character varying(3) COLLATE pg_catalog."default",
    adm0_a3_id character varying(3) COLLATE pg_catalog."default",
    adm0_a3_pl character varying(3) COLLATE pg_catalog."default",
    adm0_a3_gr character varying(3) COLLATE pg_catalog."default",
    adm0_a3_it character varying(3) COLLATE pg_catalog."default",
    adm0_a3_nl character varying(3) COLLATE pg_catalog."default",
    adm0_a3_se character varying(3) COLLATE pg_catalog."default",
    adm0_a3_bd character varying(3) COLLATE pg_catalog."default",
    adm0_a3_ua character varying(3) COLLATE pg_catalog."default",
    adm0_a3_un numeric(3,0),
    adm0_a3_wb numeric(3,0),
    continent character varying(23) COLLATE pg_catalog."default",
    region_un character varying(10) COLLATE pg_catalog."default",
    subregion character varying(25) COLLATE pg_catalog."default",
    region_wb character varying(26) COLLATE pg_catalog."default",
    name_len numeric(2,0),
    long_len numeric(2,0),
    abbrev_len numeric(2,0),
    tiny numeric(3,0),
    homepart numeric(3,0),
    min_zoom numeric(3,1),
    min_label numeric(3,1),
    max_label numeric(4,1),
    label_x numeric(11,6),
    label_y numeric(10,6),
    ne_id numeric(10,0),
    wikidataid character varying(8) COLLATE pg_catalog."default",
    name_ar character varying(72) COLLATE pg_catalog."default",
    name_bn character varying(148) COLLATE pg_catalog."default",
    name_de character varying(46) COLLATE pg_catalog."default",
    name_en character varying(44) COLLATE pg_catalog."default",
    name_es character varying(44) COLLATE pg_catalog."default",
    name_fa character varying(66) COLLATE pg_catalog."default",
    name_fr character varying(54) COLLATE pg_catalog."default",
    name_el character varying(86) COLLATE pg_catalog."default",
    name_he character varying(78) COLLATE pg_catalog."default",
    name_hi character varying(126) COLLATE pg_catalog."default",
    name_hu character varying(52) COLLATE pg_catalog."default",
    name_id character varying(46) COLLATE pg_catalog."default",
    name_it character varying(48) COLLATE pg_catalog."default",
    name_ja character varying(63) COLLATE pg_catalog."default",
    name_ko character varying(47) COLLATE pg_catalog."default",
    name_nl character varying(49) COLLATE pg_catalog."default",
    name_pl character varying(47) COLLATE pg_catalog."default",
    name_pt character varying(43) COLLATE pg_catalog."default",
    name_ru character varying(86) COLLATE pg_catalog."default",
    name_sv character varying(57) COLLATE pg_catalog."default",
    name_tr character varying(42) COLLATE pg_catalog."default",
    name_uk character varying(91) COLLATE pg_catalog."default",
    name_ur character varying(67) COLLATE pg_catalog."default",
    name_vi character varying(56) COLLATE pg_catalog."default",
    name_zh character varying(33) COLLATE pg_catalog."default",
    name_zht character varying(33) COLLATE pg_catalog."default",
    fclass_iso character varying(24) COLLATE pg_catalog."default",
    tlc_diff character varying(1) COLLATE pg_catalog."default",
    fclass_tlc character varying(21) COLLATE pg_catalog."default",
    fclass_us character varying(30) COLLATE pg_catalog."default",
    fclass_fr character varying(18) COLLATE pg_catalog."default",
    fclass_ru character varying(14) COLLATE pg_catalog."default",
    fclass_es character varying(18) COLLATE pg_catalog."default",
    fclass_cn character varying(24) COLLATE pg_catalog."default",
    fclass_tw character varying(15) COLLATE pg_catalog."default",
    fclass_in character varying(14) COLLATE pg_catalog."default",
    fclass_np character varying(24) COLLATE pg_catalog."default",
    fclass_pk character varying(15) COLLATE pg_catalog."default",
    fclass_de character varying(18) COLLATE pg_catalog."default",
    fclass_gb character varying(18) COLLATE pg_catalog."default",
    fclass_br character varying(12) COLLATE pg_catalog."default",
    fclass_il character varying(15) COLLATE pg_catalog."default",
    fclass_ps character varying(15) COLLATE pg_catalog."default",
    fclass_sa character varying(15) COLLATE pg_catalog."default",
    fclass_eg character varying(24) COLLATE pg_catalog."default",
    fclass_ma character varying(24) COLLATE pg_catalog."default",
    fclass_pt character varying(18) COLLATE pg_catalog."default",
    fclass_ar character varying(12) COLLATE pg_catalog."default",
    fclass_jp character varying(18) COLLATE pg_catalog."default",
    fclass_ko character varying(18) COLLATE pg_catalog."default",
    fclass_vn character varying(12) COLLATE pg_catalog."default",
    fclass_tr character varying(18) COLLATE pg_catalog."default",
    fclass_id character varying(24) COLLATE pg_catalog."default",
    fclass_pl character varying(18) COLLATE pg_catalog."default",
    fclass_gr character varying(18) COLLATE pg_catalog."default",
    fclass_it character varying(18) COLLATE pg_catalog."default",
    fclass_nl character varying(18) COLLATE pg_catalog."default",
    fclass_se character varying(18) COLLATE pg_catalog."default",
    fclass_bd character varying(24) COLLATE pg_catalog."default",
    fclass_ua character varying(18) COLLATE pg_catalog."default",
    wkb_geometry geometry(MultiPolygon,4326),
    undp_bureau character varying(9) COLLATE pg_catalog."default",
    undp_bureau_name character varying(99) COLLATE pg_catalog."default",
    CONSTRAINT adm0_pkey PRIMARY KEY (ogc_fid)
);
