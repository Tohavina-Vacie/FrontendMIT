import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./assets/Components/ProtectedRoute";

import Navbar from "./assets/Components/Navbar/Navbar";
import Footer from "./assets/Components/Inscription_utilisateur/Footer";
import Ecole from "./assets/Components/Ecole/Ecole";
import Formations from "./assets/Components/Formations/Formations";
import Alternance from "./assets/Components/Alternance/Alternance";
import Entreprises from "./assets/Components/Entreprises/Entreprises";
import Documentation from "./assets/Components/Documentation/Documentation";
import Home from "./assets/Components/Accueil/Home";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profil from "./Pages/Profil";
import FormationsListe from "./Pages/FormationsListe";
import FormationDetail from "./Pages/FormationDetail";
import EntreprisesListe from "./Pages/EntreprisesListe";
import MesInscriptions from "./Pages/MesInscriptions";

import AdminAccueil from "./Pages/admin/AdminAccueil";
import Etudiants from "./Pages/admin/Etudiants";
import Enseignants from "./Pages/admin/Enseignants";
import StagesAdmin from "./Pages/admin/StagesAdmin";
import Utilisateurs from "./Pages/admin/Utilisateurs";
import FormationsAdmin from "./Pages/admin/FormationsAdmin";
import InscriptionsAdmin from "./Pages/admin/InscriptionsAdmin";
import EntreprisesAdmin from "./Pages/admin/EntreprisesAdmin";

import DashboardLayout, { MENU_ADMIN, MENU_SUPER } from "./Pages/etudiant/DashboardLayout";
import Accueil from "./Pages/etudiant/Accueil";
import ProfilEtudiant from "./Pages/etudiant/ProfilEtudiant";
import Parametres from "./Pages/etudiant/Parametres";
import SectionVide from "./Pages/etudiant/SectionVide";
import SuperAccueil from "./Pages/superadmin/SuperAccueil";
import AdministrateursSuper from "./Pages/superadmin/AdministrateursSuper";
import Roles from "./Pages/superadmin/Roles";
import MesCours from "./Pages/etudiant/MesCours";
import MonEmploiDuTemps from "./Pages/etudiant/MonEmploiDuTemps";
import MesNotes from "./Pages/etudiant/MesNotes";
import MesDocuments from "./Pages/etudiant/MesDocuments";
import MonAlternance from "./Pages/etudiant/MonAlternance";
import MesPaiements from "./Pages/etudiant/MesPaiements";
import MesAbsences from "./Pages/etudiant/MesAbsences";
import AbsencesAdmin from "./Pages/admin/AbsencesAdmin";
import Contact from "./Pages/Contact";
import MessagesAdmin from "./Pages/admin/MessagesAdmin";
import AlternanceAdmin from "./Pages/admin/AlternanceAdmin";
import CoursAdmin from "./Pages/admin/CoursAdmin";
import EmploiDuTempsAdmin from "./Pages/admin/EmploiDuTempsAdmin";
import NotesAdmin from "./Pages/admin/NotesAdmin";
import DocumentsAdmin from "./Pages/admin/DocumentsAdmin";
import Finances from "./Pages/admin/Finances";

// Espaces avec leur propre mise en page (sans Navbar ni Footer)
const ESPACES = ["/etudiant", "/admin", "/super-admin"];

const ADMINS = ["admin", "super_admin"];

