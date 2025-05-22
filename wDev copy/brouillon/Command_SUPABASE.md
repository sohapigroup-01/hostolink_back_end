EXPORTER BD LOCALE POSTGRES 
    pg_dump -U postgres -d hostolink_bd -F p -f "C:\Users\NGUESSAN.DESKTOP-38E6PIP\Desktop\SohapiGroup\hostolink_back-end\wDev\hostolink__bd_a_reviser_pour_supabase.sql"

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';


VOIR TOUTES LES TABLES
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public';

SUPPRIMER TOUTES LES TABLES
    DO $$
    DECLARE
        r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename != 'spatial_ref_sys') LOOP
            EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE;';
        END LOOP;
    END $$;


-- commande pour voir le nombre de tables 
SELECT COUNT(*) 
FROM information_schema.tables 
WHERE table_schema = 'public';