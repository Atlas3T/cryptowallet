import { shallowMount } from '@vue/test-utils';
import Payment from '@/components/RecentPayments/Payment.vue';
import Amount from '@/components/RecentPayments/Amount.vue';

describe('Payment.vue', () => {
  let wrapper;

  const propsData = {
    'payment': {
      amount: 8.1,
      title: 'From Tom Jones',
      ts: 1539866783020,
    },
  };

  function wrapperInit (options) {
    return shallowMount(Payment, options);
  }

  function storeInit (custom) {
    wrapper = wrapperInit({ propsData });
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders the payment title string correctly', () => {
    expect(wrapper.html().includes('From Tom Jones')).toBe(true);
  });

  it('renders the Amount component withing it', () => {
    expect(wrapper.contains(Amount)).toBe(true);
  });

  it('renders the payment time string', () => {
    expect(wrapper.html().includes('13:46')).toBe(true);
  });
});