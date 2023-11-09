import { paymentPixMock } from '../../payment/mocks/paymentPix.mock';
import { addressMock } from '../../address/mocks/address.mock';
import { CreateOrderDTO } from '../dtos/create-order.dto';
import { paymentCCMock } from '../../payment/mocks/paymentCC.mock';

export const createOrderMockPix: CreateOrderDTO = {
  addressId: addressMock.id,
  codePix: paymentPixMock.code,
  datePayment: 'Data de hoje',
};

export const createOrderMockCC: CreateOrderDTO = {
  addressId: addressMock.id,
  amountPayments: paymentCCMock.amountPayments,
};

export const createOrderFakeMock: CreateOrderDTO = {
  addressId: addressMock.id,
};
