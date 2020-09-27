import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {
    // empty
  }

  public async execute({ name, email }: IRequest): Promise<Customer> {
    const findCustomerWithSameEmail = await this.customersRepository.findByEmail(
      email,
    );

    if (findCustomerWithSameEmail)
      throw new AppError(
        'There is already a customer registered with this e-mail.',
      );

    const customer = await this.customersRepository.create({
      name,
      email,
    });

    return customer;
  }
}

export default CreateCustomerService;
