-- City table
CREATE TABLE city (
    city_id SERIAL PRIMARY KEY,
    city_code VARCHAR(2) NOT NULL,
    city_name VARCHAR(50) NOT NULL
);

-- Registration table
CREATE TABLE registration (
    registration_id SERIAL PRIMARY KEY,
    plate_number VARCHAR(20) NOT NULL,
    city_id INT REFERENCES city(city_id)
);


INSERT INTO city (city_code, city_name) VALUES
  ('CA', 'Cape Town'),
  ('L', 'Polokwane'),
  ('ND', 'Durban'),
  ('GP', 'Johannesburg');