-- Optional seed data. Spring Boot only auto-runs this if spring.sql.init.mode=always is set.
-- Safer in practice: run manually after the schema is created by Hibernate (ddl-auto=update).

-- Default admin account: email admin@lumera.com / password Admin@123
-- (password below is a bcrypt hash for 'Admin@123' — regenerate for production use)
INSERT INTO users (full_name, email, password, role, enabled, created_at)
SELECT 'Lumera Admin', 'admin@lumera.com',
       '$2a$10$5eJt5eQKz1z3vJHqjq2X4uD6z3pQd1cQ6qk3s0v0yQ2f0m7bF9m0K',
       'ROLE_ADMIN', 1, NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@lumera.com');

INSERT INTO products (name, brand, category, gender, description, price, discount_price, stock, image_url, volume, active, created_at, updated_at)
VALUES
('Nocturne Bloom', 'Lumera', 'Eau de Parfum', 'Women', 'A moonlit bouquet of night-blooming jasmine, white musk and cedar.', 89.00, 74.00, 40, '', '50ml', 1, NOW(), NOW()),
('Velvet Oud', 'Lumera', 'Eau de Parfum', 'Unisex', 'Smoky oud wrapped in rose and amber for a bold evening presence.', 129.00, NULL, 25, '', '100ml', 1, NOW(), NOW()),
('Citrus Reverie', 'Lumera', 'Eau de Toilette', 'Men', 'Bright bergamot and sicilian lemon over a base of vetiver.', 65.00, NULL, 60, '', '100ml', 1, NOW(), NOW()),
('Golden Dusk', 'Lumera', 'Eau de Parfum', 'Women', 'Warm amber, vanilla orchid and sandalwood for a radiant finish.', 95.00, 80.00, 30, '', '50ml', 1, NOW(), NOW()),
('Silver Fern', 'Lumera', 'Eau de Toilette', 'Men', 'Crisp green fern with a whisper of iris and driftwood.', 70.00, NULL, 45, '', '100ml', 1, NOW(), NOW());
