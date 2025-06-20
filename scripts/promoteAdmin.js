require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // important!
);

const promoteUserToAdmin = async () => {
  const userId = '0f55690d-84ed-4c4c-b901-80bfc7004cd3'; // 👈 paste your Supabase UID

  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: {
      is_admin: true
    }
  });

  if (error) {
    console.error('❌ Failed to promote:', error.message);
  } else {
    console.log('✅ User promoted to admin:', data.user.id);
  }
};

promoteUserToAdmin();
