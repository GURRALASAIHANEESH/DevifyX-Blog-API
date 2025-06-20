const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function makeAdmin(userId) {
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: {
      is_admin: true
    }
  });

  if (error) {
    console.error('❌ Failed to make user admin:', error.message);
  } else {
    console.log('✅ User promoted to admin:', data.user.email);
  }
}

// Replace with your user's ID:
makeAdmin('9227de28-aa01-4df8-a539-2096bc643516');
