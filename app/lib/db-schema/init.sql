
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
)



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
)

CREATE TABLE IF NOT EXISTS public.bureaux
(
    id integer NOT NULL DEFAULT nextval('bureaux_id_seq'::regclass),
    abbv character varying(5) COLLATE pg_catalog."default",
    name character varying(99) COLLATE pg_catalog."default",
    CONSTRAINT bureaux_pkey PRIMARY KEY (id),
    CONSTRAINT bureaux_abbv_key UNIQUE (abbv)
)


CREATE TABLE IF NOT EXISTS public.cohorts
(
    id integer NOT NULL DEFAULT nextval('cohorts_id_seq'::regclass),
    host uuid,
    contributor uuid,
    CONSTRAINT cohorts_pkey PRIMARY KEY (id),
    CONSTRAINT unique_host_contributor UNIQUE (host, contributor)
)


CREATE TABLE IF NOT EXISTS public.comments
(
    id integer NOT NULL DEFAULT nextval('comments_id_seq'::regclass),
    contributor uuid,
    doctype character varying(19) COLLATE pg_catalog."default",
    docid integer,
    date timestamp with time zone NOT NULL DEFAULT now(),
    message text COLLATE pg_catalog."default",
    source integer,
    CONSTRAINT comments_pkey PRIMARY KEY (id),
    CONSTRAINT comments_source_fkey FOREIGN KEY (source)
        REFERENCES public.comments (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)


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
)


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
)


CREATE TABLE IF NOT EXISTS public.device_confirmation_code
(
    id integer NOT NULL DEFAULT nextval('device_confirmation_code_id_seq'::regclass),
    user_uuid uuid NOT NULL,
    code integer NOT NULL,
    expiration_time timestamp with time zone NOT NULL,
    CONSTRAINT device_confirmation_code_pkey PRIMARY KEY (id)
)


CREATE TABLE IF NOT EXISTS public.engagement
(
    id integer NOT NULL DEFAULT nextval('engagement_id_seq1'::regclass),
    contributor uuid,
    doctype character varying(19) COLLATE pg_catalog."default",
    docid integer,
    type character varying(19) COLLATE pg_catalog."default",
    date timestamp with time zone NOT NULL DEFAULT now(),
    message text COLLATE pg_catalog."default",
    CONSTRAINT engagement_pkey1 PRIMARY KEY (id),
    CONSTRAINT unique_engagement UNIQUE (contributor, doctype, docid, type)
)


