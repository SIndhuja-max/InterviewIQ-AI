import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/* =========================
   MOCK INTERVIEW TABLE
========================= */

export const MockInterview =
  pgTable(
    "mockInterview",
    {

      id: serial("id")
        .primaryKey(),

      // AI generated Q&A JSON
      jsonMockResp: text(
        "jsonMockResp"
      ).notNull(),

      // Job Details
      jobPosition: varchar(
        "jobPosition",
        { length: 255 }
      ).notNull(),

      jobDesc: varchar(
        "jobDesc",
        { length: 500 }
      ).notNull(),

      jobExperience: text("jobExperience").notNull(),

      // Clerk User Email
      createdBy: varchar(
        "createdBy",
        { length: 255 }
      ).notNull(),

      // Created Timestamp
      createdAt: timestamp(
        "createdAt"
      ).defaultNow(),
    }
  );

/* =========================
   USER ANSWERS TABLE
========================= */

export const UserAnswer =
  pgTable(
    "userAnswer",
    {

      id: serial("id")
        .primaryKey(),

      mockIdRef: varchar(
        "mockIdRef"
      ).notNull(),

      question: text(
        "question"
      ).notNull(),

      correctAns: text(
        "correctAns"
      ),

      userAns: text(
        "userAns"
      ).notNull(),

      feedback: text(
        "feedback"
      ),

      rating: varchar(
        "rating",
        { length: 50 }
      ),

      userEmail: varchar(
        "userEmail",
        { length: 255 }
      ),

      createdAt: timestamp(
        "createdAt"
      ).defaultNow(),
    }
  );

/* =========================
   USER SETTINGS TABLE
========================= */

export const UserSettings =
  pgTable(
    "userSettings",
    {

      id: serial("id")
        .primaryKey(),

      userEmail: varchar(
        "userEmail",
        { length: 255 }
      ).notNull(),

      // Interview Difficulty
      difficulty: varchar(
        "difficulty",
        { length: 50 }
      ).default(
        "Intermediate"
      ),

      // Notifications
      notifications: varchar(
        "notifications",
        { length: 20 }
      ).default(
        "enabled"
      ),

      // AI Feedback
      aiFeedback: varchar(
        "aiFeedback",
        { length: 20 }
      ).default(
        "enabled"
      ),
    }
  );