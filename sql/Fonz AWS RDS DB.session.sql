
-- @block Get users
SELECT * FROM Users

-- @block Get specific user
SELECT * FROM Users WHERE userId = 'PYTOLmxn9PUsz8rhBwwux1oIWao1'

-- @block Get users
SELECT COUNT(*) FROM Users

-- @block Create USER
INSERT INTO Users (userId, email, password) 
VALUES ("E6gbirpVBgasWsvuRGjGANYGiQl2", " bq9wuj3i5f@privaterelay.appleid.com", "")

--@block Fix Users TABLE
UPDATE Users 
-- SET userId = '7op26c4l5NernSR56LFak4GTmbz1'
-- WHERE email = 'didi@fonzmusic.com'
SET agreedConsent = 1, agreedMarketing = 1;

-- @block Delete users table
DELETE IGNORE FROM Users;
-- TRUNCATE TABLE Users;

--@block Update users table
ALTER TABLE Users
ADD firebaseImport TINYINT NOT NULL DEFAULT 0
-- ADD providerSignIn TINYINT NOT NULL
-- ALTER providerSignIn SET DEFAULT 0
-- ADD displayName VARCHAR(255)

-- ADD agreedConsent TINYINT NOT NULL,
-- ADD agreedMarketing TINYINT NOT NULL;


-- DROP COLUMN id;
-- DROP PRIMARY KEY,
-- ADD PRIMARY KEY (userId);
-- ADD UNIQUE (userId);

-- MODIFY COLUMN userId SET UNIQUE;
-- ADD userId VARCHAR(28) NOT NULL FIRST;
-- CHANGE COLUMN userId userId NOT NULL VARCHAR(28) AFTER id;
-- ADD passwordSalt VARCHAR(100) AFTER password;
-- ADD userId VARCHAR(28) NOT NULL DEFAULT 'NA'
-- ALTER emailVerified SET DEFAULT 0;
-- MODIFY COLUMN emailVerified BOOLEAN;
-- ADD createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP();
-- ADD lastSignedInAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP();


--@block Debug Primary Key
SELECT userId,COUNT(userId)
FROM Users
GROUP BY userId
HAVING COUNT(userId) >1

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
-- SELECT * FROM Providers
desc Providers

-- @block Add user provider
INSERT INTO Providers VALUES (
    1,
    "GOOGLE",
    98765,
    "contact@dermotobrien.me",
    "Dermot"
);

--@block List all Tables
SHOW Tables;

--@block Create Sessions Table
CREATE TABLE Sessions (
    `sessionId` VARCHAR(28) NOT NULL,
    `userId` INT NOT NULL,
    `status` TINYINT DEFAULT 1,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `provider` TEXT NOT NULL
);

--@block Desc Sessions
DESC Sessions;

--@block Manage Sessions Table
ALTER TABLE Sessions
-- ADD active TINYINT AFTER userId;
-- DROP COLUMN status;
-- MODIFY active TINYINT NOT NULL DEFAULT 1;
ADD providerId VARCHAR(28),
ADD FOREIGN KEY (providerId) REFERENCES MusicProviders(providerId);
-- ADD FOREIGN KEY (userId) REFERENCES Users(userId);

--@block Get Sessions contents
SELECT * FROM Sessions;

--@block Remove providerId from Sessions
ALTER TABLE Sessions
DROP COLUMN FOREIGN KEY providerId;

--@block Clear Sessions table
DELETE IGNORE FROM Sessions;

--@block Insert into Sessions
INSERT INTO Sessions VALUES (
    'UROqkPBzZ1U3YWZfp6HO2AwpkEh1',
    ''
);

--@block Create MusicProviders Table
CREATE TABLE MusicProviders (
    `musicProviderId` VARCHAR(28) NOT NULL,
    `userId` VARCHAR(28) NOT NULL,
    `musicProvider` TEXT NOT NULL,
    `country` TEXT NOT NULL,
    `displayName` VARCHAR(255),
    `expiresIn` INT NOT NULL,
    `accessToken` VARCHAR(255) NOT NULL,
    `refreshToken` VARCHAR(255) NOT NULL,
    `additional` VARCHAR(512),
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `lastUpdated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (musicProviderId),
    FOREIGN KEY (userId) REFERENCES Users(userId)
);

--@block Drop Music Providers
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE MusicProviders;
SET FOREIGN_KEY_CHECKS = 1;

--@block DESC MusicProviders Table
DESC MusicProviders;

--@block Get MusicProviders Content
SELECT * FROM MusicProviders;

--@block Create Coasters Table
CREATE TABLE Coasters (
    `coasterId` VARCHAR(28) NOT NULL,
    `userId` VARCHAR(28),
    `active` TINYINT NOT NULL DEFAULT 1,
    `paused` TINYINT NOT NULL DEFAULT 0,
    `name` VARCHAR(255),
    PRIMARY KEY (coasterId),
    FOREIGN KEY (userId) REFERENCES Users(userId)
);


--@block DESC Coasters Table
DESC Coasters;

--@block Alter Coasters
ALTER TABLE Coasters
CHANGE COLUMN userId userId VARCHAR(28)

--@block Get Coasters Content
SELECT * FROM Coasters;

--@block Get Coasters count
SELECT COUNT(*) FROM Coasters;

--@block Delete all coasters
DELETE FROM Coasters;

--@block Insert singular coaster
INSERT INTO Coasters (coasterId, userId, active, paused, name) 
            VALUES ('0487E41AE66C80', 'E6gbirpVBgasWsvuRGjGANYGiQl2', 1, 0, '98 Franklin ');