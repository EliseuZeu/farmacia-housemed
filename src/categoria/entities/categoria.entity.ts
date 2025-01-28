import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Produto } from "../../produto/entities/produto.entity"; // Importando Produto

@Entity({ name: "tb_categoria" })
export class Categoria {

    @PrimaryGeneratedColumn()  // Chave primaria auto incremento
    id: number;

    @IsNotEmpty() // Validação
    @Column({ length: 100, nullable: false }) // Coluna do banco de dados
    nome: string;

    @IsNotEmpty() // Validação
    @Column({
        type: 'enum',
        enum: ['ativo', 'inativo'],
        default: 'ativo',
    }) // Coluna do banco de dados
    status: string;

    // Relacionamento OneToMany com Produto
    @OneToMany(() => Produto, produto => produto.categoria)
    produtos: Produto[];
}
