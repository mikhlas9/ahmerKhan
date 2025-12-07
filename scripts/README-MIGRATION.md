# Migration Scripts

These scripts migrate the current static data to Firebase. Each section has its own script so you can migrate them separately or all at once.

## Setup

1. Make sure your `.env.local` file has your Firebase credentials
2. Install dependencies if needed: `npm install`

## Migration Scripts

### Homepage
```bash
node scripts/migrate-homepage.js
```
Migrates homepage content (name, title, bio, credentials, portrait image).

### Projects

#### Main Projects (2 projects)
```bash
node scripts/migrate-projects-main.js
```

#### Photo Stories (3 projects)
```bash
node scripts/migrate-projects-photo-stories.js
```

#### Films & Documentaries (3 projects)
```bash
node scripts/migrate-projects-films.js
```

#### Print & Digital Features (3 projects)
```bash
node scripts/migrate-projects-print-digital.js
```

#### Global Assignments (3 projects)
```bash
node scripts/migrate-projects-global-assignments.js
```

### Awards
```bash
node scripts/migrate-awards.js
```
Migrates 6 main awards and 3 recognition awards.

### Portraits
```bash
node scripts/migrate-portraits.js
```
Migrates 8 main portraits and 4 country projects.

### Tearsheets
```bash
node scripts/migrate-tearsheets.js
```
Migrates 9 tearsheets.

### Contact
```bash
node scripts/migrate-contact.js
```
Migrates contact information (email, phone, location, EmailJS configuration).

## Migrate All at Once

You can run all scripts in sequence:

```bash
# Homepage
node scripts/migrate-homepage.js

# Projects
node scripts/migrate-projects-main.js && \
node scripts/migrate-projects-photo-stories.js && \
node scripts/migrate-projects-films.js && \
node scripts/migrate-projects-print-digital.js && \
node scripts/migrate-projects-global-assignments.js

# Awards
node scripts/migrate-awards.js

# Portraits
node scripts/migrate-portraits.js

# Tearsheets
node scripts/migrate-tearsheets.js

# Contact
node scripts/migrate-contact.js
```

## For New Firebase Instance

When the client provides their own Firebase config:

1. Update `.env.local` with their Firebase credentials
2. Run all migration scripts
3. All current static data will be migrated to their Firebase

## Admin User Setup

Before accessing the admin panel, you need to create an admin user:

```bash
node scripts/setup-admin-user.js
```

This will prompt you for:
- Admin email address
- Admin password (minimum 6 characters)

After creating the user, you can log in at `/login` with these credentials.

**Note:** If the email already exists, you can use it to log in directly.

## Notes

- Each project has an `order` field to control display sequence
- Projects alternate left/right layout based on their index (order)
- Main projects page: Fixed layout (not alternating)
- Category pages: Alternating layout (left/right based on index)
- Awards are separated into "award" and "recognition" types
- Portraits are separated into "portrait" and "country-project" types
- All admin pages require authentication - users will be redirected to `/login` if not authenticated
- Awards are separated into "award" and "recognition" types
- Portraits are separated into "portrait" and "country-project" types

