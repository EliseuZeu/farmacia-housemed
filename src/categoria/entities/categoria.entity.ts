import { IsNotEmpty } from "class-validator"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({name: "tb_categoria"})
export class Categoria {

    @PrimaryGeneratedColumn()  //Chave primaria auto incremento
    id: number

    @IsNotEmpty() //Validação
    @Column({length: 100, nullable: false}) //Coluna do banco de dados
    nome: string

    @IsNotEmpty() //Validation
    @Column({
        type: 'enum',
        enum: ['ativo', 'inativo'],
        default: 'ativo'
    }) //Database column
    status: string
}