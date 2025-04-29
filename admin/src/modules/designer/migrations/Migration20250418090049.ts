import { Migration } from '@mikro-orm/migrations';

export class Migration20250418090049 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "design_type" ("id" text not null, "name" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "design_type_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_design_type_deleted_at" ON "design_type" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "design" ("id" text not null, "name" text not null, "img_url" text not null, "guide_url" text not null, "meta_data" jsonb null, "design_type_id" text not null, "collection_id" text null, "product_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "design_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_design_design_type_id" ON "design" (design_type_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_design_deleted_at" ON "design" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "design" add constraint "design_design_type_id_foreign" foreign key ("design_type_id") references "design_type" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "design" drop constraint if exists "design_design_type_id_foreign";`);

    this.addSql(`drop table if exists "design_type" cascade;`);

    this.addSql(`drop table if exists "design" cascade;`);
  }

}
