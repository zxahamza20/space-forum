import { supabase } from '../supabaseClient';

export const uploadMediaFile = async (file) => {
  if (!file) return null;

  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a valid image (JPEG, PNG, GIF, WEBP, SVG).');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File is too large. Maximum size is 5MB.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('space_media')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw new Error('Failed to upload file to storage.');
  }

  const { data } = supabase.storage
    .from('space_media')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const deleteMediaFile = async (fileUrl) => {
  if (!fileUrl) return;
  
  try {
    const urlParts = fileUrl.split('/');
    const filePath = urlParts.slice(urlParts.indexOf('space_media') + 2).join('/');
    
    if (!filePath) return;
    
    const { error } = await supabase.storage
      .from('space_media')
      .remove([filePath]);
      
    if (error) {
      console.error('Error deleting file:', error);
    }
  } catch (error) {
    console.error('Error deleting media file:', error);
  }
};