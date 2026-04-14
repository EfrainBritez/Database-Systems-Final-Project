-- Seed Categories
INSERT INTO categories (name, description) VALUES
  ('Electronics', 'Electronic devices and gadgets'),
  ('Clothing', 'Apparel and fashion items'),
  ('Books', 'Physical and digital books'),
  ('Home & Garden', 'Home decor and gardening supplies'),
  ('Sports', 'Sports equipment and accessories');

-- Seed Tags
INSERT INTO tags (name) VALUES
  ('New Arrival'),
  ('Best Seller'),
  ('On Sale'),
  ('Featured'),
  ('Limited Edition'),
  ('Eco-Friendly');

-- Seed Products
INSERT INTO products (name, description, price, image_url, category_id) VALUES
  ('Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 149.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Smart Watch', 'Feature-rich smartwatch with health monitoring', 299.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Laptop Stand', 'Ergonomic aluminum laptop stand', 79.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', (SELECT id FROM categories WHERE name = 'Electronics')),
  ('Cotton T-Shirt', 'Comfortable 100% organic cotton t-shirt', 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', (SELECT id FROM categories WHERE name = 'Clothing')),
  ('Denim Jeans', 'Classic fit denim jeans', 59.99, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', (SELECT id FROM categories WHERE name = 'Clothing')),
  ('Running Shoes', 'Lightweight running shoes for athletes', 119.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', (SELECT id FROM categories WHERE name = 'Sports')),
  ('Yoga Mat', 'Non-slip premium yoga mat', 39.99, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', (SELECT id FROM categories WHERE name = 'Sports')),
  ('JavaScript Book', 'Complete guide to modern JavaScript', 44.99, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', (SELECT id FROM categories WHERE name = 'Books')),
  ('Plant Pot Set', 'Set of 3 ceramic plant pots', 34.99, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400', (SELECT id FROM categories WHERE name = 'Home & Garden')),
  ('LED Desk Lamp', 'Adjustable LED desk lamp with USB charging', 49.99, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', (SELECT id FROM categories WHERE name = 'Home & Garden'));

-- Seed Product Tags
INSERT INTO product_tags (product_id, tag_id) VALUES
  ((SELECT id FROM products WHERE name = 'Wireless Headphones'), (SELECT id FROM tags WHERE name = 'Best Seller')),
  ((SELECT id FROM products WHERE name = 'Wireless Headphones'), (SELECT id FROM tags WHERE name = 'Featured')),
  ((SELECT id FROM products WHERE name = 'Smart Watch'), (SELECT id FROM tags WHERE name = 'New Arrival')),
  ((SELECT id FROM products WHERE name = 'Smart Watch'), (SELECT id FROM tags WHERE name = 'Featured')),
  ((SELECT id FROM products WHERE name = 'Cotton T-Shirt'), (SELECT id FROM tags WHERE name = 'Eco-Friendly')),
  ((SELECT id FROM products WHERE name = 'Cotton T-Shirt'), (SELECT id FROM tags WHERE name = 'Best Seller')),
  ((SELECT id FROM products WHERE name = 'Running Shoes'), (SELECT id FROM tags WHERE name = 'Best Seller')),
  ((SELECT id FROM products WHERE name = 'Yoga Mat'), (SELECT id FROM tags WHERE name = 'Eco-Friendly')),
  ((SELECT id FROM products WHERE name = 'JavaScript Book'), (SELECT id FROM tags WHERE name = 'Featured')),
  ((SELECT id FROM products WHERE name = 'Plant Pot Set'), (SELECT id FROM tags WHERE name = 'On Sale')),
  ((SELECT id FROM products WHERE name = 'LED Desk Lamp'), (SELECT id FROM tags WHERE name = 'On Sale')),
  ((SELECT id FROM products WHERE name = 'LED Desk Lamp'), (SELECT id FROM tags WHERE name = 'New Arrival'));
