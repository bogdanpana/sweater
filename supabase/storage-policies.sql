-- Storage policies for ugc bucket
-- Run this in Supabase SQL Editor

-- Allow authenticated and anonymous users to upload to ugc bucket
CREATE POLICY "Allow public uploads to ugc bucket"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'ugc');

-- Allow public read access to ugc bucket
CREATE POLICY "Allow public reads from ugc bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'ugc');

-- Allow users to update their own uploads
CREATE POLICY "Allow public updates to ugc bucket"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'ugc')
WITH CHECK (bucket_id = 'ugc');

-- Allow users to delete from ugc bucket
CREATE POLICY "Allow public deletes from ugc bucket"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'ugc');