CREATE TABLE IF NOT EXISTS public.exploration
(
    id integer NOT NULL DEFAULT nextval('journey_id_seq'::regclass),
    uuid uuid NOT NULL,
    prompt text COLLATE pg_catalog."default" NOT NULL,
    last_access timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    linked_pinboard integer NOT NULL,
    CONSTRAINT exploration_pkey PRIMARY KEY (id, uuid, prompt),
    CONSTRAINT exploration_linked_pinboard_key UNIQUE (linked_pinboard),
    CONSTRAINT id_key UNIQUE (id),
    CONSTRAINT uuid_prompt_key UNIQUE (uuid, prompt),
    CONSTRAINT exploration_linked_pinboard_fkey FOREIGN KEY (linked_pinboard)
        REFERENCES public.pinboards (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS public.extern_db
(
    id integer NOT NULL DEFAULT nextval('extern_db_id_seq'::regclass),
    db character varying(20) COLLATE pg_catalog."default" NOT NULL,
    url_prefix text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT extern_db_pkey PRIMARY KEY (id),
    CONSTRAINT extern_db_db_key UNIQUE (db)
)


CREATE TABLE IF NOT EXISTS public.files
(
    id integer NOT NULL DEFAULT nextval('files_id_seq'::regclass),
    name character varying(99) COLLATE pg_catalog."default",
    path text COLLATE pg_catalog."default",
    vignette text COLLATE pg_catalog."default",
    full_text text COLLATE pg_catalog."default",
    sdgs jsonb,
    tags jsonb,
    status integer DEFAULT 1,
    date timestamp with time zone NOT NULL DEFAULT now(),
    update_at timestamp with time zone NOT NULL DEFAULT now(),
    owner uuid,
    published boolean DEFAULT false,
    source integer,
    id_db text COLLATE pg_catalog."default",
    ordb integer,
    CONSTRAINT files_pkey PRIMARY KEY (id),
    CONSTRAINT files_id_db_key UNIQUE (id_db),
    CONSTRAINT files_source_fkey FOREIGN KEY (source)
        REFERENCES public.pads (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)


CREATE TABLE IF NOT EXISTS public.generated_maps
(
    id integer NOT NULL DEFAULT nextval('generated_maps_id_seq'::regclass),
    filename character varying(255) COLLATE pg_catalog."default",
    query_string text COLLATE pg_catalog."default",
    CONSTRAINT generated_maps_pkey PRIMARY KEY (id)
)


CREATE TABLE IF NOT EXISTS public.iso_languages
(
    name character varying(99) COLLATE pg_catalog."default",
    set1 character varying(2) COLLATE pg_catalog."default",
    set2t character varying(3) COLLATE pg_catalog."default",
    set2b character varying(3) COLLATE pg_catalog."default",
    set3 character varying(9) COLLATE pg_catalog."default",
    notes character varying(199) COLLATE pg_catalog."default"
)


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
)


CREATE TABLE IF NOT EXISTS public.locations
(
    id integer NOT NULL DEFAULT nextval('locations_id_seq'::regclass),
    pad integer,
    lat double precision,
    lng double precision,
    iso3 character varying(3) COLLATE pg_catalog."default",
    CONSTRAINT locations_pkey PRIMARY KEY (id),
    CONSTRAINT unique_pad_lnglat UNIQUE (pad, lng, lat),
    CONSTRAINT locations_pad_fkey FOREIGN KEY (pad)
        REFERENCES public.pads (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)


CREATE TABLE IF NOT EXISTS public.metafields
(
    id integer NOT NULL DEFAULT nextval('metafields_id_seq'::regclass),
    pad integer,
    type character varying(19) COLLATE pg_catalog."default",
    name citext COLLATE pg_catalog."default",
    value text COLLATE pg_catalog."default",
    key integer,
    CONSTRAINT metafields_pkey PRIMARY KEY (id),
    CONSTRAINT pad_value_type UNIQUE (pad, value, type),
    CONSTRAINT metafields_pad_fkey FOREIGN KEY (pad)
        REFERENCES public.pads (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)


CREATE TABLE IF NOT EXISTS public.mobilization_contributions
(
    id integer NOT NULL DEFAULT nextval('mobilization_contributions_id_seq'::regclass),
    pad integer,
    mobilization integer,
    CONSTRAINT mobilization_contributions_pkey PRIMARY KEY (id),
    CONSTRAINT mobilization_contributions_mobilization_fkey FOREIGN KEY (mobilization)
        REFERENCES public.mobilizations (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT mobilization_contributions_pad_fkey FOREIGN KEY (pad)
        REFERENCES public.pads (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)


CREATE TABLE IF NOT EXISTS public.mobilization_contributors
(
    id integer NOT NULL DEFAULT nextval('mobilization_contributors_id_seq'::regclass),
    mobilization integer,
    participant uuid,
    CONSTRAINT mobilization_contributors_pkey PRIMARY KEY (id),
    CONSTRAINT mobilization_contributors_mobilization_fkey FOREIGN KEY (mobilization)
        REFERENCES public.mobilizations (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)


CREATE TABLE IF NOT EXISTS public.mobilizations
(
    id integer NOT NULL DEFAULT nextval('mobilizations_id_seq'::regclass),
    title character varying(99) COLLATE pg_catalog."default",
    template integer,
    status integer DEFAULT 1,
    start_date timestamp with time zone NOT NULL DEFAULT now(),
    end_date timestamp with time zone,
    owner uuid,
    source integer,
    copy boolean DEFAULT false,
    pad_limit integer DEFAULT 0,
    public boolean DEFAULT false,
    child boolean DEFAULT false,
    description text COLLATE pg_catalog."default",
    language character varying(9) COLLATE pg_catalog."default",
    old_collection integer,
    version ltree,
    collection integer,
    id_db text COLLATE pg_catalog."default",
    CONSTRAINT mobilizations_pkey PRIMARY KEY (id),
    CONSTRAINT mobilizations_id_db_key UNIQUE (id_db),
    CONSTRAINT mobilizations_source_fkey FOREIGN KEY (source)
        REFERENCES public.mobilizations (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT mobilizations_template_fkey FOREIGN KEY (template)
        REFERENCES public.templates (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)


CREATE TABLE IF NOT EXISTS public.pads
(
    id integer NOT NULL DEFAULT nextval('pads_id_seq'::regclass),
    title character varying(99) COLLATE pg_catalog."default",
    full_text text COLLATE pg_catalog."default",
    status integer DEFAULT 0,
    date timestamp with time zone NOT NULL DEFAULT now(),
    template integer,
    owner uuid,
    sections jsonb,
    update_at timestamp with time zone NOT NULL DEFAULT now(),
    source integer,
    version ltree,
    id_db text COLLATE pg_catalog."default",
    ordb integer,
    source_db text COLLATE pg_catalog."default",
    template_db text COLLATE pg_catalog."default",
    sections_redacted jsonb,
    full_text_redacted text COLLATE pg_catalog."default",
    redacted boolean DEFAULT false,
    CONSTRAINT pads_pkey PRIMARY KEY (id),
    CONSTRAINT pads_id_db_key UNIQUE (id_db),
    CONSTRAINT pads_source_fkey FOREIGN KEY (source)
        REFERENCES public.pads (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT pads_template_fkey FOREIGN KEY (template)
        REFERENCES public.templates (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.page_stats
(
    doc_id integer NOT NULL,
    doc_type character varying(19) COLLATE pg_catalog."default" NOT NULL,
    db integer NOT NULL,
    page_url text COLLATE pg_catalog."default" NOT NULL,
    viewer_country character varying(3) COLLATE pg_catalog."default" NOT NULL,
    viewer_rights smallint NOT NULL,
    view_count integer DEFAULT 0,
    read_count integer DEFAULT 0,
    CONSTRAINT page_stats_pkey PRIMARY KEY (doc_id, doc_type, db, page_url, viewer_country, viewer_rights),
    CONSTRAINT page_stats_db_fkey FOREIGN KEY (db)
        REFERENCES public.extern_db (id) MATCH SIMPLE
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
)


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
)


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
)


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
)


CREATE TABLE IF NOT EXISTS public.review_requests
(
    id integer NOT NULL DEFAULT nextval('review_requests_id_seq'::regclass),
    pad integer NOT NULL,
    language character varying(9) COLLATE pg_catalog."default",
    status integer DEFAULT 0,
    date timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT review_requests_pkey PRIMARY KEY (id),
    CONSTRAINT review_requests_pad_key UNIQUE (pad),
    CONSTRAINT review_requests_pad_fkey FOREIGN KEY (pad)
        REFERENCES public.pads (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)


CREATE TABLE IF NOT EXISTS public.review_templates
(
    id integer NOT NULL DEFAULT nextval('review_templates_id_seq'::regclass),
    template integer NOT NULL,
    language character varying(9) COLLATE pg_catalog."default",
    CONSTRAINT review_templates_pkey PRIMARY KEY (id),
    CONSTRAINT review_templates_language_key UNIQUE (language),
    CONSTRAINT review_templates_template_fkey FOREIGN KEY (template)
        REFERENCES public.templates (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)


CREATE TABLE IF NOT EXISTS public.reviewer_pool
(
    id integer NOT NULL DEFAULT nextval('reviewer_pool_id_seq'::regclass),
    reviewer uuid,
    request integer,
    rank integer DEFAULT 0,
    status integer DEFAULT 0,
    invited_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT reviewer_pool_pkey PRIMARY KEY (id),
    CONSTRAINT unique_reviewer_pad UNIQUE (reviewer, request),
    CONSTRAINT reviewer_pool_request_fkey FOREIGN KEY (request)
        REFERENCES public.review_requests (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)


CREATE TABLE IF NOT EXISTS public.reviews
(
    id integer NOT NULL DEFAULT nextval('reviews_id_seq'::regclass),
    pad integer,
    review integer,
    reviewer uuid,
    status integer DEFAULT 0,
    request integer,
    CONSTRAINT reviews_pkey PRIMARY KEY (id),
    CONSTRAINT reviews_pad_fkey FOREIGN KEY (pad)
        REFERENCES public.pads (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT reviews_review_fkey FOREIGN KEY (review)
        REFERENCES public.pads (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)


CREATE TABLE IF NOT EXISTS public.schema_migrations
(
    id integer NOT NULL DEFAULT nextval('schema_migrations_id_seq'::regclass),
    filename text COLLATE pg_catalog."default" NOT NULL,
    applied_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT schema_migrations_pkey PRIMARY KEY (id),
    CONSTRAINT schema_migrations_filename_key UNIQUE (filename)
)


CREATE TABLE IF NOT EXISTS public.skills
(
    id integer NOT NULL DEFAULT nextval('skills_id_seq'::regclass),
    category character varying(99) COLLATE pg_catalog."default",
    name character varying(99) COLLATE pg_catalog."default",
    label character varying(99) COLLATE pg_catalog."default",
    language character varying(9) COLLATE pg_catalog."default" DEFAULT 'en'::character varying,
    CONSTRAINT skills_pkey PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS public.spatial_ref_sys
(
    srid integer NOT NULL,
    auth_name character varying(256) COLLATE pg_catalog."default",
    auth_srid integer,
    srtext character varying(2048) COLLATE pg_catalog."default",
    proj4text character varying(2048) COLLATE pg_catalog."default",
    CONSTRAINT spatial_ref_sys_pkey PRIMARY KEY (srid),
    CONSTRAINT spatial_ref_sys_srid_check CHECK (srid > 0 AND srid <= 998999)
)


CREATE TABLE IF NOT EXISTS public.tagging
(
    id integer NOT NULL DEFAULT nextval('tagging_id_seq'::regclass),
    pad integer,
    tag_id integer NOT NULL,
    type character varying(19) COLLATE pg_catalog."default",
    CONSTRAINT tagging_pkey PRIMARY KEY (id),
    CONSTRAINT unique_pad_tag_type UNIQUE (pad, tag_id, type),
    CONSTRAINT tagging_pad_fkey FOREIGN KEY (pad)
        REFERENCES public.pads (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)


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
)


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
)


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
)


CREATE TABLE IF NOT EXISTS public.templates
(
    id integer NOT NULL DEFAULT nextval('templates_id_seq'::regclass),
    medium character varying(9) COLLATE pg_catalog."default",
    title character varying(99) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    items jsonb,
    language character varying(9) COLLATE pg_catalog."default",
    date timestamp with time zone NOT NULL DEFAULT now(),
    full_text text COLLATE pg_catalog."default",
    status integer DEFAULT 0,
    imported boolean DEFAULT false,
    owner uuid,
    sections jsonb,
    update_at timestamp with time zone NOT NULL DEFAULT now(),
    source integer,
    slideshow boolean DEFAULT false,
    version ltree,
    id_db text COLLATE pg_catalog."default",
    ordb integer,
    CONSTRAINT templates_pkey PRIMARY KEY (id),
    CONSTRAINT templates_id_db_key UNIQUE (id_db),
    CONSTRAINT templates_source_fkey FOREIGN KEY (source)
        REFERENCES public.templates (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)


CREATE TABLE IF NOT EXISTS public.trusted_devices
(
    id integer NOT NULL DEFAULT nextval('trusted_devices_id_seq'::regclass),
    user_uuid uuid NOT NULL,
    device_name character varying(255) COLLATE pg_catalog."default",
    device_type character varying(255) COLLATE pg_catalog."default",
    device_os character varying(255) COLLATE pg_catalog."default" NOT NULL,
    device_browser character varying(255) COLLATE pg_catalog."default" NOT NULL,
    last_login timestamp with time zone NOT NULL,
    is_trusted boolean NOT NULL DEFAULT true,
    session_sid character varying(255) COLLATE pg_catalog."default",
    duuid1 uuid NOT NULL,
    duuid2 uuid NOT NULL,
    duuid3 uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT trusted_devices_pkey PRIMARY KEY (id),
    CONSTRAINT unique_user_device UNIQUE (user_uuid, device_os, device_browser, session_sid, duuid1, duuid2, duuid3),
    CONSTRAINT trusted_devices_session_sid_fkey FOREIGN KEY (session_sid)
        REFERENCES public.session (sid) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)


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
    deleted boolean DEFAULT false,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT unique_email UNIQUE (email),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_uuid_key UNIQUE (uuid)
)












