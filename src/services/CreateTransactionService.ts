import { getCustomRepository, getRepository } from 'typeorm';
import Category from '../models/Category';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
interface Balance {
  income: number;
  outcome: number;
  total: number;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    // TODO

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    const checkType = ['income', 'outcome'];
    if (!checkType.includes(type)) {
      throw new AppError('Invalid transaction type');
    }
    if (type === 'outcome' && value > total) {
      throw new AppError('Transaction not authorized: Insuficient funds');
    }

    let categoryTag = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!categoryTag) {
      categoryTag = categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(categoryTag);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: categoryTag,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
