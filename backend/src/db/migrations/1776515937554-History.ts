import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateBattleHistory1776515937554 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'history',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'room_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'status_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'cost',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'owner_positions',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'guest_positions',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'history',
      new TableForeignKey({
        columnNames: ['room_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'rooms',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('history');
  }
}
