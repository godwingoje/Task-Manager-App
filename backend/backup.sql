--
-- PostgreSQL database dump
--

\restrict tjjaqooL51OVCzWAKm54H65FvvOFKePD5APQ2IvfkhoyOFIQgfzbOtkqJ3DOt1Y

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: Priority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Priority" AS ENUM (
    'Low',
    'Medium',
    'High'
);


ALTER TYPE public."Priority" OWNER TO postgres;

--
-- Name: Status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Status" AS ENUM (
    'Pending',
    'Done'
);


ALTER TYPE public."Status" OWNER TO postgres;

--
-- Name: Tag; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Tag" AS ENUM (
    'General',
    'Work',
    'Urgent',
    'Vibe'
);


ALTER TYPE public."Tag" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Task; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Task" (
    id integer NOT NULL,
    title text NOT NULL,
    "dueDate" timestamp(3) without time zone NOT NULL,
    description text NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    tag public."Tag" DEFAULT 'General'::public."Tag" NOT NULL,
    status public."Status" DEFAULT 'Pending'::public."Status" NOT NULL,
    priority public."Priority" DEFAULT 'Medium'::public."Priority" NOT NULL
);


ALTER TABLE public."Task" OWNER TO postgres;

--
-- Name: Task_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Task_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Task_id_seq" OWNER TO postgres;

--
-- Name: Task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Task_id_seq" OWNED BY public."Task".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Task id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task" ALTER COLUMN id SET DEFAULT nextval('public."Task_id_seq"'::regclass);


--
-- Data for Name: Task; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Task" (id, title, "dueDate", description, completed, "createdAt", "updatedAt", tag, status, priority) FROM stdin;
2	Submit assignment	2026-06-30 13:16:00	Finish and submit Task card assignment.	t	2026-06-16 13:58:35.083	2026-06-18 09:14:48.558	General	Pending	Medium
38	Drink 10 gallons of water	2026-06-29 11:19:00	drink a gallon a day	f	2026-06-17 14:11:27.517	2026-06-18 12:34:34.285	General	Pending	Medium
42	Evangelize	2026-06-30 15:17:00	Preach the good news	f	2026-06-18 15:18:05.183	2026-06-18 15:18:05.183	Urgent	Pending	High
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
1e3eee06-22d6-4dbc-9966-81bc320c7884	74a2b9e522f48962b4cd0093356852ca45bd98be37d4745db311d82e808a9328	2026-06-16 12:29:17.188615+01	20260616112915_add_task_table	\N	\N	2026-06-16 12:29:15.443321+01	1
\.


--
-- Name: Task_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Task_id_seq"', 43, true);


--
-- Name: Task Task_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict tjjaqooL51OVCzWAKm54H65FvvOFKePD5APQ2IvfkhoyOFIQgfzbOtkqJ3DOt1Y

