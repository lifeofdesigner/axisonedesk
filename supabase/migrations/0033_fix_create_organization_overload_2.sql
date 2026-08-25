-- Fix: same class of bug as 0030_fix_create_organization_overload.sql —
-- 0032_onboarding_full_profile.sql's `create or replace function` added
-- more trailing parameters to create_organization_with_owner, which again
-- created a new Postgres overload rather than replacing the 4-arg version
-- from 0029/0031, rather than being caught before applying this time.
-- Verified live: 2 overloads existed after 0032 applied. Drop the stale
-- 4-arg one, leaving only the current 12-arg version.
--
-- Lesson reinforced for any future migration that adds parameters to an
-- existing function: always drop the previous-arity overload in the SAME
-- migration, don't rely on `create or replace` alone.

drop function if exists public.create_organization_with_owner(text, text, text, text);
