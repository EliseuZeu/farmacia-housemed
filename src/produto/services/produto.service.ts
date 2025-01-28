import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Produto } from "../entities/produto.entity";
import { Categoria } from "../../categoria/entities/categoria.entity"; // Importa a entidade Categoria

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,

    @InjectRepository(Categoria) // Injetar o repositório de Categoria
    private categoriaRepository: Repository<Categoria>
  ) {}

  async findAll(): Promise<Produto[]> {
    return await this.produtoRepository.find({
      relations: {
        categoria: true,
      },
    });
  }

  async findById(id: number): Promise<Produto> {
    let produto = await this.produtoRepository.findOne({
      where: { id },
      relations: {
        categoria: true,
      },
    });

    if (!produto)
      throw new HttpException("Produto não encontrado!", HttpStatus.NOT_FOUND);

    return produto;
  }

  async findByNome(nome: string): Promise<Produto[]> {
    return await this.produtoRepository.find({
      where: {
        nome: ILike(`%${nome}%`),
      },
      relations: {
        categoria: true,
      },
    });
  }

  async findByCategoria(id: number): Promise<Produto[]> {
    return await this.produtoRepository.find({
      where: {
        id, // Supondo que você tenha uma chave estrangeira de categoria
      },
      relations: {
        categoria: true,
      }, select: ['id','nome','status']// Seleciona apenas os campos necessários
    });
  }

  // Verificar se a categoria existe antes de salvar o produto
async validateCategoriaExists(categoriaId: number): Promise<Categoria> {
  // Buscando a categoria incluindo o nome
  const categoria = await this.categoriaRepository.findOne({
    where: { id: categoriaId },
    select: ["id", "nome"], // Garantindo que o nome da categoria também seja retornado
  });

  // Se a categoria não for encontrada, lança a exceção com o nome
  if (!categoria) {
    throw new HttpException(
      `Categoria com o ID ${categoriaId} e nome ${categoria?.nome || 'não disponível'} não encontrada!`, 
      HttpStatus.BAD_REQUEST
    );
  }

  return categoria;
}


 async create(produto: Produto): Promise<Produto> {
  // Verificar se a categoria existe
  await this.validateCategoriaExists(produto.categoria.id); // Chama a função de validação

  // Verificar se já existe um produto com o mesmo nome (ou outro critério)
  const produtoExistente = await this.produtoRepository.findOne({
    where: { nome: produto.nome }, // Pode alterar para outro critério, caso necessário
  });

  if (produtoExistente) {
    throw new HttpException(
      `Produto com o nome ${produto.nome} já existe!`,
      HttpStatus.BAD_REQUEST
    );
  }

  // Salvar o novo produto
  const produtoCriado = await this.produtoRepository.save(produto);

  // Retornar o produto com id e nome
  return {
    id: produtoCriado.id,
    nome: produtoCriado.nome,
    descricao: produtoCriado.descricao,
    preco: produtoCriado.preco,
    imagem: produtoCriado.imagem,
    quantidade: produtoCriado.quantidade,
    status: produtoCriado.status,
    categoria: produtoCriado.categoria,
  };
}


  async update(produto: Produto): Promise<Produto> {
    // Verificar se a categoria existe
    await this.validateCategoriaExists(produto.categoria.id);

    let buscaProduto = await this.findById(produto.id);

    if (!buscaProduto || !produto.id)
      throw new HttpException("Produto não encontrado!", HttpStatus.NOT_FOUND);

    return await this.produtoRepository.save(produto);
  }

  async delete(id: number): Promise<void> {
    let buscaProduto = await this.findById(id);

    if (!buscaProduto)
      throw new HttpException("Produto não encontrado!", HttpStatus.NOT_FOUND);

    await this.produtoRepository.delete(id);
  }
}
