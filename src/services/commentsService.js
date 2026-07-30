import { supabase } from '../supabaseClient';

export const fetchCommentsByPostId = async (postId) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

export const createComment = async (commentData) => {
  const { data, error } = await supabase
    .from('comments')
    .insert([commentData])
    .select();

  if (error) throw error;
  return data[0];
};