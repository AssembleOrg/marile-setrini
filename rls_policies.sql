-- Enable Row Level Security
ALTER TABLE "Property" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AdminUser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContactMessage" ENABLE ROW LEVEL SECURITY;

-- Property Policies
-- Anyone can view properties
CREATE POLICY "Public read access for properties" ON "Property"
FOR SELECT USING (true);

-- Only authenticated users (admins) can modify properties
CREATE POLICY "Admin full access for properties" ON "Property"
FOR ALL USING (auth.role() = 'authenticated');


-- AdminUser Policies
-- Only authenticated users can manage admin users
CREATE POLICY "Admin full access for admin_users" ON "AdminUser"
FOR ALL USING (auth.role() = 'authenticated');


-- ContactMessage Policies
-- Anyone can submit a contact message
CREATE POLICY "Public insert for contact messages" ON "ContactMessage"
FOR INSERT WITH CHECK (true);

-- Only admins can read/delete messages
CREATE POLICY "Admin select contact messages" ON "ContactMessage"
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete contact messages" ON "ContactMessage"
FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin update contact messages" ON "ContactMessage"
FOR UPDATE USING (auth.role() = 'authenticated');
