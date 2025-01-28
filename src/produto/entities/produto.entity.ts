import { IsNotEmpty, IsPositive, IsOptional, Length } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Categoria } from "../../categoria/entities/categoria.entity";

@Entity({ name: "tb_produto" })
export class Produto {
  @PrimaryGeneratedColumn() // Chave primária
  id: number;

  @IsNotEmpty()
  @Length(3, 100)
  @Column({ length: 100, nullable: false }) // Nome do produto
  nome: string;

  @IsNotEmpty()
  @Length(5, 255) // Valida se o tamanho da string é entre 5 e 255
  @Column({ length: 255, nullable: false }) // Descrição detalhada
  descricao: string;

  @IsPositive() // Valida se o valor é maior que 0
  @IsNotEmpty()
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false }) // Preço do produto
  preco: number;

  @IsOptional()
  @Column({ length: 255, nullable: true }) // Imagem opcional (URL)
  imagem: string;

  @IsNotEmpty()
  @Column({ type: "int", default: 0 }) // Quantidade em estoque
  quantidade: number;

  @IsNotEmpty()
  @Column({
    type: "enum",
    enum: ["disponível", "indisponível"],
    default: "disponível",
  }) // Status do produto
  status: string;

 @ManyToOne(() => Categoria, (categoria) => categoria.id, { eager: true })
 categoria: Categoria; // Relacionamento com Categoria
}
