-- Create places table
CREATE TABLE places (
place_id TEXT NOT NULL,
popular_times_response TEXT);

-- Create ratings table
CREATE TABLE ratings (
place_id TEXT NOT NULL,
rating INTEGER);

CREATE TABLE infections (
    notification_date TEXT,
    postcode TEXT,
    source_of_infection TEXT,
    suburb_code TEXT,
    suburb_name TEXT,
    lga_code TEXT,
    lga_name TEXT
);