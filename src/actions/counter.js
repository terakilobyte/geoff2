import { COUNTER_INCREMENT, COUNTER_DECREMENT } from 'constants/counter';

export default {
  increment: () => ({ type : COUNTER_INCREMENT }),
  decrement: () => ({ type : COUNTER_DECREMENT })
};
