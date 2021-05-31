
-- @block Get users
SELECT * FROM Users

-- @block Create USER
INSERT INTO Users (email, password) 
VALUES ("benji@fonzmusic.com", "password")


--{
--   "localId": "0aovUNdpi2OeCluTmG2UajZzLtt1",
--   "email": "king@gmail.com",
--   "emailVerified": false,
--   "passwordHash": "nSIBhAy142yEsL2XifEMhMbHnXztEuIFC20Jh+9tjRcQ6IJTd6I02tycRbuOj5lepwcCGAk+KEeD2HyWB59O5w==",
--   "salt": "2Q1chyYAHya6ww==",
--   "lastSignedInAt": "1604080619805",
--   "createdAt": "1604080619805",
--   "providerUserInfo": []
-- },

--@block Update users table
ALTER TABLE Users
ADD passwordSalt VARCHAR(100) AFTER password;
-- ADD userId VARCHAR(28) NOT NULL; 
-- ALTER emailVerified SET DEFAULT 0;
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