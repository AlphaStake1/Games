# Schema Versioning and Migrations

This document describes the process for updating the database schema and managing versioning for the indexer.

## TypeORM Migrations

We use `squid-typeorm-migration` for handling database schema changes. This tool, an extension of TypeORM migrations, is essential for evolving the schema without data loss.

When you modify the `schema.graphql` file, you'll need to generate a new migration.

### Migration Checklist

1.  **Write Migration:** After changing your schema, run the migration generation command:

    ```bash
    sqd migration:generate
    ```

    This will create a new migration file in `db/migrations/`.

2.  **Run Locally:** Apply the migration to your local development database to verify it works as expected.

    ```bash
    sqd up
    ```

    The `up` command will apply any pending migrations.

3.  **Push Changes:** Commit the new migration file along with your schema changes to your Git repository.

4.  **CI/CD Deploy:** The CI/CD pipeline will automatically run migrations as part of the deployment process.

## Bumping Semantic Versions

For Subsquid Cloud deployments, it's important to bump the version in your `squid.yaml` manifest file when you introduce breaking schema changes. This ensures that a new, clean database is provisioned for the updated squid version.

```yaml
# squid.yaml
manifestVersion: subsquid.io/v0.1
name: football-squares
version: 2 # Increment this version number
```
