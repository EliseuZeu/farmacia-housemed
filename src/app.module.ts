import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './categoria/entities/categoria.entity';
import { CategoriaModule } from './categoria/categoria.module';
import { Produto } from './produto/entities/produto.entity';
import { ProdutoModule } from './produto/produto.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({  //Configuração do banco de dados
      type: 'mysql',  //Tipo do banco de dados
      host: 'localhost',  //Endereço do banco de dados
      port: 3306, //Porta do banco de dados
      username: 'root', //Usuario do banco de dados
      password: '193243', //Senha do banco de dados
      database: 'db_housemed', //Banco de dados housemed farmacia 
      entities: [Categoria, Produto],   //Entidades do banco de dados
      synchronize: true, //Sincronização do banco de dados
    }), CategoriaModule, ProdutoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}