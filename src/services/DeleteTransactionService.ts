// import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    // TODO
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    // get id and delete it
    const transaction = await transactionsRepository.findOne({
      where: { id },
    });
    if (transaction) {
      await transactionsRepository.remove(transaction);
    } else {
      throw new AppError('Id not found');
    }
  }
}

export default DeleteTransactionService;