export default function App() {
  const { pathname } = useLocation();
  const dansDashboard = ESPACES.some((e) => pathname === e || pathname.startsWith(`${e}/`));

  return (
    <AuthProvider>
      {!dansDashboard && <Navbar />}

      <Routes>
        {/* Site public */}
        <Route path="/" element={<Home />} />
        <Route path="/ecole" element={<Ecole />} />
        <Route path="/formations" element={<Formations />} />
        <Route path="/catalogue" element={<FormationsListe />} />
        <Route path="/catalogue/:id" element={<FormationDetail />} />
        <Route path="/alternance" element={<Alternance />} />
        <Route path="/entreprises" element={<Entreprises />} />
        <Route path="/partenaires" element={<EntreprisesListe />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Register />} />
        <Route path="/contact" element={<Contact />} />

        {/* Comptes connectés */}
        <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
        <Route
          path="/mes-inscriptions"
          element={<ProtectedRoute roles={["etudiant"]}><MesInscriptions /></ProtectedRoute>}
        />

        {/* Dashboard étudiant */}
        <Route
          path="/etudiant"
          element={<ProtectedRoute roles={["etudiant"]}><DashboardLayout /></ProtectedRoute>}
        >
          <Route index element={<Accueil />} />
          <Route path="profil" element={<ProfilEtudiant />} />
          <Route path="cours" element={<MesCours />} />
          <Route path="emploi-du-temps" element={<MonEmploiDuTemps />} />
          <Route path="notes" element={<MesNotes />} />
          <Route path="absences" element={<MesAbsences />} />
          <Route path="documents" element={<MesDocuments />} />
          <Route path="alternance" element={<MonAlternance />} />
          <Route path="paiements" element={<MesPaiements />} />
          <Route path="messagerie" element={<SectionVide icone="message" titre="Messagerie" description="Vos conversations." />} />
          <Route path="parametres" element={<Parametres />} />
        </Route>

        {/* Dashboard super admin */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute roles={["super_admin"]}>
              <DashboardLayout menu={MENU_SUPER} libelle="Super administrateur" sousLogo="SYSTEM SUPERADMIN" mode="Super-admin root" recherche="Rechercher dans les logs, configurations…" />
            </ProtectedRoute>
          }
        >
          <Route index element={<SuperAccueil />} />
          <Route path="administrateurs" element={<AdministrateursSuper />} />
          <Route path="roles" element={<Roles />} />
          <Route path="etablissements" element={<SectionVide icone="briefcase" titre="Établissements" description="Gestion des établissements." message="Cette section sera disponible dès que ses routes super admin seront reliées." />} />
          <Route path="configuration" element={<SectionVide icone="settings" titre="Configuration système" description="Options globales de la plateforme." message="Cette section sera disponible dès que ses routes super admin seront reliées." />} />
          <Route path="logs" element={<SectionVide icone="clipboard" titre="Logs" description="Journal des actions et des connexions." message="Cette section sera disponible dès que ses routes super admin seront reliées." />} />
          <Route path="securite" element={<SectionVide icone="shield" titre="Sécurité globale" description="Sessions actives et tentatives de connexion." message="Cette section sera disponible dès que ses routes super admin seront reliées." />} />
          <Route path="base-de-donnees" element={<SectionVide icone="database" titre="Base de données" description="État et sauvegardes de la base." message="Cette section sera disponible dès que ses routes super admin seront reliées." />} />
          <Route path="api" element={<SectionVide icone="code" titre="API" description="Clés d'accès et suivi des requêtes." message="Cette section sera disponible dès que ses routes super admin seront reliées." />} />
          <Route path="maintenance" element={<SectionVide icone="tool" titre="Maintenance" description="Mode maintenance et opérations système." message="Cette section sera disponible dès que ses routes super admin seront reliées." />} />
          <Route path="parametres" element={<SectionVide icone="sliders" titre="Paramètres avancés" description="Réglages techniques de la plateforme." message="Cette section sera disponible dès que ses routes super admin seront reliées." />} />
        </Route>

        {/* Dashboard admin et super admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={ADMINS}>
              <DashboardLayout menu={MENU_ADMIN} libelle="Scolarité MIT" sousLogo="ADMIN MADAGASCAR" mode="Mode admin" recherche="Rechercher…" />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminAccueil />} />
          <Route path="etudiants" element={<Etudiants />} />
          <Route path="enseignants" element={<Enseignants />} />
          <Route path="formations" element={<FormationsAdmin />} />
          <Route path="cours" element={<CoursAdmin />} />
          <Route path="inscriptions" element={<InscriptionsAdmin />} />
          <Route path="emploi-du-temps" element={<EmploiDuTempsAdmin />} />
          <Route path="notes" element={<NotesAdmin />} />
          <Route path="absences" element={<AbsencesAdmin />} />
          <Route path="documents" element={<DocumentsAdmin />} />
          <Route path="stages" element={<StagesAdmin />} />
          <Route path="alternance" element={<AlternanceAdmin />} />
          <Route path="finances" element={<Finances />} />
          <Route path="messages" element={<MessagesAdmin />} />
          <Route path="rapports" element={<SectionVide icone="chart" titre="Rapports" description="Statistiques et rapports de l'établissement." />} />
          <Route path="parametres" element={<Parametres />} />
          <Route path="utilisateurs" element={<Utilisateurs />} />
          <Route path="entreprises" element={<EntreprisesAdmin />} />
        </Route>
      </Routes>

      {!dansDashboard && <Footer />}
    </AuthProvider>
  );
}
