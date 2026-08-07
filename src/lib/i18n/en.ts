// English translation dictionary. `de.ts` is type-checked against the keys
// exported here (via TranslationKey), so a missing/extra key in either file
// is a compile error rather than a silent runtime gap.
const en = {
  // Shared across multiple pages.
  "common.loading": "Loading...",
  "common.somethingWrong": "Something went wrong.",
  "common.save": "Save",
  "common.saving": "Saving...",
  "common.saved": "Saved.",
  "common.propertyNotFound": "Property not found.",
  "common.notYourProperty": "This isn't your property.",
  "common.listingUnavailable": "Listing no longer available",
  "common.logIn": "Log in",
  "common.welcome": "Welcome,",

  // Shared form field labels (register, homeowner profile, renter profile).
  "field.firstName": "First name",
  "field.lastName": "Last name",
  "field.email": "Email",
  "field.phone": "Phone",
  "field.password": "Password",

  // Shared property form fields (add + edit property).
  "property.street": "Street (+ house number)",
  "property.zip": "PLZ (zip code)",
  "property.city": "City",
  "property.rooms": "Rooms",
  "property.size": "Size (m²)",
  "property.rent": "Rent (CHF/month)",
  "property.additionalCosts": "Additional costs (Nebenkosten, CHF/month)",
  "property.availableFrom": "Available from",
  "property.description": "Description",
  "property.optional": "(optional)",

  // The word for each role, used to build sentences like "Create your {role} account".
  "roles.homeowner": "homeowner",
  "roles.renter": "renter",

  // src/components/PublicHeader.tsx
  "publicHeader.brand": "Citrusgrass",
  "publicHeader.about": "About us",
  "publicHeader.faq": "FAQ",
  "publicHeader.contact": "Contact",

  // src/components/RoleNav.tsx
  "roleNav.dashboard": "Dashboard",
  "roleNav.profile": "Profile",
  "roleNav.applications": "Applications",
  "roleNav.properties": "Properties",
  "roleNav.signOut": "Sign out",

  // Language switcher (PublicHeader + RoleNav).
  "languageSwitcher.english": "EN",
  "languageSwitcher.german": "DE",

  // src/app/page.tsx
  "home.title": "Welcome to Citrusgrass",
  "home.subtitle": "To get started, tell us who you are.",
  "home.homeownerCardTitle": "I'm a Homeowner",
  "home.homeownerCardSubtitle": "List and manage your property",
  "home.renterCardTitle": "I'm a Renter",
  "home.renterCardSubtitle": "Find a place to call home",
  "home.haveAccount": "Already have an account?",

  // src/app/login/page.tsx
  "login.title": "Log in",
  "login.googleSignIn": "Sign in with Google",
  "login.or": "or",
  "login.submitting": "Logging in...",
  "login.noAccount": "Don't have an account?",
  "login.signUp": "Sign up",

  // src/app/register/page.tsx
  "register.whichAreYou": "Which are you?",
  "register.pickRoleFirst": "Pick a role first so we can set up your account correctly.",
  "register.chooseRole": "Choose homeowner or renter",
  "register.title": "Create your {role} account",
  "register.notRole": "Not a {role}?",
  "register.switch": "Switch",
  "register.googleSignUp": "Sign up with Google",
  "register.submitting": "Creating account...",
  "register.submit": "Create account",
  "register.haveAccount": "Already have an account?",

  // src/app/onboarding/page.tsx
  "onboarding.title": "One more step",
  "onboarding.subtitle": "Are you here as a homeowner or a renter?",
  "onboarding.homeowner": "I'm a Homeowner",
  "onboarding.renter": "I'm a Renter",

  // src/app/homeowner/dashboard/page.tsx
  "homeownerDashboard.subtitle": "Your homeowner dashboard.",
  "homeownerDashboard.moreComing": "More coming soon.",

  // src/app/homeowner/profile/page.tsx
  "homeownerProfile.title": "Homeowner Profile",
  "homeownerProfile.landlordType": "Landlord type",
  "homeownerProfile.private": "Private",
  "homeownerProfile.company": "Company",

  // src/app/homeowner/properties/page.tsx
  "homeownerProperties.title": "Your Properties",
  "homeownerProperties.addProperty": "Add property",
  "homeownerProperties.empty": "You haven't added a property yet.",
  "homeownerProperties.addFirstOne": "Add your first one",

  // src/app/homeowner/properties/new/page.tsx
  "homeownerPropertiesNew.title": "Add a property",
  "homeownerPropertiesNew.submitting": "Adding...",
  "homeownerPropertiesNew.submit": "Add property",

  // src/app/homeowner/properties/[id]/edit/EditPropertyClient.tsx
  "homeownerPropertyEdit.title": "Edit property",
  "homeownerPropertyEdit.submit": "Save changes",

  // src/app/homeowner/properties/[id]/PropertyPipelineClient.tsx
  "homeownerPropertyDetail.linkCopied": "Link copied!",
  "homeownerPropertyDetail.copyApplyLink": "Copy apply link",
  "homeownerPropertyDetail.edit": "Edit",
  "homeownerPropertyDetail.deleting": "Deleting...",
  "homeownerPropertyDetail.delete": "Delete",
  "homeownerPropertyDetail.confirmAccept":
    "Accepting this applicant will automatically decline every other applicant for this property. Continue?",
  "homeownerPropertyDetail.confirmDelete":
    "Delete this property? Its apply link will stop working. Existing applications aren't deleted, but they'll no longer show a matching listing. This can't be undone.",

  // src/app/renter/dashboard/page.tsx
  "renterDashboard.subtitle": "Here's where your applications stand.",

  // Shared between renter dashboard + renter listings (identical empty state).
  "applications.empty":
    "You haven't applied to anything yet. Applications you submit via a landlord's apply link will show up here.",

  // src/app/renter/profile/page.tsx
  "renterProfile.title": "Rental Profile",
  "renterProfile.salaryRange": "Salary range",
  "renterProfile.selectRange": "Select a range",
  "renterProfile.about": "About you",

  // Salary range option labels. The stored Firestore *value* stays the
  // original English string for backwards compatibility with existing
  // renter profiles — only the displayed label is translated.
  "salaryRange.under30k": "Under $30,000",
  "salaryRange.30to50k": "$30,000 - $50,000",
  "salaryRange.50to75k": "$50,000 - $75,000",
  "salaryRange.75to100k": "$75,000 - $100,000",
  "salaryRange.100to150k": "$100,000 - $150,000",
  "salaryRange.over150k": "$150,000+",
  "salaryRange.preferNotToSay": "Prefer not to say",

  // src/app/renter/listings/page.tsx
  "renterListings.title": "Your Applications",
  "renterListings.status": "Status:",

  // src/app/apply/[propertyId]/ApplyPageClient.tsx
  "apply.notFound": "This listing wasn't found.",
  "apply.logInPrompt": "Log in or create a renter account to apply.",
  "apply.signUpAsRenter": "Sign up as a renter",
  "apply.finishSetup": "Finish setting up your account to apply.",
  "apply.continue": "Continue",
  "apply.wrongRole": "You're signed in as a homeowner. Log in with a renter account to apply.",
  "apply.logOut": "Log out",
  "apply.checkingStatus": "Checking your application status...",
  "apply.applyUsingProfile": "Apply using your existing renter profile ({name}).",
  "apply.submitting": "Applying...",
  "apply.submit": "Apply now",
  "apply.alreadyApplied": "You already applied. Status:",

  // src/app/about/page.tsx
  "about.title": "About us",
  "about.p1":
    "Citrusgrass connects homeowners renting out a property with renters looking for one — without turning it into a public listings marketplace.",
  "about.p2":
    "A renter only ever sees a property after a homeowner shares a direct apply link for it. There's no browsable search across landlords, so applying always starts from a specific invitation rather than open shopping.",
  "about.p3":
    "Once someone applies, both sides can track where that application stands — from received, to reviewed, to a decision — on a shared status board.",

  // src/app/contact/page.tsx
  "contact.title": "Contact",
  "contact.intro": "Questions, feedback, or something not working as expected? Reach out at",

  // src/app/faq/page.tsx
  "faq.title": "Frequently asked questions",
  "faq.q1": "How do I apply for a property?",
  "faq.a1":
    "You need a direct apply link from the homeowner listing it. Open that link, sign up or log in, and submit your application from there.",
  "faq.q2": "Why can't I search or browse available properties?",
  "faq.a2":
    "Citrusgrass is invite-based by design — you always start from a specific homeowner's apply link rather than an open marketplace, so there's no public search or listing index to browse.",
  "faq.q3": "What happens after I apply?",
  "faq.a3":
    "The homeowner sees your application on their pipeline board and moves it through stages as they review it. You can follow the same status from your own dashboard.",
  "faq.q4": "I'm a homeowner — how do I list a property?",
  "faq.a4":
    "Sign up as a homeowner, add your property from your dashboard, and share the apply link it generates with whoever you want to be able to apply.",

  // src/components/DeleteAccountSection.tsx
  "deleteAccount.title": "Delete account",
  "deleteAccount.warningHomeowner":
    "This permanently deletes your account, every property you've listed, and every application submitted to them.",
  "deleteAccount.warningRenter":
    "This permanently deletes your account and every application you've submitted.",
  "deleteAccount.cannotBeUndone": "This can't be undone.",
  "deleteAccount.typeToConfirm": "Type DELETE to confirm",
  "deleteAccount.confirmPassword": "Confirm your password to continue",
  "deleteAccount.enterPasswordError": "Enter your password to confirm.",
  "deleteAccount.confirmGoogleIdentity": "Click delete again to confirm your identity with Google.",
  "deleteAccount.deleting": "Deleting...",
  "deleteAccount.submit": "Delete my account permanently",

  // Pipeline status labels, shown to homeowners.
  "pipeline.viewingRequested": "Viewing requested",
  "pipeline.invitedToViewing": "Invited to viewing",
  "pipeline.applicationReceived": "Application received",
  "pipeline.underReview": "Under review",
  "pipeline.accepted": "Accepted",
  "pipeline.declined": "Declined",
  // Renter-facing override for the same "application_received" status.
  "pipeline.applicationSent": "Application sent",

  // src/components/PipelineBoard.tsx (homeowner-facing)
  "pipelineBoard.salary": "Salary:",
  "pipelineBoard.noApplicants": "No applicants.",

  // src/components/RenterPipelineBoard.tsx
  "renterPipelineBoard.nothingHere": "Nothing here.",
} as const;

export type TranslationKey = keyof typeof en;

export default en;
