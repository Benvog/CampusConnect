import { supabaseAdmin } from '../config/supabase';

// Get all active universities
export async function getUniversities() {
  try {
    const { data, error } = await supabaseAdmin
      .from('universities')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, universities: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Get university by domain pattern
export async function getUniversityByDomain(email: string) {
  try {
    const domain = email.split('@')[1];
    
    const { data, error } = await supabaseAdmin
      .from('universities')
      .select('*')
      .ilike('domain_pattern', `%${domain}%`)
      .single();

    if (error) {
      return { success: false, error: 'University not found for this email domain' };
    }

    return { success: true, university: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
