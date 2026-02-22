import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateRoomsTable1771345260000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "rooms",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: "code",
                        type: "varchar",
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: "ownerId", 
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "guestId", 
                        type: "int",
                        isNullable: true, 
                    },
                    {
                        name: "status",
                        type: "varchar",
                        default: "'waiting'", 
                    },
                    {
                        name: "ownerScore",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "guestScore",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    }
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey("rooms", new TableForeignKey({
            columnNames: ["ownerId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE" 
        }));

        await queryRunner.createForeignKey("rooms", new TableForeignKey({
            columnNames: ["guestId"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "SET NULL"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("rooms");
    }
}