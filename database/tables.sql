-- City table
CREATE TABLE cities (
    city_id serial PRIMARY KEY, 
    city_code VARCHAR(255),
    city VARCHAR(255) UNIQUE
);

-- Registration table
CREATE TABLE registrations(
    registration_id serial PRIMARY KEY,
    registration_number VARCHAR(255),
    city_id INT REFERENCES cities(city_id)
);
