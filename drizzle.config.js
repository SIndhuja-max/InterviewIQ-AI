/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:npg_Rb7BkcXrV6Zz@ep-rough-cell-ao6lk2zk.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
    }
  };