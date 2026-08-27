import { supabase } from './supabase';

export interface CaseStudy {
  id: number;
  title: string;
  description: string;
  image_url: string;
  slug?: string;
  tags?: string[];
  order?: number;
}

export async function fetchCaseStudies(): Promise<CaseStudy[]> {
  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .order('order', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}
