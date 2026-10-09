SET local check_function_bodies = off;

CREATE TABLE "public"."allocations" (
  "id"           uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"      uuid                     NOT NULL,
  "to_budget_id" uuid                     NOT NULL,
  "amount"       numeric(15,2)            NOT NULL,
  "created_at"   timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"   timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "allocations_amount_check" CHECK ((amount > (0)::numeric)),
  CONSTRAINT "allocations_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."allocations"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."budgets" (
  "id"                uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"           uuid                     NOT NULL,
  "created_at"        timestamp with time zone NOT NULL DEFAULT now(),
  "name"              text                     NOT NULL,
  "parent_id"         uuid,
  "balance_threshold" numeric(15,2)            DEFAULT NULL::numeric,
  "updated_at"        timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "budgets_balance_threshold_check" CHECK ((balance_threshold >= (0)::numeric)),
  CONSTRAINT "budgets_name_check" CHECK ((name <> ''::text)),
  CONSTRAINT "budgets_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."budgets"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."incomes" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"    uuid                     NOT NULL,
  "name"       text,
  "amount"     numeric(15,2),
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "incomes_amount_check" CHECK ((amount > (0)::numeric)),
  CONSTRAINT "incomes_name_check" CHECK ((name <> ''::text)),
  CONSTRAINT "incomes_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."incomes"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."transactions" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"    uuid                     NOT NULL,
  "budget_id"  uuid                     NOT NULL,
  "amount"     numeric(15,2)            NOT NULL,
  "name"       text                     NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "transactions_amount_check" CHECK ((amount > (0)::numeric)),
  CONSTRAINT "transactions_name_check" CHECK ((name <> ''::text)),
  CONSTRAINT "transactions_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."transactions"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."transfers" (
  "id"             uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "from_budget_id" uuid                     NOT NULL,
  "to_budget_id"   uuid                     NOT NULL,
  "amount"         numeric(15,2)            NOT NULL,
  "name"           text                     NOT NULL,
  "created_at"     timestamp with time zone NOT NULL DEFAULT now(),
  "user_id"        uuid                     NOT NULL,
  "updated_at"     timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "transfers_amount_check" CHECK ((amount > (0)::numeric)),
  CONSTRAINT "transfers_name_check" CHECK ((name <> ''::text)),
  CONSTRAINT "transfers_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."transfers"
  ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.get_budget_transactions (
  budget_id uuid
)
  RETURNS SETOF public.transactions
  LANGUAGE plpgsql
  AS $function$ 
begin
  return query
  
  with recursive budget_tree as (
    select id from budgets where id = budget_id

    union all

    select b.id from budgets b 
    inner join 
    budget_tree bt on b.parent_id = bt.id
  )

  select t.* from transactions t 
  where t.budget_id in (select id from budget_tree);
end;
$function$;

CREATE OR REPLACE FUNCTION public.update_timestamp()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $function$ 
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

ALTER TABLE "public"."allocations"
  ADD CONSTRAINT "allocations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."allocations"
  ADD CONSTRAINT "allocations_to_budget_id_fkey" FOREIGN KEY (to_budget_id) REFERENCES public.budgets(id) ON DELETE CASCADE;

ALTER TABLE "public"."budgets"
  ADD CONSTRAINT "budgets_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public.budgets(id) ON DELETE CASCADE;

ALTER TABLE "public"."budgets"
  ADD CONSTRAINT "budgets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."incomes"
  ADD CONSTRAINT "incomes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."transactions"
  ADD CONSTRAINT "transactions_budget_id_fkey" FOREIGN KEY (budget_id) REFERENCES public.budgets(id) ON DELETE CASCADE;

ALTER TABLE "public"."transactions"
  ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."transfers"
  ADD CONSTRAINT "transfers_from_budget_id_fkey" FOREIGN KEY (from_budget_id) REFERENCES public.budgets(id) ON DELETE CASCADE;

ALTER TABLE "public"."transfers"
  ADD CONSTRAINT "transfers_to_budget_id_fkey" FOREIGN KEY (to_budget_id) REFERENCES public.budgets(id) ON DELETE CASCADE;

ALTER TABLE "public"."transfers"
  ADD CONSTRAINT "transfers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX idx_allocations_to_budget_id ON public.allocations USING btree (to_budget_id);

CREATE INDEX idx_budgets_parent_id ON public.budgets USING btree (parent_id);

CREATE INDEX idx_transfers_from_budget_id ON public.transfers USING btree (from_budget_id);

CREATE INDEX idx_transfers_to_budget_id ON public.transfers USING btree (to_budget_id);

CREATE TRIGGER on_update
  BEFORE UPDATE ON public.allocations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER on_update
  BEFORE UPDATE ON public.budgets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER on_update
  BEFORE UPDATE ON public.incomes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER on_update
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER on_update
  BEFORE UPDATE ON public.transfers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_timestamp();

CREATE POLICY "on_allocations_delete" ON "public"."allocations"
  FOR DELETE
  TO "authenticated"
  USING ((user_id = auth.uid()));

CREATE POLICY "on_allocations_insert" ON "public"."allocations"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((user_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.budgets b
  WHERE ((b.id = allocations.to_budget_id) AND (b.user_id = auth.uid()))))));

CREATE POLICY "on_allocations_select" ON "public"."allocations"
  FOR SELECT
  TO "authenticated"
  USING ((user_id = auth.uid()));

