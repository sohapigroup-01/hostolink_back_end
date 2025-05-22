CREATE TYPE public.moyen_envoi_enum AS ENUM (
    'email',
    'telephone'
);

CREATE TYPE public.type_etablissement_enum AS ENUM (
    'hopital',
    'clinique',
    'pharmacie',
    'centre_medical',
    'autre'
);

CREATE TYPE public.type_notification_enum AS ENUM (
    'paiement',
    'retrait',
    'virement',
    'autre'
);

CREATE TABLE public.administrateurs (
    id_admin_gestionnaire integer NOT NULL,
    email character varying(255) NOT NULL,
    telephone character varying(20) NOT NULL,
    mot_de_passe character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    permissions jsonb DEFAULT '{}'::jsonb,
    statut character varying(20) DEFAULT 'actif'::character varying,
    dernier_connexion timestamp without time zone,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    compte_verifier character varying(255) DEFAULT false
);

CREATE SEQUENCE public.administrateurs_id_admin_gestionnaire_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.administrateurs_id_admin_gestionnaire_seq OWNER TO postgres;

ALTER SEQUENCE public.administrateurs_id_admin_gestionnaire_seq OWNED BY public.administrateurs.id_admin_gestionnaire;

CREATE TABLE public.agent_assistance (
    id_agent_assistance integer NOT NULL,
    id_admin_gestionnaire integer NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    telephone character varying(20),
    mdp character varying(255) NOT NULL,
    statut character varying(20) DEFAULT 'actif'::character varying,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    url_photo_agent character varying(255)
);

CREATE SEQUENCE public.agent_assistance_id_agent_assistance_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.agent_assistance_id_agent_assistance_seq OWNER TO postgres;

ALTER SEQUENCE public.agent_assistance_id_agent_assistance_seq OWNED BY public.agent_assistance.id_agent_assistance;

CREATE TABLE public.annonce (
    id_annonce integer NOT NULL,
    id_admin_gestionnaire integer NOT NULL,
    titre_annonce character varying(255),
    description_annonce text,
    date date,
    url_images character varying(255) DEFAULT NULL::character varying
);

CREATE SEQUENCE public.annonce_id_annonce_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.annonce_id_annonce_seq OWNER TO postgres;

ALTER SEQUENCE public.annonce_id_annonce_seq OWNED BY public.annonce.id_annonce;

CREATE TABLE public.assistance_categories (
    id_categorie integer NOT NULL,
    titre character varying(255) NOT NULL,
    description text NOT NULL,
    reponse_automatique text NOT NULL
);

CREATE SEQUENCE public.assistance_categories_id_categorie_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.assistance_categories_id_categorie_seq OWNER TO postgres;

ALTER SEQUENCE public.assistance_categories_id_categorie_seq OWNED BY public.assistance_categories.id_categorie;

CREATE TABLE public.cartes_bancaires (
    id_carte_bancaire integer NOT NULL,
    type_carte character varying(20) NOT NULL,
    banque character varying(100) DEFAULT 'Hostolink'::character varying,
    alias character varying(50),
    numero_carte character varying(20) DEFAULT '****-****-****-1234'::character varying,
    date_expiration date NOT NULL,
    statut character varying(20) DEFAULT 'inactif'::character varying,
    kyc_verifie boolean DEFAULT false,
    commande_physique boolean DEFAULT false,
    date_creation timestamp without time zone DEFAULT now(),
    id_compte integer NOT NULL,
    id_user uuid,
    CONSTRAINT cartes_bancaires_type_carte_check CHECK (((type_carte)::text = ANY ((ARRAY['physique'::character varying, 'virtuelle'::character varying])::text[])))
);

CREATE SEQUENCE public.cartes_bancaires_id_carte_bancaire_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.cartes_bancaires_id_carte_bancaire_seq OWNER TO postgres;

ALTER SEQUENCE public.cartes_bancaires_id_carte_bancaire_seq OWNED BY public.cartes_bancaires.id_carte_bancaire;

CREATE TABLE public.cartes_physiques (
    id_commande integer NOT NULL,
    id_utilisateur integer NOT NULL,
    id_carte_bancaire integer NOT NULL,
    adresse_livraison text NOT NULL,
    statut character varying(20) DEFAULT 'en attente'::character varying,
    date_commande timestamp without time zone DEFAULT now(),
    id_user uuid
);

CREATE SEQUENCE public.cartes_physiques_id_commande_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.cartes_physiques_id_commande_seq OWNER TO postgres;

ALTER SEQUENCE public.cartes_physiques_id_commande_seq OWNED BY public.cartes_physiques.id_commande;

CREATE TABLE public.cartes_qr_code_statique (
    id_carte_qr_statique integer NOT NULL,
    id_utilisateur integer NOT NULL,
    qr_code_unique text NOT NULL,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    statut character varying(20) DEFAULT 'actif'::character varying,
    id_user uuid
);

CREATE SEQUENCE public.cartes_qr_code_statique_id_carte_qr_statique_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.cartes_qr_code_statique_id_carte_qr_statique_seq OWNER TO postgres;

ALTER SEQUENCE public.cartes_qr_code_statique_id_carte_qr_statique_seq OWNED BY public.cartes_qr_code_statique.id_carte_qr_statique;

