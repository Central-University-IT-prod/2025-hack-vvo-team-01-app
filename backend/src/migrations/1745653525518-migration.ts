import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1745653525518 implements MigrationInterface {
  name = 'Migration1745653525518';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "participant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tournamentId" uuid, "userId" uuid, "teamId" uuid, CONSTRAINT "PK_64da4237f502041781ca15d4c41" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "team" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "color" character varying NOT NULL, "avatarUrl" character varying, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "sportId" uuid, "entriesId" uuid, CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sport_scoringtype_enum" AS ENUM('goals', 'win_lose')`,
    );
    await queryRunner.query(
      `CREATE TABLE "sport" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "scoringType" "public"."sport_scoringtype_enum" NOT NULL DEFAULT 'goals', "isTeamBased" boolean NOT NULL DEFAULT false, "pointsForWin" integer NOT NULL DEFAULT '3', "pointsForDraw" integer NOT NULL DEFAULT '1', "pointsForLoss" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_c67275331afac347120a1032825" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."match_status_enum" AS ENUM('upcoming', 'finished')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."match_result_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "match" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "timestamp" TIMESTAMP NOT NULL, "status" "public"."match_status_enum" NOT NULL DEFAULT 'upcoming', "score1" integer, "score2" integer, "result" "public"."match_result_enum", "tournamentId" uuid, "participant1Id" uuid, "participant2Id" uuid, CONSTRAINT "PK_92b6c3a6631dd5b24a67c69f69d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tournament_type_enum" AS ENUM('league', 'playoff')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tournament_status_enum" AS ENUM('pending', 'approved', 'rejected', 'upcoming', 'ongoing', 'finished')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tournament" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "type" "public"."tournament_type_enum" NOT NULL DEFAULT 'league', "status" "public"."tournament_status_enum" NOT NULL DEFAULT 'pending', "pointsForWin" integer, "pointsForDraw" integer, "pointsForLoss" integer, "location" character varying, "matchDuration" integer, "registrationLimit" integer, "authorId" uuid, "sportId" uuid, CONSTRAINT "PK_449f912ba2b62be003f0c22e767" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "tournamentId" uuid, "authorId" uuid, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "telegramId" integer NOT NULL, "telegramName" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "avatarUrl" character varying, "age" integer, "weight" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6758e6c1db84e6f7e711f8021f5" UNIQUE ("telegramId"), CONSTRAINT "UQ_97637ecf02939529bd4fe5ebd8f" UNIQUE ("telegramName"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "team_members_user" ("teamId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_946e161af78b3cc26186236d3bd" PRIMARY KEY ("teamId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b3f2c420a7871621010a4e1d21" ON "team_members_user" ("teamId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_45db1cff3b87cc40512fb2963e" ON "team_members_user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "participant" ADD CONSTRAINT "FK_99cba5cb409eb7e657295b474ba" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "participant" ADD CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "participant" ADD CONSTRAINT "FK_de50d18cd1e7a9c50438149510b" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_7f0ff226a6b0fd12c02991f801e" FOREIGN KEY ("sportId") REFERENCES "sport"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_a0c7f1c93d8d7293b97a4a68091" FOREIGN KEY ("entriesId") REFERENCES "participant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_b096f0c0ca94610b3e77128500c" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_50e72511f5cce0248f6d6f9dd51" FOREIGN KEY ("participant1Id") REFERENCES "participant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" ADD CONSTRAINT "FK_9fcd1dc34ceb2d08e470d083f92" FOREIGN KEY ("participant2Id") REFERENCES "participant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD CONSTRAINT "FK_c557c9c42b3c8d646981aeb0c1e" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tournament" ADD CONSTRAINT "FK_a0547105de9061c828917f5af52" FOREIGN KEY ("sportId") REFERENCES "sport"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_5a474633f7fff0bf3642acc3795" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members_user" ADD CONSTRAINT "FK_b3f2c420a7871621010a4e1d212" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members_user" ADD CONSTRAINT "FK_45db1cff3b87cc40512fb2963ea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team_members_user" DROP CONSTRAINT "FK_45db1cff3b87cc40512fb2963ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members_user" DROP CONSTRAINT "FK_b3f2c420a7871621010a4e1d212"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_276779da446413a0d79598d4fbd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_5a474633f7fff0bf3642acc3795"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tournament" DROP CONSTRAINT "FK_a0547105de9061c828917f5af52"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tournament" DROP CONSTRAINT "FK_c557c9c42b3c8d646981aeb0c1e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_9fcd1dc34ceb2d08e470d083f92"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_50e72511f5cce0248f6d6f9dd51"`,
    );
    await queryRunner.query(
      `ALTER TABLE "match" DROP CONSTRAINT "FK_b096f0c0ca94610b3e77128500c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "FK_a0c7f1c93d8d7293b97a4a68091"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team" DROP CONSTRAINT "FK_7f0ff226a6b0fd12c02991f801e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "participant" DROP CONSTRAINT "FK_de50d18cd1e7a9c50438149510b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "participant" DROP CONSTRAINT "FK_b915e97dea27ffd1e40c8003b3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "participant" DROP CONSTRAINT "FK_99cba5cb409eb7e657295b474ba"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_45db1cff3b87cc40512fb2963e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b3f2c420a7871621010a4e1d21"`,
    );
    await queryRunner.query(`DROP TABLE "team_members_user"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(`DROP TABLE "tournament"`);
    await queryRunner.query(`DROP TYPE "public"."tournament_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."tournament_type_enum"`);
    await queryRunner.query(`DROP TABLE "match"`);
    await queryRunner.query(`DROP TYPE "public"."match_result_enum"`);
    await queryRunner.query(`DROP TYPE "public"."match_status_enum"`);
    await queryRunner.query(`DROP TABLE "sport"`);
    await queryRunner.query(`DROP TYPE "public"."sport_scoringtype_enum"`);
    await queryRunner.query(`DROP TABLE "team"`);
    await queryRunner.query(`DROP TABLE "participant"`);
  }
}
