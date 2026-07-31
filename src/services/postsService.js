import { supabase } from '../supabaseClient';

export const fetchPosts = async ({ searchQuery = '', category = '', sortBy = 'created_at' } = {}) => {
  let query = supabase.from('posts').select('*');

  if (searchQuery) {
    query = query.ilike('title', `%${searchQuery}%`);
  }

  if (category) {
    query = query.eq('category', category);
  }

  if (sortBy === 'upvotes') {
    query = query.order('upvotes', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const fetchPostById = async (id) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createPost = async (postData) => {
  const { data, error } = await supabase
    .from('posts')
    .insert([postData])
    .select();

  if (error) throw error;
  return data[0];
};

export const upvotePost = async (id, currentUpvotes) => {
  const { data, error } = await supabase
    .from('posts')
    .update({ upvotes: currentUpvotes + 1 })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

export const updatePost = async (id, updatedFields) => {
  const { data, error } = await supabase
    .from('posts')
    .update(updatedFields)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

export const deletePost = async (id) => {
  const { data, error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return data;
};

export const flagPost = async (id, currentFlags) => {
  const { data, error } = await supabase
    .from('posts')
    .update({ flags: currentFlags + 1 })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

export const createRepost = async (parentPost, newAuthor) => {
  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        title: `Repost: ${parentPost.title}`,
        content: parentPost.content,
        author: newAuthor || 'Anonymous Stargazer',
        secret_key: `repost_${Date.now()}`,
        media_url: parentPost.media_url,
        media_type: parentPost.media_type,
        parent_id: parentPost.id,
      },
    ])
    .select();

  if (error) throw error;
  return data[0];
};