CREATE TABLE public.code_verif_otp (
    id integer NOT NULL,
    otp_code character varying(6) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    is_valid boolean DEFAULT true NOT NULL,
    moyen_envoyer public.moyen_envoi_enum NOT NULL,
    id_user uuid,
    id_user_etablissement_sante integer,
    CONSTRAINT check_id_user_or_etablissement CHECK ((((id_user IS NOT NULL) AND (id_user_etablissement_sante IS NULL)) OR ((id_user IS NULL) AND (id_user_etablissement_sante IS NOT NULL))))
);
DROP SEQUENCE IF EXISTS public.code_verif_otp_id_seq CASCADE;

CREATE SEQUENCE public.code_verif_otp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.code_verif_otp_id_seq OWNER TO postgres;

ALTER SEQUENCE public.code_verif_otp_id_seq OWNED BY public.code_verif_otp.id;
ALTER TABLE ONLY public.code_verif_otp ALTER COLUMN id SET DEFAULT nextval('public.code_verif_otp_id_seq'::regclass);

CREATE TABLE public.commentaire (
    id_commentaire integer NOT NULL,
    id_publication integer NOT NULL,
    id_user integer NOT NULL,
    contenu text NOT NULL,
    date_commentaire timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.compte (
    id_compte integer NOT NULL,
    solde_compte integer DEFAULT 0,
    solde_bonus integer DEFAULT 0,
    cumule_mensuel integer DEFAULT 0,
    plafond integer DEFAULT 0,
    mode_paiement_preferentiel character varying(50),
    type_user character varying(20) NOT NULL,
    devise character varying(10) DEFAULT 'XOF'::character varying NOT NULL,
    numero_compte character varying(50),
    date_creation_compte timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    statut character varying(20) DEFAULT 'actif'::character varying,
    id_user uuid,
    id_user_etablissement_sante integer,
    CONSTRAINT compte_type_user_check CHECK (((type_user)::text = ANY (ARRAY[('utilisateur'::character varying)::text, ('etablissement'::character varying)::text])))
);

CREATE SEQUENCE public.compte_id_compte_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.compte_id_compte_seq OWNER TO postgres;

ALTER SEQUENCE public.compte_id_compte_seq OWNED BY public.compte.id_compte;

CREATE TABLE public.contacts_hostolink (
    id_contact integer NOT NULL,
    id_compte_contact integer NOT NULL,
    alias_contact character varying(100),
    nom_contact character varying(255),
    numero_contact character varying(20) NOT NULL,
    date_ajout timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_user uuid,
    id_contact_user uuid
);

CREATE SEQUENCE public.contacts_hostolink_id_contact_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.contacts_hostolink_id_contact_seq OWNER TO postgres;

ALTER SEQUENCE public.contacts_hostolink_id_contact_seq OWNED BY public.contacts_hostolink.id_contact;

CREATE TABLE public.discussion_assistant_client (
    id_discussion integer NOT NULL,
    id_agent_assistance integer NOT NULL,
    id_etablissement integer,
    sujet character varying(255) NOT NULL,
    statut character varying(20) DEFAULT 'en_attente'::character varying,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_dernier_message timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_categorie_assistance integer NOT NULL,
    id_user_etablissement_sante integer,
    id_user uuid,
    CONSTRAINT discussion_assistant_client_statut_check CHECK (((statut)::text = ANY ((ARRAY['en_attente'::character varying, 'en_cours'::character varying, 'resolu'::character varying, 'ferme'::character varying])::text[])))
);

CREATE SEQUENCE public.discussion_assistant_client_id_discussion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.discussion_assistant_client_id_discussion_seq OWNER TO postgres;

ALTER SEQUENCE public.discussion_assistant_client_id_discussion_seq OWNED BY public.discussion_assistant_client.id_discussion;

CREATE TABLE public.expert_sante (
    id_expert integer NOT NULL,
    id_user_etablissement_sante integer NOT NULL,
    nom character varying(100),
    prenom character varying(100),
    domaine_expertise character varying(255),
    identifiant character(6) NOT NULL,
    mot_de_passe text NOT NULL,
    url_profile text
);

CREATE SEQUENCE public.expert_sante_id_expert_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.expert_sante_id_expert_seq OWNER TO postgres;

ALTER SEQUENCE public.expert_sante_id_expert_seq OWNED BY public.expert_sante.id_expert;

CREATE TABLE public.historique_transactions (
    id_historique integer NOT NULL,
    id_transaction integer NOT NULL,
    ancien_statut character varying(20),
    nouveau_statut character varying(20),
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_user_etablissement_sante integer,
    id_user uuid
);

CREATE SEQUENCE public.historique_transactions_id_historique_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.historique_transactions_id_historique_seq OWNER TO postgres;

ALTER SEQUENCE public.historique_transactions_id_historique_seq OWNED BY public.historique_transactions.id_historique;

CREATE TABLE public.images (
    id_image uuid DEFAULT gen_random_uuid() NOT NULL,
    date timestamp without time zone DEFAULT now() NOT NULL,
    url_image character varying NOT NULL,
    motif character varying(50) NOT NULL,
    type_user character varying(50),
    id_user uuid,
    id_user_etablissement_sante integer,
    id_admin_gestionnaire integer
);

CREATE TABLE public.journal_activites (
    id_activite integer NOT NULL,
    id_user integer,
    id_admin_gestionnaire integer,
    action character varying(255) NOT NULL,
    details text,
    date_heure timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.journal_activites_id_activite_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.journal_activites_id_activite_seq OWNER TO postgres;

ALTER SEQUENCE public.journal_activites_id_activite_seq OWNED BY public.journal_activites.id_activite;

CREATE TABLE public.liste_numero_vert_etablissement_sante (
    id_liste_num_etablissement_sante integer NOT NULL,
    id_admin_gestionnaire integer NOT NULL,
    nom_etablissement character varying(255) NOT NULL,
    contact character varying(20) NOT NULL,
    image character varying(255),
    presentation text NOT NULL,
    adresse character varying(255) NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    type_etablissement public.type_etablissement_enum NOT NULL,
    site_web character varying(255),
    categorie character varying(255) DEFAULT NULL::character varying
);

CREATE SEQUENCE public.liste_numero_vert_etablisseme_id_liste_num_etablissement_sa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.liste_numero_vert_etablisseme_id_liste_num_etablissement_sa_seq OWNER TO postgres;

ALTER SEQUENCE public.liste_numero_vert_etablisseme_id_liste_num_etablissement_sa_seq OWNED BY public.liste_numero_vert_etablissement_sante.id_liste_num_etablissement_sante;

CREATE TABLE public.message_assistant_client (
    id_message integer NOT NULL,
    id_discussion integer NOT NULL,
    expediteur character varying(20) NOT NULL,
    id_expediteur integer NOT NULL,
    contenu text NOT NULL,
    type_message character varying(20) DEFAULT 'texte'::character varying,
    url_fichier character varying(255),
    date_envoi timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_user_etablissement_sante integer,
    id_user uuid,
    CONSTRAINT message_assistant_client_expediteur_check CHECK (((expediteur)::text = ANY ((ARRAY['utilisateur'::character varying, 'etablissement'::character varying, 'agent_assistance'::character varying])::text[]))),
    CONSTRAINT message_assistant_client_type_message_check CHECK (((type_message)::text = ANY ((ARRAY['texte'::character varying, 'image'::character varying, 'fichier'::character varying])::text[])))
);

CREATE SEQUENCE public.message_assistant_client_id_message_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.message_assistant_client_id_message_seq OWNER TO postgres;

ALTER SEQUENCE public.message_assistant_client_id_message_seq OWNED BY public.message_assistant_client.id_message;

CREATE TABLE public.messages_thematique (
    id_message integer NOT NULL,
    id_thematique_discussion integer NOT NULL,
    id_expediteur uuid NOT NULL,
    contenu text NOT NULL,
    type_message character varying(20) NOT NULL,
    date_envoi timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    est_lu boolean DEFAULT false,
    url_image text,
    nbre_like integer,
    status_reponse boolean DEFAULT false,
    CONSTRAINT messages_thematique_type_message_check CHECK (((type_message)::text = ANY (ARRAY[('texte'::character varying)::text, ('image'::character varying)::text])))
);

CREATE SEQUENCE public.messages_thematique_id_message_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.messages_thematique_id_message_seq OWNER TO postgres;

ALTER SEQUENCE public.messages_thematique_id_message_seq OWNED BY public.messages_thematique.id_message;

CREATE TABLE public.notification_broadcast (
    id_notification_broadcast integer NOT NULL,
    id_admin_gestionnaire integer NOT NULL,
    cible character varying(20) NOT NULL,
    titre character varying(255) NOT NULL,
    message text NOT NULL,
    statut character varying(20) DEFAULT 'envoye'::character varying,
    date_envoi timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_user_etablissement_sante integer,
    CONSTRAINT notification_broadcast_cible_check CHECK (((cible)::text = ANY ((ARRAY['utilisateur'::character varying, 'etablissement'::character varying])::text[])))
);

CREATE SEQUENCE public.notification_broadcast_id_notification_broadcast_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.notification_broadcast_id_notification_broadcast_seq OWNER TO postgres;

ALTER SEQUENCE public.notification_broadcast_id_notification_broadcast_seq OWNED BY public.notification_broadcast.id_notification_broadcast;

CREATE TABLE public.notification_transaction (
    id_notification_transaction integer NOT NULL,
    id_transaction integer NOT NULL,
    identif_transaction character varying(10) DEFAULT ('Hstlk-'::text || substr(md5((random())::text), 1, 5)) NOT NULL,
    type_notification public.type_notification_enum NOT NULL,
    contenu text NOT NULL,
    montant numeric(15,2),
    date_envoi timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    statut character varying(20) DEFAULT 'envoy‚'::character varying,
    is_lu boolean DEFAULT false NOT NULL,
    id_user_etablissement_sante integer,
    id_user uuid
);

CREATE TABLE public.partage (
    id_partage integer NOT NULL,
    id_publication integer NOT NULL,
    id_user integer NOT NULL,
    date_partage timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    lien_partage character varying(255),
    plateforme_partage character varying(255),
    nombre_clics integer DEFAULT 0,
    id_user_etablissement_sante integer
);

CREATE TABLE public.publication (
    id_publication integer NOT NULL,
    titre_publication character varying(255) NOT NULL,
    contenu text NOT NULL,
    image character varying(255),
    date_publication timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    compteur_like integer DEFAULT 0,
    id_user_etablissement_sante integer,
    id_admin_gestionnaire integer NOT NULL,
    id_user uuid
);

CREATE TABLE public.publicite (
    id_pub integer NOT NULL,
    id_admin_gestionnaire integer NOT NULL,
    titre character varying(255) NOT NULL,
    descript_pub text NOT NULL,
    url_image_pub character varying(255),
    date_debut_pub date NOT NULL,
    date_fin_pub date NOT NULL,
    statuts character varying(20) DEFAULT 'actif'::character varying
);

CREATE TABLE public.qr_code_paiement_dynamique (
    id_qrcode integer NOT NULL,
    qr_code_valeur text,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_expiration timestamp without time zone NOT NULL,
    statut character varying(20) DEFAULT 'actif'::character varying,
    token character varying(1000) DEFAULT NULL::character varying,
    id_user_etablissement_sante integer,
    id_user uuid
);

CREATE SEQUENCE public.qr_code_paiement_id_qrcode_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.qr_code_paiement_id_qrcode_seq OWNER TO postgres;

ALTER SEQUENCE public.qr_code_paiement_id_qrcode_seq OWNED BY public.qr_code_paiement_dynamique.id_qrcode;

CREATE TABLE public.qr_code_paiement_statique (
    id_qrcode integer NOT NULL,
    qr_code_data text,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    statut character varying(20) DEFAULT 'actif'::character varying,
    id_user_etablissement_sante integer,
    id_user uuid,
    date_expiration timestamp without time zone,
    token character varying(1000)
);

CREATE SEQUENCE public.qr_code_paiement_statique_id_qrcode_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.qr_code_paiement_statique_id_qrcode_seq OWNER TO postgres;

ALTER SEQUENCE public.qr_code_paiement_statique_id_qrcode_seq OWNED BY public.qr_code_paiement_statique.id_qrcode;

CREATE TABLE public.reclamations (
    id_reclamation integer NOT NULL,
    id_transaction integer,
    sujet character varying(255) NOT NULL,
    description text NOT NULL,
    statut character varying(20) DEFAULT 'en_attente'::character varying,
    date_ouverture timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    motif character varying(255) DEFAULT 'Autre'::character varying,
    id_user_etablissement_sante integer,
    id_admin_gestionnaire integer NOT NULL,
    id_user uuid
);

CREATE SEQUENCE public.reclamations_id_reclamation_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.reclamations_id_reclamation_seq OWNER TO postgres;

ALTER SEQUENCE public.reclamations_id_reclamation_seq OWNED BY public.reclamations.id_reclamation;

CREATE TABLE public.thematiques (
    id_thematique_discussion integer NOT NULL,
    id_admin_gestionnaire integer NOT NULL,
    titre_thematique character varying(255) NOT NULL,
    sous_titre character varying(255),
    image character varying(255),
    description text NOT NULL,
    nbre_expert integer DEFAULT 0,
    date_ajout timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE public.thematiques_id_thematique_discussion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.thematiques_id_thematique_discussion_seq OWNER TO postgres;

ALTER SEQUENCE public.thematiques_id_thematique_discussion_seq OWNED BY public.thematiques.id_thematique_discussion;

CREATE TABLE public.transaction_externe (
    id_transaction_externe integer NOT NULL,
    id_utilisateur integer NOT NULL,
    montant numeric(15,2) NOT NULL,
    frais_transaction numeric(10,2) DEFAULT 0.00,
    statut character varying(20) DEFAULT 'en attente'::character varying,
    devise character varying(10) NOT NULL,
    type_transaction character varying(100),
    moyen_paiement character varying(50),
    reference_externe character varying(100),
    date_transaction timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    motif character varying(255) NOT NULL,
    id_compte integer NOT NULL,
    id_moyen_paiement integer NOT NULL,
    id_transaction integer,
    CONSTRAINT transaction_externe_moyen_paiement_check CHECK (((moyen_paiement)::text = ANY ((ARRAY['wave'::character varying, 'mtn'::character varying, 'moov'::character varying, 'orange'::character varying, 'paypal'::character varying, 'djamo'::character varying, 'push'::character varying, 'carte_bancaire'::character varying, 'virement_bancaire'::character varying])::text[]))),
    CONSTRAINT transaction_externe_type_transaction_check CHECK (((type_transaction)::text = ANY ((ARRAY['depot'::character varying, 'retrait'::character varying])::text[])))
);

CREATE SEQUENCE public.transaction_externe_id_transaction_externe_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.transaction_externe_id_transaction_externe_seq OWNER TO postgres;

ALTER SEQUENCE public.transaction_externe_id_transaction_externe_seq OWNED BY public.transaction_externe.id_transaction_externe;

CREATE TABLE public.transaction_interne (
    id_transaction integer NOT NULL,
    id_compte_expediteur integer NOT NULL,
    id_utilisateur_recepteur integer,
    id_etablissement_recepteur integer,
    montant numeric(15,2) NOT NULL,
    frais_transaction numeric(10,2) DEFAULT 0.00,
    statut character varying(20) DEFAULT 'en attente'::character varying,
    devise_transaction character varying(10) NOT NULL,
    type_transaction character varying(100),
    date_transaction timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_qrcode integer,
    id_compte_recepteur integer NOT NULL,
    id_user_etablissement_sante integer,
    CONSTRAINT transaction_interne_check CHECK (((id_utilisateur_recepteur IS NOT NULL) OR (id_etablissement_recepteur IS NOT NULL))),
    CONSTRAINT transaction_interne_type_transaction_check CHECK (((type_transaction)::text = ANY ((ARRAY['transfert'::character varying, 'paiement_qrcode'::character varying])::text[])))
);

CREATE SEQUENCE public.transaction_interne_id_transaction_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.transaction_interne_id_transaction_seq OWNER TO postgres;

ALTER SEQUENCE public.transaction_interne_id_transaction_seq OWNED BY public.transaction_interne.id_transaction;

CREATE TABLE public.transactions_bancaires (
    id_transaction integer NOT NULL,
    id_carte_bancaire integer NOT NULL,
    montant numeric(15,2) NOT NULL,
    devise character varying(10) NOT NULL,
    statut character varying(20) DEFAULT 'en attente'::character varying,
    date_transaction timestamp without time zone DEFAULT now(),
    description text
);

CREATE SEQUENCE public.transactions_bancaires_id_transaction_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.transactions_bancaires_id_transaction_seq OWNER TO postgres;

ALTER SEQUENCE public.transactions_bancaires_id_transaction_seq OWNED BY public.transactions_bancaires.id_transaction;

CREATE TABLE public.transactions_frais (
    id_frais integer NOT NULL,
    id_transaction integer NOT NULL,
    montant_frais integer NOT NULL,
    type_transaction character varying(20) NOT NULL,
    mode_paiement character varying(20) NOT NULL,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT transactions_frais_mode_paiement_check CHECK (((mode_paiement)::text = ANY ((ARRAY['wallet'::character varying, 'mobile_money'::character varying, 'banque'::character varying])::text[]))),
    CONSTRAINT transactions_frais_type_transaction_check CHECK (((type_transaction)::text = ANY ((ARRAY['interne'::character varying, 'externe'::character varying, 'bancaire'::character varying])::text[])))
);

CREATE SEQUENCE public.transactions_frais_id_frais_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.transactions_frais_id_frais_seq OWNER TO postgres;

ALTER SEQUENCE public.transactions_frais_id_frais_seq OWNED BY public.transactions_frais.id_frais;

CREATE TABLE public.user_etablissement_sante (
    id_user_etablissement_sante integer NOT NULL,
    nom character varying(255),
    telephone character varying(20),
    categorie character varying(100),
    adresse text,
    creat_at timestamp without time zone DEFAULT now(),
    latitude double precision,
    longitude double precision,
    geom public.geometry(Point,4326),
    specialites character varying,
    email character varying(255) DEFAULT NULL::character varying,
    mot_de_passe text
);

CREATE SEQUENCE public.user_etablissement_sante_id_user_etablissement_sante_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.user_etablissement_sante_id_user_etablissement_sante_seq OWNER TO postgres;

ALTER SEQUENCE public.user_etablissement_sante_id_user_etablissement_sante_seq OWNED BY public.user_etablissement_sante.id_user_etablissement_sante;

CREATE TABLE public.utilisateur (
    date_inscription timestamp without time zone DEFAULT now() NOT NULL,
    "position" public.geometry(Point,4326),
    email character varying(255),
    telephone character varying(20),
    mdp character varying(255),
    nom character varying(255),
    prenom character varying(255),
    pays character varying(100),
    raison_banni text DEFAULT 'R.A.S'::text,
    id_user uuid DEFAULT gen_random_uuid() NOT NULL,
    compte_verifier boolean DEFAULT false,
    dernier_otp_envoye timestamp without time zone,
    actif boolean DEFAULT true,
    fcm_token character varying(255) DEFAULT NULL::character varying
);

CREATE TABLE public.verification_kyc (
    id_kyc integer NOT NULL,
    id_utilisateur integer NOT NULL,
    type_document character varying(50),
    url_document_recto text NOT NULL,
    url_document_verso text,
    selfie_url text NOT NULL,
    statut character varying(20) DEFAULT 'en attente'::character varying,
    date_soumission timestamp without time zone DEFAULT now(),
    id_user_etablissement_sante integer,
    id_user uuid,
    CONSTRAINT verification_kyc_type_document_check CHECK (((type_document)::text = ANY ((ARRAY['CNI'::character varying, 'Passeport'::character varying, 'Permis de conduire'::character varying])::text[])))
);

CREATE SEQUENCE public.verification_kyc_id_kyc_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.verification_kyc_id_kyc_seq OWNER TO postgres;

ALTER SEQUENCE public.verification_kyc_id_kyc_seq OWNED BY public.verification_kyc.id_kyc;

ALTER TABLE ONLY public.administrateurs ALTER COLUMN id_admin_gestionnaire SET DEFAULT nextval('public.administrateurs_id_admin_gestionnaire_seq'::regclass);

ALTER TABLE ONLY public.agent_assistance ALTER COLUMN id_agent_assistance SET DEFAULT nextval('public.agent_assistance_id_agent_assistance_seq'::regclass);

ALTER TABLE ONLY public.annonce ALTER COLUMN id_annonce SET DEFAULT nextval('public.annonce_id_annonce_seq'::regclass);

ALTER TABLE ONLY public.assistance_categories ALTER COLUMN id_categorie SET DEFAULT nextval('public.assistance_categories_id_categorie_seq'::regclass);

ALTER TABLE ONLY public.cartes_bancaires ALTER COLUMN id_carte_bancaire SET DEFAULT nextval('public.cartes_bancaires_id_carte_bancaire_seq'::regclass);

ALTER TABLE ONLY public.cartes_physiques ALTER COLUMN id_commande SET DEFAULT nextval('public.cartes_physiques_id_commande_seq'::regclass);

ALTER TABLE ONLY public.cartes_qr_code_statique ALTER COLUMN id_carte_qr_statique SET DEFAULT nextval('public.cartes_qr_code_statique_id_carte_qr_statique_seq'::regclass);


ALTER TABLE ONLY public.compte ALTER COLUMN id_compte SET DEFAULT nextval('public.compte_id_compte_seq'::regclass);

ALTER TABLE ONLY public.contacts_hostolink ALTER COLUMN id_contact SET DEFAULT nextval('public.contacts_hostolink_id_contact_seq'::regclass);

ALTER TABLE ONLY public.discussion_assistant_client ALTER COLUMN id_discussion SET DEFAULT nextval('public.discussion_assistant_client_id_discussion_seq'::regclass);

ALTER TABLE ONLY public.expert_sante ALTER COLUMN id_expert SET DEFAULT nextval('public.expert_sante_id_expert_seq'::regclass);

ALTER TABLE ONLY public.historique_transactions ALTER COLUMN id_historique SET DEFAULT nextval('public.historique_transactions_id_historique_seq'::regclass);

ALTER TABLE ONLY public.journal_activites ALTER COLUMN id_activite SET DEFAULT nextval('public.journal_activites_id_activite_seq'::regclass);

ALTER TABLE ONLY public.liste_numero_vert_etablissement_sante ALTER COLUMN id_liste_num_etablissement_sante SET DEFAULT nextval('public.liste_numero_vert_etablisseme_id_liste_num_etablissement_sa_seq'::regclass);

ALTER TABLE ONLY public.message_assistant_client ALTER COLUMN id_message SET DEFAULT nextval('public.message_assistant_client_id_message_seq'::regclass);

ALTER TABLE ONLY public.messages_thematique ALTER COLUMN id_message SET DEFAULT nextval('public.messages_thematique_id_message_seq'::regclass);

ALTER TABLE ONLY public.notification_broadcast ALTER COLUMN id_notification_broadcast SET DEFAULT nextval('public.notification_broadcast_id_notification_broadcast_seq'::regclass);

ALTER TABLE ONLY public.qr_code_paiement_dynamique ALTER COLUMN id_qrcode SET DEFAULT nextval('public.qr_code_paiement_id_qrcode_seq'::regclass);

ALTER TABLE ONLY public.qr_code_paiement_statique ALTER COLUMN id_qrcode SET DEFAULT nextval('public.qr_code_paiement_statique_id_qrcode_seq'::regclass);

ALTER TABLE ONLY public.reclamations ALTER COLUMN id_reclamation SET DEFAULT nextval('public.reclamations_id_reclamation_seq'::regclass);

ALTER TABLE ONLY public.thematiques ALTER COLUMN id_thematique_discussion SET DEFAULT nextval('public.thematiques_id_thematique_discussion_seq'::regclass);

ALTER TABLE ONLY public.transaction_externe ALTER COLUMN id_transaction_externe SET DEFAULT nextval('public.transaction_externe_id_transaction_externe_seq'::regclass);

ALTER TABLE ONLY public.transaction_interne ALTER COLUMN id_transaction SET DEFAULT nextval('public.transaction_interne_id_transaction_seq'::regclass);

ALTER TABLE ONLY public.transactions_bancaires ALTER COLUMN id_transaction SET DEFAULT nextval('public.transactions_bancaires_id_transaction_seq'::regclass);

ALTER TABLE ONLY public.transactions_frais ALTER COLUMN id_frais SET DEFAULT nextval('public.transactions_frais_id_frais_seq'::regclass);

ALTER TABLE ONLY public.user_etablissement_sante ALTER COLUMN id_user_etablissement_sante SET DEFAULT nextval('public.user_etablissement_sante_id_user_etablissement_sante_seq'::regclass);

ALTER TABLE ONLY public.verification_kyc ALTER COLUMN id_kyc SET DEFAULT nextval('public.verification_kyc_id_kyc_seq'::regclass);

ALTER TABLE ONLY public.administrateurs
    ADD CONSTRAINT administrateurs_email_key UNIQUE (email);

ALTER TABLE ONLY public.administrateurs
    ADD CONSTRAINT administrateurs_pkey PRIMARY KEY (id_admin_gestionnaire);

ALTER TABLE ONLY public.administrateurs
    ADD CONSTRAINT administrateurs_telephone_key UNIQUE (telephone);

ALTER TABLE ONLY public.agent_assistance
    ADD CONSTRAINT agent_assistance_email_key UNIQUE (email);

ALTER TABLE ONLY public.agent_assistance
    ADD CONSTRAINT agent_assistance_pkey PRIMARY KEY (id_agent_assistance);

ALTER TABLE ONLY public.annonce
    ADD CONSTRAINT annonce_pkey PRIMARY KEY (id_annonce);

ALTER TABLE ONLY public.assistance_categories
    ADD CONSTRAINT assistance_categories_pkey PRIMARY KEY (id_categorie);

ALTER TABLE ONLY public.cartes_bancaires
    ADD CONSTRAINT cartes_bancaires_pkey PRIMARY KEY (id_carte_bancaire);

ALTER TABLE ONLY public.cartes_physiques
    ADD CONSTRAINT cartes_physiques_pkey PRIMARY KEY (id_commande);

ALTER TABLE ONLY public.cartes_qr_code_statique
    ADD CONSTRAINT cartes_qr_code_statique_pkey PRIMARY KEY (id_carte_qr_statique);

ALTER TABLE ONLY public.compte
    ADD CONSTRAINT compte_numero_compte_key UNIQUE (numero_compte);

ALTER TABLE ONLY public.compte
    ADD CONSTRAINT compte_pkey PRIMARY KEY (id_compte);

ALTER TABLE ONLY public.contacts_hostolink
    ADD CONSTRAINT contacts_hostolink_pkey PRIMARY KEY (id_contact);

ALTER TABLE ONLY public.discussion_assistant_client
    ADD CONSTRAINT discussion_assistant_client_pkey PRIMARY KEY (id_discussion);

ALTER TABLE ONLY public.expert_sante
    ADD CONSTRAINT expert_sante_identifiant_key UNIQUE (identifiant);

ALTER TABLE ONLY public.expert_sante
    ADD CONSTRAINT expert_sante_pkey PRIMARY KEY (id_expert);

ALTER TABLE ONLY public.historique_transactions
    ADD CONSTRAINT historique_transactions_pkey PRIMARY KEY (id_historique);

ALTER TABLE ONLY public.journal_activites
    ADD CONSTRAINT journal_activites_pkey PRIMARY KEY (id_activite);

ALTER TABLE ONLY public.liste_numero_vert_etablissement_sante
    ADD CONSTRAINT liste_numero_vert_etablissement_sante_pkey PRIMARY KEY (id_liste_num_etablissement_sante);

ALTER TABLE ONLY public.message_assistant_client
    ADD CONSTRAINT message_assistant_client_pkey PRIMARY KEY (id_message);

ALTER TABLE ONLY public.messages_thematique
    ADD CONSTRAINT messages_thematique_pkey PRIMARY KEY (id_message);

ALTER TABLE ONLY public.notification_broadcast
    ADD CONSTRAINT notification_broadcast_pkey PRIMARY KEY (id_notification_broadcast);

ALTER TABLE ONLY public.qr_code_paiement_dynamique
    ADD CONSTRAINT qr_code_paiement_pkey PRIMARY KEY (id_qrcode);

ALTER TABLE ONLY public.qr_code_paiement_statique
    ADD CONSTRAINT qr_code_paiement_statique_pkey PRIMARY KEY (id_qrcode);

ALTER TABLE ONLY public.reclamations
    ADD CONSTRAINT reclamations_pkey PRIMARY KEY (id_reclamation);

ALTER TABLE ONLY public.thematiques
    ADD CONSTRAINT thematiques_pkey PRIMARY KEY (id_thematique_discussion);

ALTER TABLE ONLY public.transaction_externe
    ADD CONSTRAINT transaction_externe_pkey PRIMARY KEY (id_transaction_externe);

ALTER TABLE ONLY public.transaction_externe
    ADD CONSTRAINT transaction_externe_reference_externe_key UNIQUE (reference_externe);

ALTER TABLE ONLY public.transaction_interne
    ADD CONSTRAINT transaction_interne_pkey PRIMARY KEY (id_transaction);

ALTER TABLE ONLY public.transactions_bancaires
    ADD CONSTRAINT transactions_bancaires_pkey PRIMARY KEY (id_transaction);

ALTER TABLE ONLY public.transactions_frais
    ADD CONSTRAINT transactions_frais_pkey PRIMARY KEY (id_frais);

ALTER TABLE ONLY public.transactions_frais
    ADD CONSTRAINT unique_id_transaction UNIQUE (id_transaction);

ALTER TABLE ONLY public.user_etablissement_sante
    ADD CONSTRAINT user_etablissement_sante_email_key UNIQUE (email);

ALTER TABLE ONLY public.user_etablissement_sante
    ADD CONSTRAINT user_etablissement_sante_pkey PRIMARY KEY (id_user_etablissement_sante);

ALTER TABLE ONLY public.utilisateur
    ADD CONSTRAINT utilisateur_pkey PRIMARY KEY (id_user);

ALTER TABLE ONLY public.verification_kyc
    ADD CONSTRAINT verification_kyc_pkey PRIMARY KEY (id_kyc);

ALTER TABLE ONLY public.annonce
    ADD CONSTRAINT fk_annonce_admin_gestionnaire FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;

ALTER TABLE ONLY public.cartes_bancaires
    ADD CONSTRAINT fk_cartes_bancaires_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

ALTER TABLE ONLY public.cartes_physiques
    ADD CONSTRAINT fk_cartes_physiques_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

ALTER TABLE ONLY public.cartes_qr_code_statique
    ADD CONSTRAINT fk_cartes_qr_code_statique_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

ALTER TABLE ONLY public.code_verif_otp
    ADD CONSTRAINT fk_code_verif_otp_user_etablissement FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

ALTER TABLE ONLY public.code_verif_otp
    ADD CONSTRAINT fk_code_verif_otp_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

ALTER TABLE ONLY public.compte
    ADD CONSTRAINT fk_compte_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

ALTER TABLE ONLY public.compte
    ADD CONSTRAINT fk_compte_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

ALTER TABLE ONLY public.contacts_hostolink
    ADD CONSTRAINT fk_contacts_hostolink_contact FOREIGN KEY (id_contact_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

ALTER TABLE ONLY public.contacts_hostolink
    ADD CONSTRAINT fk_contacts_hostolink_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

ALTER TABLE ONLY public.discussion_assistant_client
    ADD CONSTRAINT fk_discussion_assistant_client_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

ALTER TABLE ONLY public.discussion_assistant_client
    ADD CONSTRAINT fk_discussion_assistant_client_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

ALTER TABLE ONLY public.expert_sante
    ADD CONSTRAINT fk_expert_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

ALTER TABLE ONLY public.historique_transactions
    ADD CONSTRAINT fk_historique_transactions_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

ALTER TABLE ONLY public.historique_transactions
    ADD CONSTRAINT fk_historique_transactions_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

ALTER TABLE ONLY public.images
    ADD CONSTRAINT fk_images_administrateurs FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;

ALTER TABLE ONLY public.images
    ADD CONSTRAINT fk_images_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

ALTER TABLE ONLY public.images
    ADD CONSTRAINT fk_images_users FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.journal_activites
    ADD CONSTRAINT fk_journal_activites_admin_gestionnaire FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;

ALTER TABLE ONLY public.liste_numero_vert_etablissement_sante
    ADD CONSTRAINT fk_liste_numero_vert_admin_gestionnaire FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;

ALTER TABLE ONLY public.message_assistant_client
    ADD CONSTRAINT fk_message_assistant_client_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

ALTER TABLE ONLY public.message_assistant_client
    ADD CONSTRAINT fk_message_assistant_client_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

ALTER TABLE ONLY public.messages_thematique
    ADD CONSTRAINT fk_message_thematique FOREIGN KEY (id_thematique_discussion) REFERENCES public.thematiques(id_thematique_discussion) ON DELETE CASCADE;

ALTER TABLE ONLY public.messages_thematique
    ADD CONSTRAINT fk_message_utilisateur FOREIGN KEY (id_expediteur) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

ALTER TABLE ONLY public.notification_broadcast
    ADD CONSTRAINT fk_notification_broadcast_admin_gestionnaire FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;

ALTER TABLE ONLY public.notification_broadcast
    ADD CONSTRAINT fk_notification_broadcast_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

ALTER TABLE ONLY public.notification_transaction
    ADD CONSTRAINT fk_notification_transaction_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

ALTER TABLE ONLY public.notification_transaction
    ADD CONSTRAINT fk_notification_transaction_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

ALTER TABLE ONLY public.partage
    ADD CONSTRAINT fk_partage_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

ALTER TABLE ONLY public.publication
    ADD CONSTRAINT fk_publication_admin_gestionnaire FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;

ALTER TABLE ONLY public.publication
    ADD CONSTRAINT fk_publication_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

ALTER TABLE ONLY public.publication
    ADD CONSTRAINT fk_publication_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

ALTER TABLE ONLY public.publicite
    ADD CONSTRAINT fk_publicite_admin_gestionnaire FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;

ALTER TABLE ONLY public.qr_code_paiement_dynamique
    ADD CONSTRAINT fk_qr_code_dynamique_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

ALTER TABLE ONLY public.qr_code_paiement_dynamique
    ADD CONSTRAINT fk_qr_code_paiement_dynamique_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

ALTER TABLE ONLY public.qr_code_paiement_statique
    ADD CONSTRAINT fk_qr_code_paiement_statique_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

ALTER TABLE ONLY public.qr_code_paiement_dynamique
    ADD CONSTRAINT fk_qr_code_paiement_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

ALTER TABLE ONLY public.qr_code_paiement_statique
    ADD CONSTRAINT fk_qr_code_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

ALTER TABLE ONLY public.reclamations
    ADD CONSTRAINT fk_reclamations_admin_gestionnaire FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;

ALTER TABLE ONLY public.reclamations
    ADD CONSTRAINT fk_reclamations_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

ALTER TABLE ONLY public.reclamations
    ADD CONSTRAINT fk_reclamations_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

ALTER TABLE ONLY public.thematiques
    ADD CONSTRAINT fk_thematiques_admin_gestionnaire FOREIGN KEY (id_admin_gestionnaire) REFERENCES public.administrateurs(id_admin_gestionnaire) ON DELETE CASCADE;

ALTER TABLE ONLY public.transaction_externe
    ADD CONSTRAINT fk_transaction_externe_moyen_paiement FOREIGN KEY (id_moyen_paiement) REFERENCES public.transactions_bancaires(id_transaction) ON DELETE CASCADE;

ALTER TABLE ONLY public.transaction_externe
    ADD CONSTRAINT fk_transaction_externe_transactions_frais FOREIGN KEY (id_transaction) REFERENCES public.transactions_frais(id_transaction) ON DELETE CASCADE;

ALTER TABLE ONLY public.transaction_interne
    ADD CONSTRAINT fk_transaction_interne_transactions_frais FOREIGN KEY (id_transaction) REFERENCES public.transactions_frais(id_transaction) ON DELETE CASCADE;

ALTER TABLE ONLY public.transaction_interne
    ADD CONSTRAINT fk_transaction_interne_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

ALTER TABLE ONLY public.transactions_bancaires
    ADD CONSTRAINT fk_transactions_bancaires_transactions_frais FOREIGN KEY (id_transaction) REFERENCES public.transactions_frais(id_transaction) ON DELETE CASCADE;

ALTER TABLE ONLY public.verification_kyc
    ADD CONSTRAINT fk_verification_kyc_user_etablissement_sante FOREIGN KEY (id_user_etablissement_sante) REFERENCES public.user_etablissement_sante(id_user_etablissement_sante) ON DELETE CASCADE;

ALTER TABLE ONLY public.verification_kyc
    ADD CONSTRAINT fk_verification_kyc_utilisateur FOREIGN KEY (id_user) REFERENCES public.utilisateur(id_user) ON DELETE CASCADE;

