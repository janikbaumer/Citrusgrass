import type { TranslationKey } from "./en";

// German translation dictionary. Typed as Record<TranslationKey, string> so
// TypeScript enforces exact key parity with en.ts in both directions.
const de: Record<TranslationKey, string> = {
  "common.loading": "Lädt...",
  "common.somethingWrong": "Etwas ist schiefgelaufen.",
  "common.save": "Speichern",
  "common.saving": "Wird gespeichert...",
  "common.saved": "Gespeichert.",
  "common.propertyNotFound": "Immobilie nicht gefunden.",
  "common.notYourProperty": "Das ist nicht deine Immobilie.",
  "common.listingUnavailable": "Dieses Inserat wurde vom Vermieter entfernt",
  "common.logIn": "Anmelden",
  "common.welcome": "Willkommen,",
  "common.menu": "Menü",
  "common.cancel": "Abbrechen",
  "common.readMore": "Mehr erfahren",

  "field.firstName": "Vorname",
  "field.lastName": "Nachname",
  "field.email": "E-Mail",
  "field.phone": "Telefon",
  "field.password": "Passwort",

  "property.street": "Strasse (+ Hausnummer)",
  "property.zip": "PLZ",
  "property.city": "Ort",
  "property.rooms": "Zimmer",
  "property.size": "Fläche (m²)",
  "property.rent": "Miete (CHF/Monat)",
  "property.additionalCosts": "Nebenkosten (CHF/Monat)",
  "property.availableFrom": "Verfügbar ab",
  "property.description": "Beschreibung",
  "property.optional": "(optional)",

  "roles.homeowner": "Vermieter",
  "roles.renter": "Mieter",

  "profile.changePhoto": "Foto ändern",
  "profile.removePhoto": "Foto entfernen",
  "profile.completion": "{percent}% vollständig",
  "profile.photoTooLarge": "Das Bild muss kleiner als 5 MB sein.",
  "profile.photoInvalidType": "Bitte wähle eine Bilddatei aus.",
  "profile.documentTooLarge": "Die Datei muss kleiner als 10 MB sein.",
  "profile.documentInvalidType": "Bitte wähle eine PDF- oder Bilddatei aus.",

  "publicHeader.brand": "Citrusgrass",
  "publicHeader.about": "Über uns",
  "publicHeader.faq": "FAQ",
  "publicHeader.contact": "Kontakt",

  "roleNav.dashboard": "Übersicht",
  "roleNav.profile": "Profil",
  "roleNav.applications": "Bewerbungen",
  "roleNav.properties": "Immobilien",
  "roleNav.settings": "Einstellungen",
  "roleNav.signOut": "Abmelden",

  "languageSwitcher.english": "EN",
  "languageSwitcher.german": "DE",

  "home.title": "Willkommen bei Citrusgrass",
  "home.valueProp":
    "Der vollständig automatisierte Weg, Mietbewerbungen zu verwalten - für Vermieter und Mieter.",
  "home.subtitle": "Um loszulegen, sag uns, wer du bist.",
  "home.homeownerCardTitle": "Ich bin Vermieter",
  "home.homeownerCardSubtitle": "Verwalte und inseriere deine Immobilie",
  "home.renterCardTitle": "Ich bin Mieter",
  "home.renterCardSubtitle": "Finde ein Zuhause",
  "home.haveAccount": "Schon ein Konto?",

  "landing.benefitsTitle": "Warum Citrusgrass",
  "landing.benefit1Title": "Nur auf Einladung, keine öffentlichen Inserate",
  "landing.benefit1Description":
    "Mieter sehen eine Immobilie erst, wenn du einen direkten Bewerbungslink teilst - es gibt keine öffentliche Suche zum Durchstöbern.",
  "landing.benefit2Title": "Bewerbung mit einem Klick",
  "landing.benefit2Description":
    "Mieter bewerben sich mit ihrem gespeicherten Profil - kein erneutes Ausfüllen für jedes Inserat.",
  "landing.benefit3Title": "Jede Bewerbung im Blick",
  "landing.benefit3Description":
    "Beide Seiten verfolgen denselben Status - von eingegangen bis angenommen.",
  "landing.howItWorksTitle": "So funktioniert's",
  "landing.homeownerStepsTitle": "Für Vermieter",
  "landing.homeownerStep1": "Füge deine Immobilie mit Adresse, Miete und Details hinzu.",
  "landing.homeownerStep2": "Teile deinen persönlichen Bewerbungslink mit allen, die sich bewerben sollen.",
  "landing.homeownerStep3": "Prüfe Bewerber und verfolge sie auf deiner Pipeline.",
  "landing.renterStepsTitle": "Für Mieter",
  "landing.renterStep1": "Erhalte einen Bewerbungslink von einem Vermieter.",
  "landing.renterStep2": "Bewirb dich mit deinem gespeicherten Profil - ohne erneutes Ausfüllen.",
  "landing.renterStep3": "Verfolge genau, wo deine Bewerbung steht.",
  "landing.getInTouch": "Kontakt aufnehmen",
  "landing.partnersTitle": "Vermieter auf Citrusgrass",
  "landing.partnersSubtitle":
    "Wir stehen noch am Anfang - hier werden bald Vermieter-Partner vorgestellt.",

  "login.title": "Anmelden",
  "login.googleSignIn": "Mit Google anmelden",
  "login.or": "oder",
  "login.submitting": "Wird angemeldet...",
  "login.noAccount": "Noch kein Konto?",
  "login.signUp": "Registrieren",
  "login.forgotPassword": "Passwort vergessen?",
  "login.enterEmailFirst": "Bitte gib zuerst deine E-Mail-Adresse oben ein.",
  "login.resetEmailSent": "E-Mail zum Zurücksetzen des Passworts gesendet - bitte prüfe dein Postfach.",

  "register.whichAreYou": "Was bist du?",
  "register.pickRoleFirst": "Wähle zuerst eine Rolle, damit wir dein Konto richtig einrichten können.",
  "register.chooseRole": "Vermieter oder Mieter wählen",
  "register.title": "Erstelle dein {role}-Konto",
  "register.notRole": "Kein {role}?",
  "register.switch": "Wechseln",
  "register.googleSignUp": "Mit Google registrieren",
  "register.submitting": "Konto wird erstellt...",
  "register.submit": "Konto erstellen",
  "register.haveAccount": "Schon ein Konto?",

  "onboarding.title": "Noch ein Schritt",
  "onboarding.subtitle": "Bist du hier als Vermieter oder als Mieter?",
  "onboarding.homeowner": "Ich bin Vermieter",
  "onboarding.renter": "Ich bin Mieter",

  "homeownerDashboard.subtitle": "Deine Vermieter-Übersicht.",
  "homeownerDashboard.moreComing": "Mehr folgt in Kürze.",

  "homeownerProfile.landlordType": "Vermietertyp",
  "homeownerProfile.private": "Privat",
  "homeownerProfile.company": "Firma",

  "homeownerProperties.title": "Deine Immobilien",
  "homeownerProperties.addProperty": "Immobilie hinzufügen",
  "homeownerProperties.empty": "Du hast noch keine Immobilie hinzugefügt.",
  "homeownerProperties.addFirstOne": "Füge deine erste hinzu",

  "homeownerPropertiesNew.title": "Immobilie hinzufügen",
  "homeownerPropertiesNew.submitting": "Wird hinzugefügt...",
  "homeownerPropertiesNew.submit": "Immobilie hinzufügen",

  "homeownerPropertyEdit.title": "Immobilie bearbeiten",
  "homeownerPropertyEdit.submit": "Änderungen speichern",

  "homeownerPropertyDetail.linkCopied": "Link kopiert!",
  "homeownerPropertyDetail.copyApplyLink": "Bewerbungslink kopieren",
  "homeownerPropertyDetail.edit": "Bearbeiten",
  "homeownerPropertyDetail.deleting": "Wird gelöscht...",
  "homeownerPropertyDetail.delete": "Löschen",
  "homeownerPropertyDetail.confirmAccept":
    "Wenn du diese Bewerbung annimmst, werden automatisch alle anderen Bewerbungen für diese Immobilie abgelehnt. Fortfahren?",
  "homeownerPropertyDetail.confirmDelete":
    "Diese Immobilie löschen? Der Bewerbungslink funktioniert danach nicht mehr. Bestehende Bewerbungen werden nicht gelöscht, zeigen aber kein passendes Inserat mehr an. Dies kann nicht rückgängig gemacht werden.",
  "homeownerPropertyDetail.confirmAcceptButton": "Bewerber akzeptieren",

  "renterDashboard.subtitle": "Hier siehst du den Stand deiner Bewerbungen.",

  "applications.empty":
    "Du hast dich noch nirgends beworben. Bewerbungen, die du über den Bewerbungslink eines Vermieters einreichst, erscheinen hier.",

  "renterProfile.personalInfoTitle": "Persönliche Angaben",
  "renterProfile.aboutMeTitle": "Über mich",
  "renterProfile.documentsTitle": "Relevante Dokumente",
  "renterProfile.salaryRange": "Gehaltsbereich",
  "renterProfile.selectRange": "Bereich auswählen",
  "renterProfile.about": "Über dich",
  "renterProfile.jobTitle": "Berufsbezeichnung",
  "renterProfile.debtRegisterLabel": "Betreibungsregisterauszug",
  "renterProfile.idDocumentLabel": "Kopie von Ausweis oder Aufenthaltsbewilligung",
  "renterProfile.salaryStatementLabel": "Lohnausweis",
  "renterProfile.uploadDocument": "Dokument hochladen",
  "renterProfile.replaceDocument": "Ersetzen",
  "renterProfile.removeDocument": "Entfernen",

  "salaryRange.under30k": "Unter $30'000",
  "salaryRange.30to50k": "$30'000 - $50'000",
  "salaryRange.50to75k": "$50'000 - $75'000",
  "salaryRange.75to100k": "$75'000 - $100'000",
  "salaryRange.100to150k": "$100'000 - $150'000",
  "salaryRange.over150k": "$150'000+",
  "salaryRange.preferNotToSay": "Keine Angabe",

  "renterListings.title": "Deine Bewerbungen",
  "renterListings.status": "Status:",

  "apply.notFound": "Dieses Inserat wurde nicht gefunden.",
  "apply.logInPrompt": "Melde dich an oder erstelle ein Mieterkonto, um dich zu bewerben.",
  "apply.signUpAsRenter": "Als Mieter registrieren",
  "apply.finishSetup": "Schliesse die Einrichtung deines Kontos ab, um dich zu bewerben.",
  "apply.continue": "Weiter",
  "apply.wrongRole":
    "Du bist als Vermieter angemeldet. Melde dich mit einem Mieterkonto an, um dich zu bewerben.",
  "apply.logOut": "Abmelden",
  "apply.checkingStatus": "Bewerbungsstatus wird geprüft...",
  "apply.applyUsingProfile": "Bewirb dich mit deinem bestehenden Mieterprofil ({name}).",
  "apply.submitting": "Bewerbung wird gesendet...",
  "apply.submit": "Jetzt bewerben",
  "apply.alreadyApplied": "Du hast dich bereits beworben. Status:",

  "about.title": "Über uns",
  "about.p1":
    "Citrusgrass verbindet Vermieter, die eine Immobilie vermieten, mit Mietern, die eine suchen — ohne daraus einen öffentlichen Marktplatz mit Inseraten zu machen.",
  "about.p2":
    "Ein Mieter sieht eine Immobilie erst, nachdem ein Vermieter einen direkten Bewerbungslink dafür geteilt hat. Es gibt keine durchsuchbare Übersicht über alle Vermieter, daher beginnt eine Bewerbung immer mit einer konkreten Einladung statt mit offenem Stöbern.",
  "about.p3":
    "Sobald sich jemand beworben hat, können beide Seiten den Stand der Bewerbung verfolgen — von eingegangen über geprüft bis zur Entscheidung — auf einer gemeinsamen Statusübersicht.",

  "contact.title": "Kontakt",
  "contact.intro": "Fragen, Feedback oder funktioniert etwas nicht wie erwartet? Schreib uns an",

  "faq.title": "Häufig gestellte Fragen",
  "faq.q1": "Wie bewerbe ich mich für eine Immobilie?",
  "faq.a1":
    "Du brauchst einen direkten Bewerbungslink vom Vermieter, der die Immobilie inseriert. Öffne den Link, registriere dich oder melde dich an und reiche deine Bewerbung von dort aus ein.",
  "faq.q2": "Warum kann ich verfügbare Immobilien nicht suchen oder durchstöbern?",
  "faq.a2":
    "Citrusgrass funktioniert bewusst auf Einladungsbasis — du startest immer über den Bewerbungslink eines bestimmten Vermieters statt über einen offenen Marktplatz, daher gibt es keine öffentliche Suche oder Inseratsübersicht zum Durchstöbern.",
  "faq.q3": "Was passiert, nachdem ich mich beworben habe?",
  "faq.a3":
    "Der Vermieter sieht deine Bewerbung auf seiner Pipeline-Übersicht und bewegt sie durch die einzelnen Phasen, während er sie prüft. Du kannst denselben Status auf deiner eigenen Übersicht mitverfolgen.",
  "faq.q4": "Ich bin Vermieter — wie inseriere ich eine Immobilie?",
  "faq.a4":
    "Registriere dich als Vermieter, füge deine Immobilie über deine Übersicht hinzu und teile den generierten Bewerbungslink mit allen, die sich bewerben können sollen.",

  "settings.title": "Einstellungen",

  "changePassword.title": "Passwort ändern",
  "changePassword.googleAccount":
    "Du hast dich mit Google angemeldet, daher gibt es hier kein Passwort zu ändern.",
  "changePassword.currentPassword": "Aktuelles Passwort",
  "changePassword.newPassword": "Neues Passwort",
  "changePassword.confirmPassword": "Neues Passwort bestätigen",
  "changePassword.mismatchError": "Die neuen Passwörter stimmen nicht überein.",
  "changePassword.submit": "Passwort ändern",

  "deleteAccount.title": "Konto löschen",
  "deleteAccount.warningHomeowner":
    "Dies löscht dein Konto, alle deine inserierten Immobilien und alle dafür eingereichten Bewerbungen dauerhaft.",
  "deleteAccount.warningRenter": "Dies löscht dein Konto und alle deine eingereichten Bewerbungen dauerhaft.",
  "deleteAccount.cannotBeUndone": "Dies kann nicht rückgängig gemacht werden.",
  "deleteAccount.typeToConfirm": "Gib DELETE ein, um zu bestätigen",
  "deleteAccount.confirmPassword": "Bestätige dein Passwort, um fortzufahren",
  "deleteAccount.enterPasswordError": "Gib dein Passwort ein, um zu bestätigen.",
  "deleteAccount.confirmGoogleIdentity": "Klicke erneut auf Löschen, um deine Identität mit Google zu bestätigen.",
  "deleteAccount.deleting": "Wird gelöscht...",
  "deleteAccount.submit": "Mein Konto endgültig löschen",

  "pipeline.viewingRequested": "Besichtigung angefragt",
  "pipeline.applicationReceived": "Bewerbung eingegangen",
  "pipeline.underReview": "In Prüfung",
  "pipeline.accepted": "Angenommen",
  "pipeline.declined": "Abgelehnt",
  "pipeline.applicationSent": "Bewerbung gesendet",

  "pipelineBoard.salary": "Gehalt:",
  "pipelineBoard.debtRegisterAvailable": "Betreibungsregisterauszug verfügbar",
  "pipelineBoard.idDocumentAvailable": "Kopie von Ausweis oder Aufenthaltsbewilligung verfügbar",
  "pipelineBoard.salaryStatementAvailable": "Lohnausweis verfügbar",
  "pipelineBoard.noApplicants": "Keine Bewerber.",

  "renterPipelineBoard.nothingHere": "Nichts hier.",

  "footer.tagline":
    "Verbindet Vermieter und Mieter durch einen vollständig automatisierten Bewerbungsprozess.",
  "footer.copyright": "© {year} Citrusgrass. Alle Rechte vorbehalten.",
};

export default de;
