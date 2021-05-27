
-- @block Get users
SELECT * FROM Users

--@block Update users table
ALTER TABLE Users
ALTER emailVerified SET DEFAULT 0;
-- MODIFY COLUMN emailVerified BOOLEAN;
-- ADD createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP();
-- ADD lastSignedInAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP();

--@block Get users DESC
DESC Users

--@block Create providers TABLE
CREATE TABLE providers (
    `userId` INT NOT NULL,
    `provider` TEXT NOT NULL,
    `rawId` INT NOT NULL,
    `email` VARCHAR(255),
    `displayName` VARCHAR(255)
);

-- @block Get providers
SELECT * FROM Providers
-- desc providers

-- @block Add user provider
INSERT INTO Providers VALUES (
    1,
    "GOOGLE",
    98765,
    "contact@dermotobrien.me",
    "Dermot"
);