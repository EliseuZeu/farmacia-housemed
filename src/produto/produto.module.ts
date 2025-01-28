import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Produto } from "./entities/produto.entity";  // Importa a entidade Produto
import { ProdutoService } from "./services/produto.service";  // Importa o serviço Produto
import { ProdutoController } from "./controllers/produto.controller";  // Importa o controlador Produto
import { Categoria } from "../categoria/entities/categoria.entity";  // Importa Categoria para garantir a relação

@Module({
    imports: [TypeOrmModule.forFeature([Produto, Categoria])],  // Inclui Produto e Categoria
    providers: [ProdutoService],  // Declara o serviço do Produto
    controllers: [ProdutoController],  // Declara o controlador do Produto
    exports: [ProdutoService],  // Exporta o serviço Produto se necessário para outros módulos
})
export class ProdutoModule {}
