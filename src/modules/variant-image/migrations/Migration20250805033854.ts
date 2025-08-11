import { Migration } from '@mikro-orm/migrations';

export class Migration20250805033854 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "variant_image" ("id" text not null, "product_variant_id" text not null, "orientation" text check ("orientation" in ('square', 'portrait', 'landscape', 'full')) not null, "url" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "variant_image_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_variant_image_deleted_at" ON "variant_image" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "variant_image" cascade;`);
  }

}