CREATE POLICY "on_allocations_update" ON "public"."allocations"
  FOR UPDATE
  TO "authenticated"
  USING ((user_id = auth.uid()))
  WITH CHECK (((user_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.budgets b
  WHERE ((b.id = allocations.to_budget_id) AND (b.user_id = auth.uid()))))));

CREATE POLICY "users can select own budgets" ON "public"."budgets"
  FOR SELECT
  TO PUBLIC
  USING ((user_id = auth.uid()));

CREATE POLICY "users can update own budgets" ON "public"."budgets"
  FOR UPDATE
  TO PUBLIC
  USING ((user_id = auth.uid()))
  WITH CHECK (((user_id = auth.uid()) AND ((parent_id IS NULL) OR ((EXISTS ( WITH new_budget AS (
         SELECT budgets.parent_id AS pid
        )
 SELECT 1
   FROM public.budgets b,
    new_budget
  WHERE ((b.id = new_budget.pid) AND (b.user_id = auth.uid())))) AND (parent_id <> id) AND (NOT (EXISTS ( WITH RECURSIVE descendants AS (
         SELECT budgets_1.id
           FROM public.budgets budgets_1
          WHERE (budgets_1.parent_id = budgets_1.id)
        UNION
         SELECT b.id
           FROM (public.budgets b
             JOIN descendants d ON ((b.parent_id = d.id)))
        )
 SELECT 1
   FROM descendants
  WHERE (descendants.id = budgets.parent_id))))))));

CREATE POLICY "on_budgets_delete" ON "public"."budgets"
  FOR DELETE
  TO "authenticated"
  USING ((user_id = auth.uid()));

CREATE POLICY "on_budgets_insert" ON "public"."budgets"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((user_id = auth.uid()) AND ((parent_id IS NULL) OR (EXISTS ( SELECT 1
   FROM public.budgets b
  WHERE ((b.id = b.parent_id) AND (b.user_id = auth.uid())))))));

CREATE POLICY "on_income_insert" ON "public"."incomes"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((user_id = auth.uid()));

CREATE POLICY "on_incomes_delete" ON "public"."incomes"
  FOR DELETE
  TO "authenticated"
  USING ((user_id = auth.uid()));

CREATE POLICY "on_incomes_select" ON "public"."incomes"
  FOR SELECT
  TO "authenticated"
  USING ((user_id = auth.uid()));

CREATE POLICY "on_incomes_update" ON "public"."incomes"
  FOR UPDATE
  TO "authenticated"
  USING ((user_id = auth.uid()))
  WITH CHECK ((user_id = auth.uid()));

CREATE POLICY "user can delete own transaction" ON "public"."transactions"
  FOR DELETE
  TO PUBLIC
  USING ((user_id = auth.uid()));

CREATE POLICY "user can insert own transactions" ON "public"."transactions"
  FOR INSERT
  TO PUBLIC
  WITH CHECK (((user_id = auth.uid()) AND (EXISTS ( WITH t AS (
         SELECT transactions.budget_id AS bid
        )
 SELECT 1
   FROM public.budgets b,
    t
  WHERE ((t.bid = b.id) AND (b.user_id = auth.uid()))))));

CREATE POLICY "user can select own transactions" ON "public"."transactions"
  FOR SELECT
  TO PUBLIC
  USING ((user_id = auth.uid()));

CREATE POLICY "user can update own transactions" ON "public"."transactions"
  FOR UPDATE
  TO PUBLIC
  USING ((user_id = auth.uid()))
  WITH CHECK (((user_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.budgets b
  WHERE ((b.id = transactions.budget_id) AND (b.user_id = auth.uid()))))));

CREATE POLICY "users can create transfers for own budgets" ON "public"."transfers"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((user_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.budgets
  WHERE ((budgets.id = transfers.from_budget_id) AND (budgets.user_id = auth.uid())))) AND (EXISTS ( SELECT 1
   FROM public.budgets
  WHERE ((budgets.id = transfers.to_budget_id) AND (budgets.user_id = auth.uid()))))));

CREATE POLICY "users can delete own transfers" ON "public"."transfers"
  FOR DELETE
  TO "authenticated"
  USING ((user_id = auth.uid()));

CREATE POLICY "users can select own transfers" ON "public"."transfers"
  FOR SELECT
  TO "authenticated"
  USING ((user_id = auth.uid()));

CREATE POLICY "users can update transfers on own budgets" ON "public"."transfers"
  FOR UPDATE
  TO "authenticated"
  USING ((user_id = auth.uid()))
  WITH CHECK (((user_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.budgets
  WHERE ((budgets.id = transfers.from_budget_id) AND (budgets.user_id = auth.uid())))) AND (EXISTS ( SELECT 1
   FROM public.budgets
  WHERE ((budgets.id = transfers.to_budget_id) AND (budgets.user_id = auth.uid()))))));

GRANT EXECUTE ON FUNCTION "public"."get_budget_transactions"(uuid) TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."get_budget_transactions"(uuid) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_budget_transactions"(uuid) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_budget_transactions"(uuid) TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."update_timestamp"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."update_timestamp"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."update_timestamp"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."update_timestamp"() TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."allocations" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."allocations" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."allocations" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."allocations" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."budgets" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."budgets" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."budgets" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."budgets" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."incomes" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."incomes" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."incomes" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."incomes" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."transactions" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."transactions" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."transactions" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."transactions" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."transfers" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."transfers" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."transfers" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."transfers" TO "service_role";

