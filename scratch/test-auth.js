const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

console.log('Testing Supabase Auth with URL:', supabaseUrl);
console.log('Anon Key length:', supabaseKey ? supabaseKey.length : 0);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
  const testEmail = 'testuser_' + Date.now() + '@example.com';
  const testPassword = 'Password123!';
  
  console.log('\n--- 1. Testing Registration ---');
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: { full_name: 'Test User' }
    }
  });

  if (signUpError) {
    console.error('Signup Error:', signUpError.message);
    return;
  }
  console.log('Signup Success:', signUpData.user ? signUpData.user.email : 'No user returned');

  console.log('\n--- 2. Testing Login ---');
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (signInError) {
    console.error('Login Error:', signInError.message);
    // Some setups require email confirmation before login works.
    if (signInError.message.includes('Email not confirmed')) {
      console.log('Note: Login failed because email confirmation is required by Supabase settings, which is expected behavior.');
    } else {
      return;
    }
  } else {
    console.log('Login Success:', signInData.user ? signInData.user.email : 'No user returned');
  }
}

testAuth();
