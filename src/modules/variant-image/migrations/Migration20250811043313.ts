import { Migration } from '@mikro-orm/migrations';

export class Migration20250811043313 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "product_gallery" ("id" text not null, "product_id" text not null, "orientation" text check ("orientation" in ('square', 'portrait', 'landscape', 'full')) not null, "url" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_gallery_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_gallery_deleted_at" ON "product_gallery" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "product_gallery" cascade;`);
  }

}
