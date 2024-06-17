-- CreateTable
CREATE TABLE "todos" (
    "title" VARCHAR(100),
    "id" UUID NOT NULL,

    CONSTRAINT "todos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "civility" INTEGER NOT NULL,
    "id" UUID NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "lastname" VARCHAR(100) NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "password" VARCHAR(300) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "doubleAuth" BOOLEAN NOT NULL,
    "registerToken" VARCHAR(300),
    "registerDate" DATE,
    "updateDate" DATE,
    "rememberToken" VARCHAR(300),
    "forgetToken" VARCHAR(300),
    "forgetDate" DATE,
    "try5" BOOLEAN NOT NULL,
    "try10" BOOLEAN NOT NULL,
    "tokenRevalidateAccount" VARCHAR(300),
    "revalitateAccountDate" DATE,
    "role" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "todos_id_key" ON "todos"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_password_key" ON "users"("password");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
