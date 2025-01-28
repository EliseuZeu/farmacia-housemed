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
      },
    });
  }

  // Verificar se a categoria existe antes de salvar o produto
  async validateCategoriaExists(categoriaId: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({ where: { id: categoriaId } });
    if (!categoria) {
      throw new HttpException("Categoria não encontrada!", HttpStatus.BAD_REQUEST);
    }
    return categoria;
  }

  async create(produto: Produto): Promise<Produto> {
    // Verificar se a categoria existe
    await this.validateCategoriaExists(produto.categoria.id);

    return await this.produtoRepository.save(produto);
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
