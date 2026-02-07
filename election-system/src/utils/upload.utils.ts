import { supabase } from '../config/supabase';
import { AppError } from './appError';
import { v4 as uuidv4 } from 'uuid';

export const uploadToSupabase = async (
  file: Express.Multer.File,
  bucket: string
): Promise<string> => {
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = `${bucket}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('election-assets')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new AppError(`Failed to upload file: ${error.message}`, 500);
  }

  const { data: urlData } = supabase.storage
    .from('election-assets')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};

export const deleteFromSupabase = async (fileUrl: string): Promise<void> => {
  // Extract path from URL
  const urlParts = fileUrl.split('/');
  const bucketIndex = urlParts.findIndex((part) => part === 'election-assets');
  if (bucketIndex === -1) return;

  const filePath = urlParts.slice(bucketIndex + 1).join('/');

  const { error } = await supabase.storage
    .from('election-assets')
    .remove([filePath]);

  if (error) {
    console.error(`Failed to delete file: ${error.message}`);
  }
};
