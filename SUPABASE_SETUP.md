# Supabase Setup Instructions

This application now uses Supabase for data persistence and authentication.

## Database Setup

You need to run the migration SQL to set up the database tables. Follow these steps:

1. Go to your Supabase project dashboard at https://0ec90b57d6e95fcbda19832f.supabase.co

2. Navigate to the SQL Editor (in the left sidebar)

3. Copy the contents of the file `supabase_migration.sql` and paste it into the SQL editor

4. Click "Run" to execute the migration

This will create the following tables:
- `categories` - Store product categories
- `gst_rates` - Store GST rate configurations
- `products` - Store product information
- `invoices` - Store sales invoices
- `business_profiles` - Store business profile information

All tables have Row Level Security (RLS) enabled, ensuring users can only access their own data.

## Features

After setup, you can:

1. **Add Categories**: When adding a product, click "+ Add Category" to create new categories. The form stays open so you can add multiple categories at once.

2. **Add GST Rates**: Click "+ Add GST" to create custom GST rates. Like categories, the form stays open for adding multiple rates.

3. **Manage Products**: All products, categories, and GST rates are saved to Supabase and persist across sessions.

4. **Authentication**: Users sign up and sign in using Supabase authentication. Each user has their own separate data.

## Important Notes

- Categories and GST rates are saved to separate database tables
- Each user's data is isolated and secure
- All data changes are saved automatically to Supabase
- Real-time updates are enabled for products and invoices
